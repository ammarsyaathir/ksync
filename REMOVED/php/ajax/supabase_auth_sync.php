<?php
// ajax/supabase_auth_sync.php - Supabase Auth User Synchronizer
//
// SECURITY: Identity is derived ONLY from a Supabase access token that is
// verified server-side. Client-supplied email/uid/role are ignored.

header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/verify_token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Accept the token from the POST body, or an Authorization: Bearer header.
$access_token = trim($_POST['access_token'] ?? '');
if ($access_token === '') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (stripos($authHeader, 'Bearer ') === 0) {
        $access_token = trim(substr($authHeader, 7));
    }
}

if ($access_token === '') {
    echo json_encode(['status' => 'error', 'message' => 'Missing Supabase authentication token.']);
    exit;
}

// Verify the token before trusting any identity data.
try {
    $claims = verify_supabase_jwt($access_token);
} catch (Exception $e) {
    error_log('Supabase token verification failed: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Supabase authentication failed. Please try again.']);
    exit;
}

$email = trim($claims['email'] ?? '');
if ($email === '') {
    echo json_encode(['status' => 'error', 'message' => 'Supabase account email is missing.']);
    exit;
}

$metadata = $claims['user_metadata'] ?? [];
$full_name = trim($metadata['full_name'] ?? ($_POST['full_name'] ?? ''));
if ($full_name === '') {
    $full_name = explode('@', $email)[0];
}
$profile_image = $metadata['avatar_url'] ?? '';

// Only self-service roles are allowed; Admin can never be self-assigned.
$is_organizer = strtolower(trim($_POST['role'] ?? 'fan')) === 'organizer';
$role_id = $is_organizer ? 2 : 3;

$username = strtolower(explode('@', $email)[0]);
$username = preg_replace('/[^a-z0-9_]/', '', $username);

try {
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(u.email) = LOWER(?)");
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
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
        $stmtCheck->execute([$username]);
        if ($stmtCheck->fetchColumn() > 0) {
            $username = $username . rand(100, 999);
        }

        $dummyPassword = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);

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
    error_log('Supabase auth DB error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error during Supabase authentication.']);
    exit;
}
