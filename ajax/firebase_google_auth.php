<?php
// ajax/firebase_google_auth.php - Firebase Google Authentication Handler
//
// SECURITY: Identity is derived ONLY from a Firebase ID token that is verified
// server-side. Client-supplied email/uid/role are ignored.

header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/verify_token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Accept the token from the POST body, or an Authorization: Bearer header.
$id_token = trim($_POST['id_token'] ?? '');
if ($id_token === '') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (stripos($authHeader, 'Bearer ') === 0) {
        $id_token = trim(substr($authHeader, 7));
    }
}

if ($id_token === '') {
    echo json_encode(['status' => 'error', 'message' => 'Missing Google authentication token.']);
    exit;
}

// Verify the token before trusting any identity data.
try {
    $claims = verify_firebase_id_token($id_token);
} catch (Exception $e) {
    error_log('Firebase token verification failed: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Google authentication failed. Please try again.']);
    exit;
}

$email = trim($claims['email'] ?? '');
if ($email === '' || ($claims['email_verified'] ?? false) === false) {
    echo json_encode(['status' => 'error', 'message' => 'Google account email is missing or unverified.']);
    exit;
}

$full_name = trim($claims['name'] ?? '');
if ($full_name === '') {
    $full_name = explode('@', $email)[0];
}
$profile_image = $claims['picture'] ?? '';

// Only self-service roles are allowed; Admin can never be self-assigned.
$selected_role = strtolower(trim($_POST['role'] ?? 'fan')) === 'organizer' ? 'Organizer' : 'Fan';

// Generate unique username from email
$username = strtolower(explode('@', $email)[0]);
$username = preg_replace('/[^a-z0-9_]/', '', $username);

try {
    // Check if user already exists by email
    $stmt = $pdo->prepare("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(u.email) = LOWER(?)");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // User exists -> Log them in!
        if ($user['status'] !== 'ACTIVE') {
            echo json_encode(['status' => 'error', 'message' => 'Account is suspended. Please contact administrator.']);
            exit;
        }

        // Update profile photo if missing
        if (empty($user['profile_image']) && !empty($profile_image)) {
            $pdo->prepare("UPDATE users SET profile_image = ? WHERE id = ?")->execute([$profile_image, $user['id']]);
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role_name'] = $user['role_name'];
        $_SESSION['full_name'] = $user['full_name'];

        log_activity($user['id'], 'GOOGLE_LOGIN', 'users', $user['id'], 'User logged in via Firebase Google Auth');

        $redirect = strtolower($user['role_name']) === 'admin' ? "{$base_url}/admin/dashboard.php" :
                   (strtolower($user['role_name']) === 'organizer' ? "{$base_url}/organizer/dashboard.php" : "{$base_url}/index.php");

        set_flash_message('success', "Welcome back, {$user['full_name']}! Signed in with Google.");
        echo json_encode(['status' => 'success', 'redirect' => $redirect, 'message' => 'Login successful.']);
        exit;
    } else {
        // New user -> Register via Google!
        // Ensure unique username
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
        $stmtCheck->execute([$username]);
        if ($stmtCheck->fetchColumn() > 0) {
            $username = $username . rand(100, 999);
        }

        // Get Role ID (allow-listed: Fan or Organizer only)
        $stmtRole = $pdo->prepare("SELECT id FROM roles WHERE LOWER(name) = LOWER(?)");
        $stmtRole->execute([$selected_role]);
        $role_id = $stmtRole->fetchColumn() ?: 3; // Default Fan role

        $random_password = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);

        $ins = $pdo->prepare("INSERT INTO users (role_id, full_name, username, email, password_hash, profile_image) VALUES (?, ?, ?, ?, ?, ?)");
        $ins->execute([$role_id, $full_name, $username, $email, $random_password, $profile_image]);
        $new_id = $pdo->lastInsertId();

        // Fetch created user role name
        $stmtNew = $pdo->prepare("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?");
        $stmtNew->execute([$new_id]);
        $newUser = $stmtNew->fetch();

        $_SESSION['user_id'] = $newUser['id'];
        $_SESSION['role_name'] = $newUser['role_name'];
        $_SESSION['full_name'] = $newUser['full_name'];

        log_activity($newUser['id'], 'GOOGLE_REGISTER', 'users', $newUser['id'], "New {$newUser['role_name']} registered via Firebase Google Auth");

        $redirect = strtolower($newUser['role_name']) === 'organizer' ? "{$base_url}/organizer/dashboard.php" : "{$base_url}/index.php";

        set_flash_message('success', "Account registered with Google! Welcome to K-Sync Malaysia.");
        echo json_encode(['status' => 'success', 'redirect' => $redirect, 'message' => 'Registration successful.']);
        exit;
    }
} catch (Exception $e) {
    error_log('Firebase auth DB error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error during Google Authentication.']);
    exit;
}
