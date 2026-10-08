<?php
// profile.php - User Profile & Password Management

$page_title = "Manage Profile | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';
require_login();

$user_id = $current_user['id'];
$error_profile = '';
$success_profile = '';
$error_pwd = '';
$success_pwd = '';

// Handle Profile Details Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action_update_profile'])) {
    $full_name = trim($_POST['full_name'] ?? '');
    $bio = trim($_POST['bio'] ?? '');
    $profile_image = trim($_POST['profile_image'] ?? '');
    
    $organization_name = trim($_POST['organization_name'] ?? '');
    $organization_type = trim($_POST['organization_type'] ?? 'Fanclub');
    $social_handle = trim($_POST['social_handle'] ?? '');
    $social_url = trim($_POST['social_url'] ?? '');
    $verification_proof = trim($_POST['verification_proof'] ?? '');
    $request_verification = isset($_POST['request_verification']) ? 1 : 0;

    if (empty($full_name)) {
        $error_profile = "Full name cannot be empty.";
    } else {
        $is_verified = intval($current_user['is_verified_organizer'] ?? 0);
        if ($request_verification && $is_verified === 0) {
            $is_verified = 2; // Set status to pending verification
        }

        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, bio = ?, profile_image = ?, organization_name = ?, organization_type = ?, social_handle = ?, social_url = ?, verification_proof = ?, is_verified_organizer = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$full_name, $bio, $profile_image, $organization_name, $organization_type, $social_handle, $social_url, $verification_proof, $is_verified, $user_id]);

        log_activity($user_id, 'UPDATE_PROFILE', 'users', $user_id, 'User updated profile & fanclub verification information');
        $_SESSION['full_name'] = $full_name;
        $success_profile = "Profile & Fanclub details updated successfully!" . ($request_verification ? " Verification request submitted to admin queue." : "");
        $current_user = get_current_user_data();
    }
}

// Handle Password Change
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action_change_password'])) {
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
        $error_pwd = "All password fields are required.";
    } elseif ($new_password !== $confirm_password) {
        $error_pwd = "New password and confirmation do not match.";
    } elseif (strlen($new_password) < 6) {
        $error_pwd = "New password must be at least 6 characters long.";
    } else {
        // Verify current password
        if (password_verify($current_password, $current_user['password_hash'])) {
            $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$new_hash, $user_id]);

            log_activity($user_id, 'CHANGE_PASSWORD', 'users', $user_id, 'User changed account password');
            $success_pwd = "Password changed successfully!";
        } else {
            $error_pwd = "Incorrect current password.";
        }
    }
}
?>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                <i class="fas fa-user-gear me-1 text-purple-600"></i> Account Settings
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            Account Profile
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Manage your user details, bio description, and security password.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- User Info Summary Card -->
        <div class="md:col-span-1">
            <div class="bg-white p-6 rounded-3xl text-center space-y-4 border border-slate-200 shadow-xl">
                <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-3xl mx-auto shadow-lg shadow-pink-500/20">
                    <?= strtoupper(substr($current_user['username'], 0, 1)) ?>
                </div>
                <div>
                    <h3 class="font-extrabold text-slate-900 text-lg"><?= htmlspecialchars($current_user['full_name']) ?></h3>
                    <p class="text-xs text-slate-500 font-semibold">@<?= htmlspecialchars($current_user['username']) ?></p>
                    <span class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-extrabold bg-pink-50 text-pink-700 uppercase border border-pink-200">
                        <?= htmlspecialchars($current_user['role_name']) ?>
                    </span>
                </div>
                <div class="border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-2 text-left font-medium">
                    <p class="flex items-center"><i class="far fa-envelope w-5 text-pink-500 me-1"></i> <?= htmlspecialchars($current_user['email']) ?></p>
                    <p class="flex items-center"><i class="far fa-clock w-5 text-purple-500 me-1"></i> Joined <?= date('M Y', strtotime($current_user['created_at'])) ?></p>
                </div>
            </div>
        </div>

        <!-- Update Forms -->
        <div class="md:col-span-2 space-y-8">
            <!-- Form 1: Edit Profile -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
                <h3 class="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center">
                    <i class="fas fa-id-card text-pink-500 me-2"></i> Update Profile Information
                </h3>

                <?php if ($error_profile): ?>
                    <div class="p-3.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center">
                        <i class="fas fa-triangle-exclamation me-2 text-rose-500"></i> <?= htmlspecialchars($error_profile) ?>
                    </div>
                <?php endif; ?>
                <?php if ($success_profile): ?>
                    <div class="p-3.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center">
                        <i class="fas fa-circle-check me-2 text-emerald-500"></i> <?= htmlspecialchars($success_profile) ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="" class="space-y-4">
                    <input type="hidden" name="action_update_profile" value="1">
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-user me-1 text-pink-500"></i> Full Name</label>
                        <input type="text" name="full_name" value="<?= htmlspecialchars($current_user['full_name']) ?>" required
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-at me-1 text-slate-400"></i> Username (Read-only)</label>
                        <input type="text" value="<?= htmlspecialchars($current_user['username']) ?>" disabled
                               class="w-full bg-slate-100 text-slate-500 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium cursor-not-allowed">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="far fa-envelope me-1 text-slate-400"></i> Email Address (Read-only)</label>
                        <input type="text" value="<?= htmlspecialchars($current_user['email']) ?>" disabled
                               class="w-full bg-slate-100 text-slate-500 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium cursor-not-allowed">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-align-left me-1 text-purple-500"></i> Bio / Description</label>
                        <textarea name="bio" rows="3" placeholder="Tell other fans about your favorite K-Pop groups..."
                                  class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"><?= htmlspecialchars($current_user['bio'] ?? '') ?></textarea>
                    </div>

                    <!-- Fanclub & Organizer Verification Credentials -->
                    <?php if (($current_user['role_name'] ?? '') === 'Organizer'): ?>
                        <div class="pt-4 border-t border-slate-100 space-y-4">
                            <h4 class="text-xs font-black text-purple-700 uppercase tracking-wider flex items-center">
                                <i class="fas fa-certificate text-emerald-500 me-1.5"></i> Fanclub & Organization Credentials
                            </h4>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">Organization / Fanclub Name</label>
                                    <input type="text" name="organization_name" value="<?= htmlspecialchars($current_user['organization_name'] ?? '') ?>" placeholder="e.g. MOAbasedMY - TXT Fanclub Malaysia"
                                           class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">Organization Type</label>
                                    <select name="organization_type" class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                                        <option value="Official Fanclub" <?= ($current_user['organization_type'] ?? '') === 'Official Fanclub' ? 'selected' : '' ?>>Official Fanclub Base</option>
                                        <option value="Concert Organizer" <?= ($current_user['organization_type'] ?? '') === 'Concert Organizer' ? 'selected' : '' ?>>Concert & Event Promoter</option>
                                        <option value="Community Fan Base" <?= ($current_user['organization_type'] ?? '') === 'Community Fan Base' ? 'selected' : '' ?>>Community Fan Base</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fab fa-twitter text-sky-500 me-1"></i> Social Handle</label>
                                    <input type="text" name="social_handle" value="<?= htmlspecialchars($current_user['social_handle'] ?? '') ?>" placeholder="e.g. @MOAbasedMY"
                                           class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-link text-pink-500 me-1"></i> Social Profile Link</label>
                                    <input type="url" name="social_url" value="<?= htmlspecialchars($current_user['social_url'] ?? '') ?>" placeholder="https://x.com/MOAbasedMY"
                                           class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium">
                                </div>
                            </div>

                            <?php if (intval($current_user['is_verified_organizer'] ?? 0) === 0): ?>
                                <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
                                    <span>Submit your official social profile link to get verified!</span>
                                    <label class="flex items-center space-x-2 font-bold cursor-pointer">
                                        <input type="checkbox" name="request_verification" value="1" class="rounded text-pink-600 focus:ring-pink-500">
                                        <span>Request Verification</span>
                                    </label>
                                </div>
                            <?php else: ?>
                                <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center">
                                    <i class="fas fa-certificate text-emerald-500 text-base me-2"></i> Account Has Verified Fanclub Badge!
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <button type="submit" class="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all">
                        <i class="fas fa-floppy-disk me-1"></i> Save Profile Changes
                    </button>
                </form>
            </div>

            <!-- Form 2: Change Password -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
                <h3 class="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center">
                    <i class="fas fa-lock text-purple-600 me-2"></i> Change Password
                </h3>

                <?php if ($error_pwd): ?>
                    <div class="p-3.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center">
                        <i class="fas fa-triangle-exclamation me-2 text-rose-500"></i> <?= htmlspecialchars($error_pwd) ?>
                    </div>
                <?php endif; ?>
                <?php if ($success_pwd): ?>
                    <div class="p-3.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center">
                        <i class="fas fa-circle-check me-2 text-emerald-500"></i> <?= htmlspecialchars($success_pwd) ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="" class="space-y-4">
                    <input type="hidden" name="action_change_password" value="1">
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-key me-1 text-amber-500"></i> Current Password</label>
                        <input type="password" name="current_password" required
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-shield-halved me-1 text-purple-500"></i> New Password</label>
                        <input type="password" name="new_password" required minlength="6"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-check-double me-1 text-indigo-500"></i> Confirm New Password</label>
                        <input type="password" name="confirm_password" required minlength="6"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>

                    <button type="submit" class="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all">
                        <i class="fas fa-key me-1"></i> Update Password
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
