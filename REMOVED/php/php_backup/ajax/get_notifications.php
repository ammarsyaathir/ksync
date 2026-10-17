<?php
// ajax/get_notifications.php - Fetch Categorized Notifications for Current User

header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';

if (!is_logged_in()) {
    echo json_encode(['status' => 'unauthorized', 'unread_count' => 0, 'notifications' => []]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Fetch Notifications with associated event & update metadata
$stmt = $pdo->prepare("
    SELECT n.*, 
           e.event_name, e.poster_image, 
           eu.update_title, eu.update_type
    FROM notifications n
    LEFT JOIN events e ON n.event_id = e.id
    LEFT JOIN event_updates eu ON n.update_id = eu.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
    LIMIT 30
");
$stmt->execute([$user_id]);
$raw_notifications = $stmt->fetchAll();

$unread_count = 0;
$items = [];

foreach ($raw_notifications as $n) {
    if (!$n['is_read']) {
        $unread_count++;
    }
    
    // Categorize
    $category = (!empty($n['update_id'])) ? 'announcements' : 'system';

    $items[] = [
        'id' => intval($n['id']),
        'event_id' => intval($n['event_id']),
        'event_name' => $n['event_name'] ?? 'K-Sync Notification',
        'poster_image' => $n['poster_image'] ?: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100',
        'message' => $n['message'],
        'category' => $category,
        'update_type' => $n['update_type'] ?? 'General',
        'is_read' => (bool)$n['is_read'],
        'created_at' => date('M d, Y h:i A', strtotime($n['created_at'])),
        'time_ago' => time_elapsed_string($n['created_at'])
    ];
}

echo json_encode([
    'status' => 'success',
    'unread_count' => $unread_count,
    'total_count' => count($items),
    'notifications' => $items
]);

function time_elapsed_string($datetime, $full = false) {
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'year',
        'm' => 'month',
        'w' => 'week',
        'd' => 'day',
        'h' => 'hour',
        'i' => 'min',
        's' => 'sec',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' ago' : 'just now';
}
