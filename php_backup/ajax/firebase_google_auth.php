<?php
// ajax/firebase_google_auth.php - Firebase Google Authentication Handler

header('Content-Type: application/json');
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$email = trim($_POST['email'] ?? '');
$full_name = trim($_POST['full_name'] ?? '');
$google_uid = trim($_POST['uid'] ?? '');
$profile_image = trim($_POST['photo_url'] ?? '');
$selected_role = trim($_POST['role'] ?? 'Fan');

if (empty($email) || empty($google_uid)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid Google authentication payload.']);
    exit;
}

if (empty($full_name)) {
    $full_name = explode('@', $email)[0];
}

// Generate unique username from email
$username = strtolower(explode('@', $email)[0]);
$username = preg_replace('/[^a-z0-9_]/', '', $username);

try {
    // Check if user already exists by email
    $stmt = $pdo->prepare("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?");
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

        // Get Role ID
        $stmtRole = $pdo->prepare("SELECT id FROM roles WHERE LOWER(name) = LOWER(?)");
        $stmtRole->execute([$selected_role]);
        $role_id = $stmtRole->fetchColumn() ?: 3; // Default Fan role

        $random_password = password_hash(bin2hex(random_bytes(10)), PASSWORD_DEFAULT);

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
    echo json_encode(['status' => 'error', 'message' => 'Database error during Google Authentication: ' . $e->getMessage()]);
    exit;
}
