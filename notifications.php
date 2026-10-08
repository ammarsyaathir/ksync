<?php
// notifications.php - Fan Notification Center

$page_title = "In-System Notifications | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';
require_login();

$user_id = $current_user['id'];

// Fetch Notifications
$stmt = $pdo->prepare("
    SELECT n.*, e.event_name, e.poster_image, eu.update_title, eu.update_type
    FROM notifications n
    LEFT JOIN events e ON n.event_id = e.id
    LEFT JOIN event_updates eu ON n.update_id = eu.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
");
$stmt->execute([$user_id]);
$notifications = $stmt->fetchAll();
?>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200/80 gap-4">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <i class="fas fa-bell me-1 text-amber-600"></i> Fan Notification Hub
                </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                Notifications
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Updates and announcements for your saved K-Pop events.</p>
        </div>

        <?php if (!empty($notifications)): ?>
            <button onclick="markAllNotificationsRead()" class="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center transition-all cursor-pointer">
                <i class="fas fa-check-double me-1.5 text-emerald-400"></i> Mark All as Read
            </button>
        <?php endif; ?>
    </div>

    <?php if (empty($notifications)): ?>
        <div class="bg-white rounded-2xl p-12 text-center max-w-lg mx-auto my-12 border border-slate-200 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                <i class="far fa-bell-slash"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">No Notifications Yet</h3>
            <p class="text-slate-500 text-xs font-medium">When organizers post updates for events you have saved, alerts will appear here.</p>
        </div>
    <?php else: ?>
        <div class="space-y-4">
            <?php foreach ($notifications as $n): ?>
                <div class="glass-card p-5 rounded-2xl border transition-all flex items-start space-x-4 <?= $n['is_read'] ? 'border-slate-200 bg-white/80 opacity-85 shadow-sm' : 'border-pink-300 bg-pink-50/50 shadow-md' ?>">
                    <div class="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 shadow-sm">
                        <img src="<?= htmlspecialchars($n['poster_image'] ?? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100') ?>" class="w-full h-full object-cover">
                    </div>

                    <div class="flex-grow min-w-0">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-bold text-purple-700 truncate"><?= htmlspecialchars($n['event_name']) ?></span>
                            <span class="text-[11px] text-slate-400 font-medium shrink-0 ms-2"><?= date('d M, h:i A', strtotime($n['created_at'])) ?></span>
                        </div>
                        <p class="text-sm font-bold text-slate-900 mb-2"><?= htmlspecialchars($n['message']) ?></p>
                        
                        <div class="flex items-center space-x-4 text-xs font-semibold">
                            <a href="<?= $base_url ?>/event-details.php?id=<?= $n['event_id'] ?>" class="text-pink-600 hover:text-pink-700 font-bold flex items-center">
                                View Event Details <i class="fas fa-arrow-right ms-1 text-[10px]"></i>
                            </a>
                            <?php if (!$n['is_read']): ?>
                                <button onclick="markNotificationRead(<?= $n['id'] ?>, this.closest('.glass-card'))" class="text-slate-500 hover:text-emerald-600 transition-colors flex items-center">
                                    <i class="fas fa-check me-1 text-emerald-500"></i> Mark as Read
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<script>
function markNotificationRead(id, element) {
    fetch('<?= $base_url ?>/ajax/mark_notification.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'notification_id=' + id
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'success') {
            element.classList.remove('border-pink-300', 'bg-pink-50/50', 'shadow-md');
            element.classList.add('border-slate-200', 'bg-white/80', 'opacity-85', 'shadow-sm');
        }
    });
}

function markAllNotificationsRead() {
    fetch('<?= $base_url ?>/ajax/mark_notification.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'mark_all=1'
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'success') {
            location.reload();
        }
    });
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
