<?php
// admin/dashboard.php - Administrator Portal Control Center (Enhanced Design)

$page_title = "Admin Dashboard | K-Sync Malaysia";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

// Metrics
$total_events = $pdo->query("SELECT COUNT(*) FROM events")->fetchColumn();
$pending_verifications = $pdo->query("SELECT COUNT(*) FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(r.name) = 'organizer' AND u.is_verified_organizer = 2")->fetchColumn();
$total_users = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$total_organizers = $pdo->query("SELECT COUNT(*) FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(r.name) = 'organizer'")->fetchColumn();
$total_verified_fanclubs = $pdo->query("SELECT COUNT(*) FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(r.name) = 'organizer' AND u.is_verified_organizer = 1")->fetchColumn();
$total_artists = $pdo->query("SELECT COUNT(*) FROM artists")->fetchColumn();
$total_venues = $pdo->query("SELECT COUNT(*) FROM venues")->fetchColumn();
$total_logs = $pdo->query("SELECT COUNT(*) FROM activity_logs")->fetchColumn();

// Pending fanclub verification requests preview
$pending_list = $pdo->query("
    SELECT u.*, r.name as role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE LOWER(r.name) = 'organizer' AND u.is_verified_organizer = 2
    ORDER BY u.created_at ASC
    LIMIT 5
")->fetchAll();

// Recent logs
$recent_logs = $pdo->query("
    SELECT l.*, u.username
    FROM activity_logs l
    LEFT JOIN users u ON l.user_id = u.id
    ORDER BY l.created_at DESC
    LIMIT 6
")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm">
                    <i class="fas fa-user-shield me-1"></i> Admin Workspace
                </span>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
                System Administrator Portal
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Full administrative control over event verifications, user accounts, artists, venues & audit logs.</p>
        </div>

        <?php if ($pending_verifications > 0): ?>
            <a href="<?= $base_url ?>/admin/verifications.php" class="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center cursor-pointer transition-all">
                <i class="fas fa-certificate me-2"></i> Review <?= $pending_verifications ?> Fanclub Verification(s)
            </a>
        <?php endif; ?>
    </div>

    <!-- Stat Cards Grid (Distinct Card Colors) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <!-- Card 1: Amber Theme -->
        <a href="<?= $base_url ?>/admin/verifications.php" class="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
            <div class="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                <span>Fanclub Reviews</span>
                <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm shadow-sm"><i class="fas fa-certificate"></i></div>
            </div>
            <p class="text-3xl font-extrabold text-amber-900"><?= $pending_verifications ?></p>
            <p class="text-[11px] text-amber-700 font-medium mt-1.5"><i class="fas fa-hand-pointer me-1"></i> Requires verification</p>
        </a>

        <!-- Card 2: Pink Theme -->
        <a href="<?= $base_url ?>/admin/events.php" class="bg-pink-50/70 p-6 rounded-3xl border border-pink-200 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
            <div class="flex items-center justify-between text-pink-800 text-xs font-bold mb-2">
                <span>Total System Events</span>
                <div class="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm shadow-sm"><i class="fas fa-calendar-days"></i></div>
            </div>
            <p class="text-3xl font-extrabold text-pink-900"><?= $total_events ?></p>
            <p class="text-[11px] text-pink-700 font-medium mt-1.5"><i class="fas fa-database me-1"></i> All listings in DB</p>
        </a>

        <!-- Card 3: Indigo Theme -->
        <a href="<?= $base_url ?>/admin/users.php" class="bg-indigo-50/70 p-6 rounded-3xl border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
            <div class="flex items-center justify-between text-indigo-800 text-xs font-bold mb-2">
                <span>Total Users / Organizers</span>
                <div class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm shadow-sm"><i class="fas fa-users"></i></div>
            </div>
            <p class="text-3xl font-extrabold text-indigo-900"><?= $total_users ?> <span class="text-xs text-indigo-600 font-medium">(<?= $total_organizers ?> orgs)</span></p>
            <p class="text-[11px] text-indigo-700 font-medium mt-1.5"><i class="fas fa-user-check me-1"></i> Registered accounts</p>
        </a>

        <!-- Card 4: Emerald Theme -->
        <a href="<?= $base_url ?>/admin/logs.php" class="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
            <div class="flex items-center justify-between text-emerald-800 text-xs font-bold mb-2">
                <span>Audit Logs Recorded</span>
                <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-sm"><i class="fas fa-file-shield"></i></div>
            </div>
            <p class="text-3xl font-extrabold text-emerald-900"><?= $total_logs ?></p>
            <p class="text-[11px] text-emerald-700 font-medium mt-1.5"><i class="fas fa-clock-rotate-left me-1"></i> System audit trail</p>
        </a>
    </div>

    <!-- Admin Quick Actions Toolbar -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
        <h3 class="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4 flex items-center"><i class="fas fa-sliders me-2 text-slate-400"></i> Management Modules</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <a href="<?= $base_url ?>/admin/verifications.php" class="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 hover:border-amber-300 text-center transition-all cursor-pointer group">
                <i class="fas fa-clipboard-check text-amber-600 text-xl mb-1.5 block group-hover:scale-110 transition-transform"></i>
                <span class="text-xs font-bold text-amber-900">Verifications</span>
            </a>
            <a href="<?= $base_url ?>/admin/events.php" class="p-4 rounded-2xl bg-pink-50/90 border border-pink-200 hover:border-pink-300 text-center transition-all cursor-pointer group">
                <i class="fas fa-calendar-days text-pink-600 text-xl mb-1.5 block group-hover:scale-110 transition-transform"></i>
                <span class="text-xs font-bold text-pink-900">All Events</span>
            </a>
            <a href="<?= $base_url ?>/admin/users.php" class="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200 hover:border-indigo-300 text-center transition-all cursor-pointer group">
                <i class="fas fa-users text-indigo-600 text-xl mb-1.5 block group-hover:scale-110 transition-transform"></i>
                <span class="text-xs font-bold text-indigo-900">Manage Users</span>
            </a>
            <a href="<?= $base_url ?>/admin/artists.php" class="p-4 rounded-2xl bg-purple-50/90 border border-purple-200 hover:border-purple-300 text-center transition-all cursor-pointer group">
                <i class="fas fa-microphone-lines text-purple-600 text-xl mb-1.5 block group-hover:scale-110 transition-transform"></i>
                <span class="text-xs font-bold text-purple-900">Manage Artists</span>
            </a>
            <a href="<?= $base_url ?>/admin/categories.php" class="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 hover:border-emerald-300 text-center transition-all cursor-pointer group">
                <i class="fas fa-tags text-emerald-600 text-xl mb-1.5 block group-hover:scale-110 transition-transform"></i>
                <span class="text-xs font-bold text-emerald-900">Categories</span>
            </a>
            <a href="<?= $base_url ?>/admin/venues.php" class="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 hover:border-rose-300 text-center transition-all cursor-pointer group">
                <i class="fas fa-location-dot text-rose-600 text-xl mb-1.5 block group-hover:scale-110 transition-transform"></i>
                <span class="text-xs font-bold text-rose-900">Manage Venues</span>
            </a>
        </div>
    </div>

    <!-- Grid: Pending Verifications & System Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Pending Queue -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 class="font-bold text-slate-900 text-base flex items-center"><i class="fas fa-clock text-amber-500 me-2"></i> Pending Verifications Queue</h3>
                <a href="<?= $base_url ?>/admin/verifications.php" class="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer">View All Queue &rarr;</a>
            </div>

            <?php if (empty($pending_list)): ?>
                <div class="text-center py-8 text-slate-500 text-xs font-medium">
                    <i class="fas fa-circle-check text-emerald-500 text-3xl mb-2 block"></i>
                    No pending events requiring review right now!
                </div>
            <?php else: ?>
                <div class="space-y-3">
                    <?php foreach ($pending_list as $p): ?>
                        <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs">
                            <div>
                                <h4 class="font-bold text-slate-900 text-sm"><?= htmlspecialchars($p['event_name']) ?></h4>
                                <p class="text-slate-600 font-medium mt-0.5"><i class="fas fa-user me-1 text-slate-400"></i> <?= htmlspecialchars($p['organizer_name'] ?? 'Organizer') ?> • <?= date('d M Y', strtotime($p['event_date'])) ?></p>
                            </div>
                            <a href="<?= $base_url ?>/admin/verifications.php" class="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 shadow-sm transition-all cursor-pointer">
                                Review &rarr;
                            </a>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <!-- System Audit Log Preview -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 class="font-bold text-slate-900 text-base flex items-center"><i class="fas fa-file-shield text-slate-600 me-2"></i> Recent Activity Logs</h3>
                <a href="<?= $base_url ?>/admin/logs.php" class="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer">View Full Log &rarr;</a>
            </div>

            <div class="space-y-2.5 text-xs text-slate-700 font-medium">
                <?php foreach ($recent_logs as $log): ?>
                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                            <span class="font-bold text-slate-900">[<?= htmlspecialchars($log['action']) ?>]</span>
                            <span class="text-slate-700"><?= htmlspecialchars($log['description']) ?></span>
                            <span class="text-slate-500 text-[10px]">by @<?= htmlspecialchars($log['username'] ?? 'System') ?></span>
                        </div>
                        <span class="text-[10px] text-slate-400 font-medium shrink-0 ms-2"><?= date('H:i', strtotime($log['created_at'])) ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
