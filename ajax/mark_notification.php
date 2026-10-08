<?php
// ajax/mark_notification.php - Mark Notification as Read Endpoint

header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';

if (!is_logged_in()) {
    echo json_encode(['status' => 'unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$notification_id = intval($_POST['notification_id'] ?? 0);
$mark_all = isset($_POST['mark_all']) && $_POST['mark_all'] == '1';

if ($mark_all) {
    $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
    $stmt->execute([$user_id]);
    echo json_encode(['status' => 'success', 'message' => 'All notifications marked as read']);
    exit;
}

if ($notification_id) {
    $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
    $stmt->execute([$notification_id, $user_id]);
    echo json_encode(['status' => 'success', 'message' => 'Notification marked as read']);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid Request']);
