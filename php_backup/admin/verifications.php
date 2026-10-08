<?php
// admin/verifications.php - Fanclub & Organizer Verification Center (Decentralized Community Model)

$page_title = "Fanclub & Organizer Verification | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

$admin_id = $current_user['id'];

// Handle Fanclub Verification POST Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $user_id = intval($_POST['user_id'] ?? 0);
    $report_id = intval($_POST['report_id'] ?? 0);
    $notes = trim($_POST['notes'] ?? '');

    if ($action === 'verify_organizer' && $user_id > 0) {
        $pdo->prepare("UPDATE users SET is_verified_organizer = 1, verification_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$notes ?: 'Verified by administrator', $user_id]);
        log_activity($admin_id, 'VERIFY_FANCLUB', 'users', $user_id, "Admin verified Fanclub/Organizer ID #{$user_id}");
        set_flash_message('success', "Fanclub/Organizer verified successfully! Official [✓ Verified Fanclub] badge granted.");
        header("Location: {$base_url}/admin/verifications.php");
        exit;
    } elseif ($action === 'revoke_organizer' && $user_id > 0) {
        $pdo->prepare("UPDATE users SET is_verified_organizer = 0, verification_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$notes ?: 'Verification revoked by admin', $user_id]);
        log_activity($admin_id, 'REVOKE_FANCLUB', 'users', $user_id, "Admin revoked verification for user ID #{$user_id}");
        set_flash_message('warning', "Fanclub/Organizer verification status revoked.");
        header("Location: {$base_url}/admin/verifications.php");
        exit;
    } elseif ($action === 'dismiss_report' && $report_id > 0) {
        $pdo->prepare("UPDATE event_reports SET status = 'DISMISSED' WHERE id = ?")->execute([$report_id]);
        set_flash_message('success', "Community report dismissed.");
        header("Location: {$base_url}/admin/verifications.php");
        exit;
    } elseif ($action === 'flag_event' && $report_id > 0) {
        $event_id = intval($_POST['event_id'] ?? 0);
        if ($event_id) {
            $pdo->prepare("UPDATE events SET verification_status = 'REJECTED', rejection_reason = 'Flagged by community report' WHERE id = ?")->execute([$event_id]);
            $pdo->prepare("UPDATE event_reports SET status = 'ACTIONED' WHERE id = ?")->execute([$report_id]);
            set_flash_message('warning', "Event flagged and hidden from public discovery based on community feedback.");
        }
        header("Location: {$base_url}/admin/verifications.php");
        exit;
    } elseif ($action === 'approve_event') {
        $event_id = intval($_POST['event_id'] ?? 0);
        if ($event_id) {
            $pdo->prepare("UPDATE events SET verification_status = 'VERIFIED' WHERE id = ?")->execute([$event_id]);
            log_activity($admin_id, 'APPROVE_EVENT', 'events', $event_id, "Admin approved event #{$event_id} live");
            set_flash_message('success', "Event #{$event_id} approved and published live to public discovery!");
        }
        header("Location: {$base_url}/admin/verifications.php");
        exit;
    } elseif ($action === 'reject_event') {
        $event_id = intval($_POST['event_id'] ?? 0);
        $reason = trim($_POST['reason'] ?? 'Rejected by administrator');
        if ($event_id) {
            $pdo->prepare("UPDATE events SET verification_status = 'REJECTED', rejection_reason = ? WHERE id = ?")->execute([$reason, $event_id]);
            log_activity($admin_id, 'REJECT_EVENT', 'events', $event_id, "Admin rejected event #{$event_id}");
            set_flash_message('warning', "Event submission rejected.");
        }
        header("Location: {$base_url}/admin/verifications.php");
        exit;
    }
}

// Fetch pending event submissions awaiting admin approval
$pending_events = $pdo->query("
    SELECT e.*, a.name as artist_name, c.name as category_name
    FROM events e
    LEFT JOIN artists a ON e.artist_id = a.id
    LEFT JOIN event_categories c ON e.category_id = c.id
    WHERE e.verification_status = 'PENDING'
    ORDER BY e.created_at ASC
")->fetchAll();

// Fetch pending organizer verification requests
$pending_organizers = $pdo->query("
    SELECT u.*, r.name as role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE r.name = 'Organizer' AND u.is_verified_organizer = 2
    ORDER BY u.created_at ASC
")->fetchAll();

// Fetch all verified organizers & fanclubs
$verified_organizers = $pdo->query("
    SELECT u.*, 
           (SELECT COUNT(*) FROM events WHERE organizer_id = u.id) as total_events
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE r.name = 'Organizer' AND u.is_verified_organizer = 1
    ORDER BY u.full_name ASC
")->fetchAll();

// Fetch community event reports
$community_reports = $pdo->query("
    SELECT r.*, e.event_name, e.poster_image, u.full_name as reporter_name
    FROM event_reports r
    JOIN events e ON r.event_id = e.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.status = 'PENDING'
    ORDER BY r.created_at DESC
")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <i class="fas fa-certificate me-1.5 text-emerald-600"></i> Fanclub Authorization Portal
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            Fanclub & Organizer Verification Center
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Verify fanclub credentials (e.g. MOAbasedMY, MYCarats) to grant official trust badges, eliminating biased event-by-event approval.</p>
    </div>

    <!-- Explanatory Helper Notice -->
    <div class="p-5 mb-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-lg border border-emerald-500/30">
        <div class="flex items-start space-x-4">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-lg">
                <i class="fas fa-shield-cat"></i>
            </div>
            <div>
                <h3 class="text-base font-extrabold text-white">Decentralized Community Verification Model</h3>
                <p class="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                    To eliminate administrator bias and approval bottlenecks, K-Sync Malaysia verifies <strong>Fanclubs & Organizers</strong> based on their social presence (Twitter/X, Instagram, SSM registration) rather than gatekeeping individual events. Once a fanclub like <strong class="text-emerald-300">MOAbasedMY (@MOAbasedMY)</strong> is verified, their events automatically carry the official <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/30 text-emerald-200 border border-emerald-400/30"><i class="fas fa-certificate me-1 text-emerald-400"></i> Verified Fanclub</span> badge.
                </p>
            </div>
        </div>
    </div>

    <!-- Pending Event Submissions Queue (Model 2: Admin Approval UI) -->
    <div class="mb-12 space-y-6">
        <h2 class="text-xl font-black text-slate-900 flex items-center">
            <i class="fas fa-clock-rotate-left me-2.5 text-pink-500"></i>
            Pending Event Submissions Awaiting Approval (<?= count($pending_events) ?>)
        </h2>

        <?php if (empty($pending_events)): ?>
            <div class="glass-card p-8 text-center rounded-3xl border border-slate-200 text-slate-500 text-sm font-semibold shadow-sm">
                <i class="fas fa-circle-check text-emerald-500 text-3xl mb-2 block"></i>
                No pending event submissions! All submitted events have been reviewed and verified.
            </div>
        <?php else: ?>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <?php foreach ($pending_events as $pe): ?>
                    <div class="glass-card p-6 rounded-3xl border border-pink-200 shadow-md space-y-4 bg-white">
                        <div class="flex items-start space-x-4">
                            <img src="<?= htmlspecialchars($pe['poster_image']) ?>" class="w-20 h-24 object-cover rounded-2xl border border-slate-200 shrink-0">
                            <div class="space-y-1">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700">
                                    <?= htmlspecialchars($pe['category_name']) ?>
                                </span>
                                <h3 class="text-base font-black text-slate-900 leading-tight"><?= htmlspecialchars($pe['event_name']) ?></h3>
                                <p class="text-xs text-pink-600 font-bold"><i class="fas fa-microphone-lines me-1"></i> <?= htmlspecialchars($pe['artist_name'] ?? 'K-Pop Group') ?></p>
                                <p class="text-xs text-slate-500 font-semibold"><i class="far fa-calendar-alt me-1 text-purple-500"></i> <?= date('M d, Y', strtotime($pe['event_date'])) ?> &bull; <?= htmlspecialchars($pe['venue_name']) ?></p>
                            </div>
                        </div>

                        <?php if (!empty($pe['official_url'])): ?>
                            <p class="text-xs text-slate-600"><strong class="text-slate-900">Official Link:</strong> <a href="<?= htmlspecialchars($pe['official_url']) ?>" target="_blank" class="text-pink-600 font-bold hover:underline"><?= htmlspecialchars($pe['official_url']) ?> &rarr;</a></p>
                        <?php endif; ?>

                        <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                            <form method="POST" action="" onsubmit="return confirm('Reject this event submission?');">
                                <input type="hidden" name="event_id" value="<?= $pe['id'] ?>">
                                <input type="hidden" name="action" value="reject_event">
                                <button type="submit" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold text-xs">
                                    Reject
                                </button>
                            </form>
                            <form method="POST" action="" onsubmit="return confirm('Approve and publish this event live on public discovery?');">
                                <input type="hidden" name="event_id" value="<?= $pe['id'] ?>">
                                <input type="hidden" name="action" value="approve_event">
                                <button type="submit" class="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-md shadow-pink-500/20">
                                    <i class="fas fa-check-circle me-1"></i> Approve & Publish Live
                                </button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Pending Verification Requests Queue -->
    <div class="mb-12 space-y-6">
        <h2 class="text-lg font-black text-slate-900 flex items-center">
            <i class="fas fa-hourglass-half me-2.5 text-amber-500"></i>
            Pending Verification Requests (<?= count($pending_organizers) ?>)
        </h2>

        <?php if (empty($pending_organizers)): ?>
            <div class="glass-card p-8 text-center rounded-3xl border border-slate-200 text-slate-500 text-sm font-semibold shadow-sm">
                <i class="fas fa-circle-check text-emerald-500 text-3xl mb-2 block"></i>
                No pending fanclub verification requests. All organizer credentials have been reviewed!
            </div>
        <?php else: ?>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <?php foreach ($pending_organizers as $org): ?>
                    <div class="glass-card p-6 rounded-3xl border border-amber-200 shadow-md bg-amber-50/20 space-y-4">
                        <div class="flex items-start justify-between">
                            <div>
                                <span class="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 uppercase">
                                    <?= htmlspecialchars($org['organization_type'] ?? 'Fanclub') ?>
                                </span>
                                <h3 class="text-lg font-black text-slate-900 mt-1"><?= htmlspecialchars($org['organization_name'] ?: $org['full_name']) ?></h3>
                                <p class="text-xs text-slate-600 font-semibold"><i class="fas fa-user me-1 text-slate-400"></i> Account: <?= htmlspecialchars($org['username']) ?> (<?= htmlspecialchars($org['email']) ?>)</p>
                            </div>
                            <?php if (!empty($org['social_handle'])): ?>
                                <span class="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-700 border border-sky-200">
                                    <i class="fab fa-twitter me-1"></i> <?= htmlspecialchars($org['social_handle']) ?>
                                </span>
                            <?php endif; ?>
                        </div>

                        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 text-xs space-y-2">
                            <p class="text-slate-700"><strong>Bio / Description:</strong> <?= htmlspecialchars($org['bio'] ?? 'N/A') ?></p>
                            <?php if (!empty($org['social_url'])): ?>
                                <p><strong class="text-slate-900">Official Social Media:</strong> <a href="<?= htmlspecialchars($org['social_url']) ?>" target="_blank" class="text-pink-600 font-bold hover:underline"><i class="fas fa-arrow-up-right-from-square me-1"></i> Visit <?= htmlspecialchars($org['social_url']) ?> &rarr;</a></p>
                            <?php endif; ?>
                            <?php if (!empty($org['verification_proof'])): ?>
                                <p><strong class="text-slate-900">Verification Proof:</strong> <?= htmlspecialchars($org['verification_proof']) ?></p>
                            <?php endif; ?>
                        </div>

                        <div class="flex items-center justify-end space-x-3 pt-2">
                            <form method="POST" action="" onsubmit="return confirm('Verify this fanclub and grant official Verified Fanclub badge?');">
                                <input type="hidden" name="user_id" value="<?= $org['id'] ?>">
                                <input type="hidden" name="action" value="verify_organizer">
                                <input type="hidden" name="notes" value="Verified authentic K-Pop fanclub social handle">
                                <button type="submit" class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center">
                                    <i class="fas fa-certificate me-1.5"></i> Verify & Grant Badge
                                </button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Verified Fanclubs & Organizers Directory Table -->
    <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm mb-12">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h3 class="text-base font-black text-slate-900 flex items-center">
                <i class="fas fa-certificate text-emerald-500 me-2"></i> Verified Fanclubs & Organizers Registry (<?= count($verified_organizers) ?>)
            </h3>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700 font-medium">
                <thead class="bg-slate-50 text-slate-900 uppercase font-extrabold border-b border-slate-200">
                    <tr>
                        <th class="p-3"><i class="fas fa-users me-1 text-emerald-500"></i> Fanclub / Organization</th>
                        <th class="p-3"><i class="fas fa-tag me-1 text-purple-500"></i> Type</th>
                        <th class="p-3"><i class="fab fa-twitter me-1 text-sky-500"></i> Social Handle</th>
                        <th class="p-3"><i class="fas fa-calendar-check me-1 text-pink-500"></i> Published Events</th>
                        <th class="p-3"><i class="fas fa-shield-halved me-1 text-emerald-600"></i> Status</th>
                        <th class="p-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <?php foreach ($verified_organizers as $vo): ?>
                        <tr class="hover:bg-slate-50/80 transition-colors">
                            <td class="p-3 font-black text-slate-900">
                                <?= htmlspecialchars($vo['organization_name'] ?: $vo['full_name']) ?>
                                <span class="block text-[10px] text-slate-400 font-medium">User: @<?= htmlspecialchars($vo['username']) ?></span>
                            </td>
                            <td class="p-3"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200"><?= htmlspecialchars($vo['organization_type'] ?? 'Fanclub') ?></span></td>
                            <td class="p-3 font-bold text-sky-600">
                                <?php if (!empty($vo['social_url'])): ?>
                                    <a href="<?= htmlspecialchars($vo['social_url']) ?>" target="_blank" class="hover:underline flex items-center"><i class="fab fa-twitter me-1"></i> <?= htmlspecialchars($vo['social_handle'] ?: $vo['social_url']) ?></a>
                                <?php else: ?>
                                    <?= htmlspecialchars($vo['social_handle'] ?: '-') ?>
                                <?php endif; ?>
                            </td>
                            <td class="p-3 font-black text-slate-900"><?= $vo['total_events'] ?> event(s)</td>
                            <td class="p-3"><?= get_organizer_badge($vo) ?></td>
                            <td class="p-3 text-right">
                                <form method="POST" action="" onsubmit="return confirm('Revoke verification for this fanclub?');" class="inline">
                                    <input type="hidden" name="user_id" value="<?= $vo['id'] ?>">
                                    <input type="hidden" name="action" value="revoke_organizer">
                                    <button type="submit" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[11px] font-bold transition-all">
                                        Revoke Badge
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Community Event Reports & Moderation -->
    <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <h3 class="text-base font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center">
            <i class="fas fa-flag text-rose-500 me-2"></i> Community Event Reports & Moderation (<?= count($community_reports) ?>)
        </h3>

        <?php if (empty($community_reports)): ?>
            <p class="text-xs text-slate-500 font-semibold text-center py-4">No pending community reports. Community event trust is clear!</p>
        <?php else: ?>
            <div class="space-y-4">
                <?php foreach ($community_reports as $rep): ?>
                    <div class="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">Reason: <?= htmlspecialchars($rep['report_reason']) ?></span>
                            <h4 class="text-sm font-black text-slate-900 mt-1"><?= htmlspecialchars($rep['event_name']) ?></h4>
                            <p class="text-xs text-slate-600 font-medium mt-1">Details: <?= htmlspecialchars($rep['report_details'] ?? 'None') ?> (Reported by: <?= htmlspecialchars($rep['reporter_name'] ?? 'Anonymous Fan') ?>)</p>
                        </div>
                        <div class="flex items-center space-x-2 shrink-0">
                            <form method="POST" action="">
                                <input type="hidden" name="report_id" value="<?= $rep['id'] ?>">
                                <input type="hidden" name="action" value="dismiss_report">
                                <button type="submit" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">Dismiss</button>
                            </form>
                            <form method="POST" action="" onsubmit="return confirm('Flag and hide this event from public discovery?');">
                                <input type="hidden" name="report_id" value="<?= $rep['id'] ?>">
                                <input type="hidden" name="event_id" value="<?= $rep['event_id'] ?>">
                                <input type="hidden" name="action" value="flag_event">
                                <button type="submit" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black">Flag & Hide Event</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
