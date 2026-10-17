<?php
// config/auth.php - Session Management & Role-Based Authorization

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/database.php';

function is_logged_in() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function get_current_user_data() {
    global $pdo;
    if (!is_logged_in()) return null;
    
    $stmt = $pdo->prepare("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch();
}

function get_current_role() {
    if (!is_logged_in()) return 'Guest';
    return $_SESSION['role_name'] ?? 'Fan';
}

$base_url = (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/ksync_malaysia') !== false) ? '/ksync_malaysia' : '';

function require_login() {
    global $base_url;
    if (!is_logged_in()) {
        $_SESSION['flash_error'] = "Please log in to access this feature.";
        header("Location: {$base_url}/login.php");
        exit;
    }
}

function require_role($required_role) {
    global $base_url;
    require_login();
    $current_role = strtolower(get_current_role());
    $target_role = strtolower($required_role);
    
    if ($current_role !== $target_role && $current_role !== 'admin') {
        $_SESSION['flash_error'] = "Access denied. You do not have permission to view that page.";
        header("Location: {$base_url}/index.php");
        exit;
    }
}

function set_flash_message($type, $message) {
    $_SESSION['flash_' . $type] = $message;
}

function get_flash_messages() {
    $types = ['success', 'error', 'info', 'warning'];
    $messages = [];
    foreach ($types as $t) {
        if (isset($_SESSION['flash_' . $t])) {
            $messages[$t] = $_SESSION['flash_' . $t];
            unset($_SESSION['flash_' . $t]);
        }
    }
    return $messages;
}
