<?php
// ajax/clear_notifications.php - Clear All Notifications for Current User

header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';

if (!is_logged_in()) {
    echo json_encode(['status' => 'unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("DELETE FROM notifications WHERE user_id = ?");
$stmt->execute([$user_id]);

echo json_encode([
    'status' => 'success',
    'message' => 'All notifications cleared successfully'
]);
