<?php
// organizer/my-events.php - List Organizer Submitted Events

$page_title = "My Submitted Events | K-Sync Malaysia";
require_once __DIR__ . '/../includes/header.php';
require_role('organizer');

$organizer_id = $current_user['id'];

// Fetch all events by this organizer
$stmt = $pdo->prepare("
    SELECT e.*, c.name as category_name, a.name as artist_name
    FROM events e
    LEFT JOIN event_categories c ON e.category_id = c.id
    LEFT JOIN artists a ON e.artist_id = a.id
    WHERE e.organizer_id = ?
    ORDER BY e.created_at DESC
");
$stmt->execute([$organizer_id]);
$events = $stmt->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200/80 gap-4">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                    <i class="fas fa-building me-1.5 text-purple-600"></i> Organizer Workspace
                </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                My Submitted Events
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Track verification statuses, edit event information, and publish updates to fans.</p>
        </div>
        <a href="<?= $base_url ?>/organizer/submit-event.php" class="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center shrink-0 cursor-pointer">
            <i class="fas fa-plus-circle me-2 text-pink-400"></i> Submit New Event
        </a>
    </div>

    <?php if (empty($events)): ?>
        <div class="bg-white rounded-2xl p-12 text-center max-w-lg mx-auto my-12 border border-slate-200 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                <i class="far fa-calendar-xmark"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">No Events Submitted</h3>
            <p class="text-slate-500 text-xs mb-6 font-medium">Start submitting your K-Pop events to make them discoverable to Malaysian fans.</p>
            <a href="<?= $base_url ?>/organizer/submit-event.php" class="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all inline-block">
                Submit Event Now
            </a>
        </div>
    <?php else: ?>
        <div class="space-y-4">
            <?php foreach ($events as $ev): ?>
                <div class="glass-card p-6 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-start space-x-4">
                        <div class="w-20 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm">
                            <img src="<?= htmlspecialchars($ev['poster_image']) ?>" class="w-full h-full object-cover">
                        </div>
                        <div class="space-y-1.5">
                            <div class="flex flex-wrap items-center gap-2">
                                <?= get_verification_badge($ev['verification_status']) ?>
                                <?= get_status_badge(get_calculated_event_status($ev)) ?>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200"><?= htmlspecialchars($ev['category_name'] ?? 'Category') ?></span>
                            </div>
                            <h3 class="text-lg font-bold text-slate-900"><?= htmlspecialchars($ev['event_name']) ?></h3>
                            <p class="text-xs text-slate-600 font-medium">
                                <i class="far fa-calendar-alt me-1 text-pink-500"></i> <?= date('D, d M Y', strtotime($ev['event_date'])) ?> 
                                • <i class="fas fa-location-dot me-1 text-rose-500"></i> <?= htmlspecialchars($ev['venue_name']) ?>, <?= htmlspecialchars($ev['city']) ?>
                            </p>

                            <!-- Rejection Reason Alert if Rejected -->
                            <?php if ($ev['verification_status'] === 'REJECTED' && !empty($ev['rejection_reason'])): ?>
                                <div class="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                                    <strong class="font-bold flex items-center mb-0.5"><i class="fas fa-triangle-exclamation me-1.5 text-rose-500"></i> Admin Rejection Reason:</strong>
                                    <?= htmlspecialchars($ev['rejection_reason']) ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-wrap md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                        <a href="<?= $base_url ?>/event-details.php?id=<?= $ev['id'] ?>" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all">
                            <i class="fas fa-eye me-1"></i> Public Page
                        </a>
                        <a href="<?= $base_url ?>/organizer/edit-event.php?id=<?= $ev['id'] ?>" class="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all">
                            <i class="fas fa-pen-to-square me-1"></i> Edit Event
                        </a>
                        <?php if ($ev['verification_status'] === 'VERIFIED'): ?>
                            <a href="<?= $base_url ?>/organizer/submit-update.php?event_id=<?= $ev['id'] ?>" class="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition-all">
                                <i class="fas fa-bullhorn me-1"></i> Publish Update
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
