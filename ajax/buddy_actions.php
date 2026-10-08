<?php
// ajax/buddy_actions.php - AJAX API Endpoint for K-Sync Event Buddy Module
header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../includes/functions.php';

if (!is_logged_in()) {
    echo json_encode(['success' => false, 'redirect' => true, 'message' => 'Please log in to use Event Buddy features.']);
    exit;
}

$current_user = get_current_user_data();
$user_id = $_SESSION['user_id'] ?? $current_user['id'] ?? 0;
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'toggle_interest':
        $event_id = intval($_POST['event_id'] ?? 0);
        if (!$event_id) {
            echo json_encode(['success' => false, 'message' => 'Invalid Event ID']);
            exit;
        }

        // Check current status
        $stmt = $pdo->prepare("SELECT * FROM event_interest WHERE event_id = ? AND user_id = ?");
        $stmt->execute([$event_id, $user_id]);
        $existing = $stmt->fetch();

        if ($existing) {
            $pdo->prepare("DELETE FROM event_interest WHERE id = ?")->execute([$existing['id']]);
            $is_interested = false;
        } else {
            $pdo->prepare("INSERT INTO event_interest (event_id, user_id, interest_status) VALUES (?, ?, 'interested')")->execute([$event_id, $user_id]);
            $is_interested = true;
        }

        // Get updated count
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM event_interest WHERE event_id = ?");
        $countStmt->execute([$event_id]);
        $count = $countStmt->fetchColumn();

        echo json_encode([
            'success' => true,
            'is_interested' => $is_interested,
            'count' => $count,
            'message' => $is_interested ? "Marked as interested!" : "Removed from interested list."
        ]);
        exit;

    case 'send_request':
        $event_id = intval($_POST['event_id'] ?? 0);
        $receiver_id = intval($_POST['receiver_id'] ?? 0);

        if (!$event_id || !$receiver_id || $receiver_id === $user_id) {
            echo json_encode(['success' => false, 'message' => 'Invalid request target.']);
            exit;
        }

        // Check if already requested or connected
        $chk = $pdo->prepare("SELECT * FROM buddy_requests WHERE event_id = ? AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))");
        $chk->execute([$event_id, $user_id, $receiver_id, $receiver_id, $user_id]);
        $existing = $chk->fetch();

        if ($existing) {
            if ($existing['status'] === 'BLOCKED') {
                echo json_encode(['success' => false, 'message' => 'Unable to send request.']);
                exit;
            }
            echo json_encode(['success' => false, 'message' => 'Connection request already exists (Status: ' . $existing['status'] . ').']);
            exit;
        }

        $ins = $pdo->prepare("INSERT INTO buddy_requests (event_id, sender_id, receiver_id, status) VALUES (?, ?, ?, 'PENDING')");
        $ins->execute([$event_id, $user_id, $receiver_id]);

        echo json_encode(['success' => true, 'message' => 'Connection request sent successfully!']);
        exit;

    case 'accept_request':
        $request_id = intval($_POST['request_id'] ?? 0);
        $stmt = $pdo->prepare("SELECT * FROM buddy_requests WHERE id = ? AND receiver_id = ? AND status = 'PENDING'");
        $stmt->execute([$request_id, $user_id]);
        $req = $stmt->fetch();

        if (!$req) {
            echo json_encode(['success' => false, 'message' => 'Connection request not found.']);
            exit;
        }

        // Update request status
        $pdo->prepare("UPDATE buddy_requests SET status = 'ACCEPTED', responded_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$request_id]);

        // Create or find direct conversation between these two users for this event
        $convStmt = $pdo->prepare("
            SELECT c.id FROM conversations c
            JOIN conversation_members cm1 ON c.id = cm1.conversation_id
            JOIN conversation_members cm2 ON c.id = cm2.conversation_id
            WHERE c.event_id = ? AND c.conversation_type = 'DIRECT'
            AND cm1.user_id = ? AND cm2.user_id = ?
        ");
        $convStmt->execute([$req['event_id'], $req['sender_id'], $req['receiver_id']]);
        $conv_id = $convStmt->fetchColumn();

        if (!$conv_id) {
            $insConv = $pdo->prepare("INSERT INTO conversations (event_id, conversation_type) VALUES (?, 'DIRECT')");
            $insConv->execute([$req['event_id']]);
            $conv_id = $pdo->lastInsertId();

            $memIns = $pdo->prepare("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?)");
            $memIns->execute([$conv_id, $req['sender_id'], $conv_id, $req['receiver_id']]);
        }

        echo json_encode(['success' => true, 'conversation_id' => $conv_id, 'message' => 'Connection accepted! Private Event Buddy Chat is now active.']);
        exit;

    case 'decline_request':
        $request_id = intval($_POST['request_id'] ?? 0);
        $pdo->prepare("UPDATE buddy_requests SET status = 'DECLINED', responded_at = CURRENT_TIMESTAMP WHERE id = ? AND receiver_id = ?")->execute([$request_id, $user_id]);
        echo json_encode(['success' => true, 'message' => 'Request declined.']);
        exit;

    case 'create_group':
        $event_id = intval($_POST['event_id'] ?? 0);
        $group_name = trim($_POST['group_name'] ?? '');

        if (!$event_id || empty($group_name)) {
            echo json_encode(['success' => false, 'message' => 'Group name and event are required.']);
            exit;
        }

        // Create Event Group
        $stmt = $pdo->prepare("INSERT INTO event_groups (event_id, group_name, created_by, max_members) VALUES (?, ?, ?, 5)");
        $stmt->execute([$event_id, $group_name, $user_id]);
        $group_id = $pdo->lastInsertId();

        // Add creator as member
        $pdo->prepare("INSERT INTO event_group_members (group_id, user_id, status) VALUES (?, ?, 'ACTIVE')")->execute([$group_id, $user_id]);

        // Create Group Conversation
        $convStmt = $pdo->prepare("INSERT INTO conversations (event_id, group_id, conversation_type) VALUES (?, ?, 'GROUP')");
        $convStmt->execute([$event_id, $group_id]);
        $conv_id = $pdo->lastInsertId();

        $pdo->prepare("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)")->execute([$conv_id, $user_id]);

        echo json_encode(['success' => true, 'group_id' => $group_id, 'conversation_id' => $conv_id, 'message' => "Event Buddy Group '{$group_name}' created successfully!"]);
        exit;

    case 'join_group':
        $group_id = intval($_POST['group_id'] ?? 0);
        $grpStmt = $pdo->prepare("SELECT g.*, (SELECT COUNT(*) FROM event_group_members WHERE group_id = g.id AND status = 'ACTIVE') as member_count FROM event_groups g WHERE id = ?");
        $grpStmt->execute([$group_id]);
        $grp = $grpStmt->fetch();

        if (!$grp) {
            echo json_encode(['success' => false, 'message' => 'Group not found.']);
            exit;
        }

        if ($grp['member_count'] >= $grp['max_members']) {
            echo json_encode(['success' => false, 'message' => 'Group has reached maximum limit of 5 members.']);
            exit;
        }

        $pdo->prepare("INSERT OR REPLACE INTO event_group_members (group_id, user_id, status) VALUES (?, ?, 'ACTIVE')")->execute([$group_id, $user_id]);

        // Add to group conversation
        $conv_id = $pdo->query("SELECT id FROM conversations WHERE group_id = {$group_id}")->fetchColumn();
        if ($conv_id) {
            $pdo->prepare("INSERT OR IGNORE INTO conversation_members (conversation_id, user_id) VALUES (?, ?)")->execute([$conv_id, $user_id]);
        }

        echo json_encode(['success' => true, 'message' => 'Joined Event Buddy Group!']);
        exit;

    case 'send_buddy_message':
        $conversation_id = intval($_POST['conversation_id'] ?? 0);
        $message_text = trim($_POST['message_text'] ?? '');

        if (!$conversation_id || empty($message_text)) {
            echo json_encode(['success' => false, 'message' => 'Message content cannot be empty.']);
            exit;
        }

        // Verify user is member of conversation
        $chkMem = $pdo->prepare("SELECT COUNT(*) FROM conversation_members WHERE conversation_id = ? AND user_id = ?");
        $chkMem->execute([$conversation_id, $user_id]);
        if (!$chkMem->fetchColumn()) {
            echo json_encode(['success' => false, 'message' => 'Access denied to this conversation.']);
            exit;
        }

        $insMsg = $pdo->prepare("INSERT INTO buddy_messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?)");
        $insMsg->execute([$conversation_id, $user_id, $message_text]);

        echo json_encode(['success' => true, 'message' => 'Sent!']);
        exit;

    case 'get_buddy_messages':
        $conversation_id = intval($_GET['conversation_id'] ?? 0);
        if (!$conversation_id) {
            echo json_encode(['success' => false, 'messages' => []]);
            exit;
        }

        $msgs = $pdo->prepare("
            SELECT m.*, u.full_name as sender_name, u.profile_image
            FROM buddy_messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = ?
            ORDER BY m.sent_at ASC
        ");
        $msgs->execute([$conversation_id]);
        $messages = $msgs->fetchAll();

        echo json_encode(['success' => true, 'messages' => $messages]);
        exit;

    case 'report_user':
        $reported_user_id = intval($_POST['reported_user_id'] ?? 0);
        $event_id = intval($_POST['event_id'] ?? 0);
        $reason = trim($_POST['reason'] ?? 'Inappropriate behavior');
        $description = trim($_POST['description'] ?? '');

        if (!$reported_user_id || $reported_user_id === $user_id) {
            echo json_encode(['success' => false, 'message' => 'Invalid report request.']);
            exit;
        }

        $insRep = $pdo->prepare("INSERT INTO user_reports (reporter_id, reported_user_id, event_id, reason, description, status) VALUES (?, ?, ?, ?, ?, 'PENDING')");
        $insRep->execute([$user_id, $reported_user_id, $event_id ?: null, $reason, $description]);

        echo json_encode(['success' => true, 'message' => 'Safety report submitted to Admin Moderation. Thank you for keeping K-Sync safe!']);
        exit;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid Action']);
        exit;
}
