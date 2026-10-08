<?php
// ajax/save_event.php - Toggle Save Event Action

header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../includes/functions.php';

if (!is_logged_in()) {
    echo json_encode(['status' => 'unauthorized', 'message' => 'User must be logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$event_id = intval($_POST['event_id'] ?? 0);

if (!$event_id) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid Event ID']);
    exit;
}

// Check if already saved
$stmt = $pdo->prepare("SELECT id FROM saved_events WHERE user_id = ? AND event_id = ?");
$stmt->execute([$user_id, $event_id]);
$existing = $stmt->fetch();

if ($existing) {
    // Remove saved event
    $del = $pdo->prepare("DELETE FROM saved_events WHERE user_id = ? AND event_id = ?");
    $del->execute([$user_id, $event_id]);
    log_activity($user_id, 'UNSAVE_EVENT', 'events', $event_id, 'User removed saved event');
    echo json_encode(['status' => 'removed', 'message' => 'Event removed from saved list']);
} else {
    // Save event (enforced duplicate prevention by UNIQUE constraint in DB & check here)
    try {
        $ins = $pdo->prepare("INSERT INTO saved_events (user_id, event_id) VALUES (?, ?)");
        $ins->execute([$user_id, $event_id]);
        log_activity($user_id, 'SAVE_EVENT', 'events', $event_id, 'User saved event');
        echo json_encode(['status' => 'saved', 'message' => 'Event saved successfully']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Could not save event']);
    }
}
