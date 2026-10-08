<?php
// logout.php - Destroy Session & Logout

require_once __DIR__ . '/config/auth.php';
require_once __DIR__ . '/includes/functions.php';

if (is_logged_in()) {
    log_activity($_SESSION['user_id'], 'USER_LOGOUT', 'users', $_SESSION['user_id'], 'User logged out');
}

$_SESSION = array();
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();

session_start();
set_flash_message('info', 'You have been logged out.');
header("Location: {$base_url}/login.php");
exit;
