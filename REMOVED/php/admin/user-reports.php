<?php
// admin/user-reports.php - Admin User Safety & Moderation Hub
$page_title = "User Safety Reports | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

$admin_id = $current_user['id'];

// Handle POST actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $report_id = intval($_POST['report_id'] ?? 0);
    $reported_user_id = intval($_POST['reported_user_id'] ?? 0);

    if ($action === 'block_user' && $reported_user_id > 0) {
        $pdo->prepare("UPDATE users SET status = 'SUSPENDED' WHERE id = ?")->execute([$reported_user_id]);
        $pdo->prepare("UPDATE user_reports SET status = 'BLOCKED', resolved_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$report_id]);
        log_activity($admin_id, 'BLOCK_USER', 'users', $reported_user_id, "Admin suspended user ID #{$reported_user_id} due to safety report #{$report_id}");
        set_flash_message('success', "User account suspended and report resolved.");
        header("Location: {$base_url}/admin/user-reports.php");
        exit;
    } elseif ($action === 'warn_user' && $report_id > 0) {
        $pdo->prepare("UPDATE user_reports SET status = 'WARNED', resolved_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$report_id]);
        set_flash_message('warning', "Warning logged for user report.");
        header("Location: {$base_url}/admin/user-reports.php");
        exit;
    } elseif ($action === 'dismiss_report' && $report_id > 0) {
        $pdo->prepare("UPDATE user_reports SET status = 'DISMISSED', resolved_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$report_id]);
        set_flash_message('success', "Report dismissed.");
        header("Location: {$base_url}/admin/user-reports.php");
        exit;
    }
}

// Fetch all user safety reports
$reports = $pdo->query("
    SELECT r.*, 
           u1.full_name as reporter_name, 
           u2.full_name as reported_name, u2.email as reported_email, u2.status as user_account_status,
           e.event_name
    FROM user_reports r
    JOIN users u1 ON r.reporter_id = u1.id
    JOIN users u2 ON r.reported_user_id = u2.id
    LEFT JOIN events e ON r.event_id = e.id
    ORDER BY r.created_at DESC
")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <i class="fas fa-shield-halved me-1.5 text-rose-600"></i> Event Buddy Safety Center
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            User Safety Reports & Moderation Hub
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Review community safety reports filed against users for spam, harassment, or non-event activity.</p>
    </div>

    <!-- Reports Table -->
    <?php if (empty($reports)): ?>
        <div class="glass-card p-10 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <i class="fas fa-circle-check text-emerald-500 text-4xl block"></i>
            <h3 class="text-base font-extrabold text-slate-800">No User Reports</h3>
            <p class="text-xs text-slate-500">All community connections are clean and safe!</p>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 gap-6">
            <?php foreach ($reports as $rep): ?>
                <div class="glass-card p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div class="flex items-center space-x-3">
                            <span class="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800">
                                <?= htmlspecialchars($rep['reason']) ?>
                            </span>
                            <span class="text-xs text-slate-400 font-semibold"><i class="far fa-clock me-1"></i> <?= date('M d, Y H:i', strtotime($rep['created_at'])) ?></span>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-extrabold <?= $rep['status'] === 'PENDING' ? 'bg-amber-100 text-amber-800' : ($rep['status'] === 'BLOCKED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600') ?>">
                            Status: <?= htmlspecialchars($rep['status']) ?>
                        </span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-700">
                        <div>
                            <span class="block text-slate-400 font-bold uppercase text-[10px]">Reported User</span>
                            <strong class="text-slate-900 text-sm"><?= htmlspecialchars($rep['reported_name']) ?></strong>
                            <p class="text-slate-500 text-[11px]"><?= htmlspecialchars($rep['reported_email']) ?> &bull; Status: <?= htmlspecialchars($rep['user_account_status']) ?></p>
                        </div>
                        <div>
                            <span class="block text-slate-400 font-bold uppercase text-[10px]">Reporter</span>
                            <strong class="text-slate-900"><?= htmlspecialchars($rep['reporter_name']) ?></strong>
                        </div>
                        <div>
                            <span class="block text-slate-400 font-bold uppercase text-[10px]">Related Event</span>
                            <strong class="text-pink-600"><?= htmlspecialchars($rep['event_name'] ?: 'General') ?></strong>
                        </div>
                    </div>

                    <?php if (!empty($rep['description'])): ?>
                        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 italic">
                            &ldquo;<?= htmlspecialchars($rep['description']) ?>&rdquo;
                        </div>
                    <?php endif; ?>

                    <?php if ($rep['status'] === 'PENDING'): ?>
                        <div class="flex items-center space-x-3 pt-2">
                            <form method="POST" action="admin/user-reports.php" class="inline">
                                <input type="hidden" name="action" value="block_user">
                                <input type="hidden" name="report_id" value="<?= $rep['id'] ?>">
                                <input type="hidden" name="reported_user_id" value="<?= $rep['reported_user_id'] ?>">
                                <button type="submit" onclick="return confirm('Suspend this user account?')" class="px-4 py-2 rounded-2xl bg-rose-600 text-white font-extrabold text-xs shadow-sm hover:bg-rose-700">
                                    <i class="fas fa-ban me-1.5"></i> Suspend User Account
                                </button>
                            </form>

                            <form method="POST" action="admin/user-reports.php" class="inline">
                                <input type="hidden" name="action" value="warn_user">
                                <input type="hidden" name="report_id" value="<?= $rep['id'] ?>">
                                <button type="submit" class="px-4 py-2 rounded-2xl bg-amber-500 text-white font-extrabold text-xs shadow-sm hover:bg-amber-600">
                                    <i class="fas fa-triangle-exclamation me-1.5"></i> Issue Warning
                                </button>
                            </form>

                            <form method="POST" action="admin/user-reports.php" class="inline">
                                <input type="hidden" name="action" value="dismiss_report">
                                <input type="hidden" name="report_id" value="<?= $rep['id'] ?>">
                                <button type="submit" class="px-4 py-2 rounded-2xl bg-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-300">
                                    Dismiss Report
                                </button>
                            </form>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
