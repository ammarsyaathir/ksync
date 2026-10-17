<?php
// ajax/supabase_auth_sync.php - Supabase Auth User Synchronizer
header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$email = trim($_POST['email'] ?? '');
$full_name = trim($_POST['full_name'] ?? '');
$supabase_uid = trim($_POST['uid'] ?? '');
$profile_image = trim($_POST['photo_url'] ?? '');
$selected_role = trim($_POST['role'] ?? 'Fan');

if (empty($email) || empty($supabase_uid)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid Supabase authentication payload.']);
    exit;
}

if (empty($full_name)) {
    $full_name = explode('@', $email)[0];
}

$username = strtolower(explode('@', $email)[0]);
$username = preg_replace('/[^a-z0-9_]/', '', $username);

try {
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        if ($user['status'] !== 'ACTIVE') {
            echo json_encode(['status' => 'error', 'message' => 'Account is suspended. Please contact administrator.']);
            exit;
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role_name'] = $user['role_name'];
        $_SESSION['full_name'] = $user['full_name'];

        log_activity($user['id'], 'SUPABASE_LOGIN', 'users', $user['id'], 'User logged in via Supabase Auth');

        $redirect = strtolower($user['role_name']) === 'admin' ? "{$base_url}/admin/dashboard.php" : 
                   (strtolower($user['role_name']) === 'organizer' ? "{$base_url}/organizer/dashboard.php" : "{$base_url}/index.php");

        set_flash_message('success', "Welcome back, {$user['full_name']}! Signed in with Supabase.");
        echo json_encode(['status' => 'success', 'redirect' => $redirect, 'message' => 'Supabase login successful.']);
        exit;
    } else {
        // Register new user from Supabase Auth
        $role_id = strtolower($selected_role) === 'organizer' ? 2 : 3;
        $dummyPassword = password_hash($supabase_uid . '_supabase_auth', PASSWORD_DEFAULT);

        $ins = $pdo->prepare("INSERT INTO users (role_id, full_name, username, email, password_hash, profile_image, status) VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')");
        $ins->execute([$role_id, $full_name, $username, $email, $dummyPassword, $profile_image]);
        $new_user_id = $pdo->lastInsertId();

        $role_name = $role_id === 2 ? 'Organizer' : 'Fan';
        $_SESSION['user_id'] = $new_user_id;
        $_SESSION['role_name'] = $role_name;
        $_SESSION['full_name'] = $full_name;

        log_activity($new_user_id, 'SUPABASE_REGISTER', 'users', $new_user_id, 'User registered via Supabase Auth');

        $redirect = $role_id === 2 ? "{$base_url}/organizer/dashboard.php" : "{$base_url}/index.php";

        set_flash_message('success', "Account created successfully with Supabase!");
        echo json_encode(['status' => 'success', 'redirect' => $redirect, 'message' => 'Supabase registration successful.']);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
}
