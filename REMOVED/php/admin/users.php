<?php
// admin/users.php - User Account & Role Management (Enhanced Design)

$page_title = "Manage Users | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

// Handle Role / Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $target_user_id = intval($_POST['user_id'] ?? 0);
    $new_role_id = intval($_POST['role_id'] ?? 0);
    $new_status = trim($_POST['status'] ?? 'ACTIVE');

    if ($target_user_id && $new_role_id) {
        $pdo->prepare("UPDATE users SET role_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$new_role_id, $new_status, $target_user_id]);
        log_activity($current_user['id'], 'UPDATE_USER_ROLE', 'users', $target_user_id, "Admin updated user #{$target_user_id} role to {$new_role_id}, status to {$new_status}");
        set_flash_message('success', 'Action Completed: User account role and status updated successfully.');
        header("Location: {$base_url}/admin/users.php");
        exit;
    }
}

// Fetch all users & roles
$users = $pdo->query("
    SELECT u.*, r.name as role_name 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    ORDER BY u.created_at DESC
")->fetchAll();

$roles = $pdo->query("SELECT * FROM roles ORDER BY id ASC")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                <i class="fas fa-users me-1.5 text-indigo-600"></i> User Access Management
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            User Accounts & Roles
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Assign system roles (Fan, Organizer, Admin), manage user account statuses, and inspect account details.</p>
    </div>

    <!-- Table Card -->
    <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700 font-medium">
                <thead class="bg-slate-50 text-slate-900 uppercase font-extrabold border-b border-slate-200">
                    <tr>
                        <th class="p-3"><i class="fas fa-user me-1 text-pink-500"></i> User Details</th>
                        <th class="p-3"><i class="far fa-envelope me-1 text-indigo-500"></i> Email Address</th>
                        <th class="p-3"><i class="fas fa-user-tag me-1 text-purple-500"></i> Assigned Role</th>
                        <th class="p-3"><i class="fas fa-shield-halved me-1 text-emerald-500"></i> Status</th>
                        <th class="p-3"><i class="far fa-clock me-1 text-slate-400"></i> Joined Date</th>
                        <th class="p-3 text-right"><i class="fas fa-user-gear me-1"></i> Update Role / Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <?php foreach ($users as $u): ?>
                        <tr class="hover:bg-slate-50/80 transition-colors">
                            <td class="p-3">
                                <div class="font-black text-slate-900 text-sm"><?= htmlspecialchars($u['full_name']) ?></div>
                                <div class="text-[11px] text-pink-600 font-bold">@<?= htmlspecialchars($u['username']) ?></div>
                            </td>
                            <td class="p-3 font-semibold text-slate-700"><?= htmlspecialchars($u['email']) ?></td>
                            <td class="p-3">
                                <span class="px-3 py-1 rounded-full text-[10px] font-black <?= $u['role_name'] === 'Admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : ($u['role_name'] === 'Organizer' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200') ?>">
                                    <?= htmlspecialchars($u['role_name']) ?>
                                </span>
                            </td>
                            <td class="p-3">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold <?= $u['status'] === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200' ?>">
                                    <?= htmlspecialchars($u['status']) ?>
                                </span>
                            </td>
                            <td class="p-3 text-slate-500 font-semibold"><?= date('d M Y', strtotime($u['created_at'])) ?></td>
                            <td class="p-3 text-right">
                                <form method="POST" action="" class="inline-flex items-center space-x-2">
                                    <input type="hidden" name="user_id" value="<?= $u['id'] ?>">
                                    <select name="role_id" class="bg-slate-50 text-slate-900 text-xs px-3 py-1.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-pink-500">
                                        <?php foreach ($roles as $r): ?>
                                            <option value="<?= $r['id'] ?>" <?= $u['role_id'] == $r['id'] ? 'selected' : '' ?>><?= htmlspecialchars($r['name']) ?></option>
                                        <?php endforeach; ?>
                                    </select>

                                    <select name="status" class="bg-slate-50 text-slate-900 text-xs px-3 py-1.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-pink-500">
                                        <option value="ACTIVE" <?= $u['status'] === 'ACTIVE' ? 'selected' : '' ?>>ACTIVE</option>
                                        <option value="SUSPENDED" <?= $u['status'] === 'SUSPENDED' ? 'selected' : '' ?>>SUSPENDED</option>
                                    </select>

                                    <button type="submit" class="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black shadow-sm transition-all">
                                        Save
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
