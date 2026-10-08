<?php
// ajax/get_chat_messages.php - Live Group Chat Polling Endpoint

header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

$event_id = intval($_GET['event_id'] ?? 0);

if (!$event_id) {
    echo json_encode(['status' => 'error', 'message' => 'Event ID required.']);
    exit;
}

// Fetch event details to check chat closure lifecycle
$stmt = $pdo->prepare("SELECT id, organizer_id, event_date, end_time, start_time FROM events WHERE id = ?");
$stmt->execute([$event_id]);
$event = $stmt->fetch();

if (!$event) {
    echo json_encode(['status' => 'error', 'message' => 'Event not found.']);
    exit;
}

// Calculate Auto-Closure Rule: Chat closes 24 hours (86,400 seconds) after event ends
$eventEndTime = !empty($event['end_time']) ? $event['end_time'] : ($event['start_time'] ?: '23:59:59');
$eventEndTimestamp = strtotime($event['event_date'] . ' ' . $eventEndTime);
$chatClosureTimestamp = $eventEndTimestamp + 86400; // +24 hours
$is_chat_closed = (time() > $chatClosureTimestamp);

// Fetch chat messages
$stmt = $pdo->prepare("
    SELECT m.*, 
           u.username, u.full_name, u.profile_image, 
           u.organization_name, u.organization_type, u.social_handle, u.is_verified_organizer,
           r.name as role_name
    FROM event_chat_messages m
    JOIN users u ON m.user_id = u.id
    JOIN roles r ON u.role_id = r.id
    WHERE m.event_id = ?
    ORDER BY m.created_at ASC
");
$stmt->execute([$event_id]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

$formatted_messages = [];
foreach ($messages as $msg) {
    $formatted_messages[] = [
        'id' => $msg['id'],
        'user_id' => $msg['user_id'],
        'username' => $msg['username'],
        'full_name' => $msg['full_name'],
        'display_name' => $msg['organization_name'] ?: $msg['full_name'],
        'social_handle' => $msg['social_handle'] ?? '',
        'is_verified_organizer' => intval($msg['is_verified_organizer'] ?? 0),
        'is_event_organizer' => intval($msg['user_id'] == $event['organizer_id']),
        'role_name' => $msg['role_name'],
        'message' => htmlspecialchars($msg['message']),
        'created_at_formatted' => date('d M, h:i A', strtotime($msg['created_at']))
    ];
}

echo json_encode([
    'status' => 'success',
    'is_chat_closed' => $is_chat_closed,
    'closure_date_formatted' => date('d M Y, h:i A', $chatClosureTimestamp),
    'messages' => $formatted_messages
]);
