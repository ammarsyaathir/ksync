<?php
// ajax/send_chat_message.php - Live Group Chat Message Submission Endpoint

header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../includes/functions.php';

if (!is_logged_in()) {
    echo json_encode(['status' => 'error', 'message' => 'Please log in to participate in the event group chat.']);
    exit;
}

$current_user = get_current_user_data();
$event_id = intval($_POST['event_id'] ?? 0);
$message = trim($_POST['message'] ?? '');

if (!$event_id || empty($message)) {
    echo json_encode(['status' => 'error', 'message' => 'Message content cannot be empty.']);
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

if (time() > $chatClosureTimestamp) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'This Event Group Chat closed 24 hours after the event ended.'
    ]);
    exit;
}

// Determine if user is the event organizer
$is_organizer = ($current_user['id'] == $event['organizer_id']) ? 1 : 0;

try {
    $stmt = $pdo->prepare("INSERT INTO event_chat_messages (event_id, user_id, message, is_organizer) VALUES (?, ?, ?, ?)");
    $stmt->execute([$event_id, $current_user['id'], $message, $is_organizer]);
    
    log_activity($current_user['id'], 'CHAT_MESSAGE', 'events', $event_id, "Posted message in event #{$event_id} group chat");

    echo json_encode([
        'status' => 'success',
        'message' => 'Message sent successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
