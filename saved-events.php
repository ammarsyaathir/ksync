<?php
// saved-events.php - Fan Saved Events & Tracking Dashboard (Light Theme)

$page_title = "My Saved Events | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';
require_login();

$user_id = $current_user['id'];

// Fetch Saved Events for current user
$stmt = $pdo->prepare("
    SELECT e.*, se.saved_at,
           a.name as artist_name,
           c.name as category_name,
           v.name as venue_display
    FROM saved_events se
    JOIN events e ON se.event_id = e.id
    LEFT JOIN artists a ON e.artist_id = a.id
    LEFT JOIN event_categories c ON e.category_id = c.id
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE se.user_id = ?
    ORDER BY e.event_date ASC
");
$stmt->execute([$user_id]);
$saved_events = $stmt->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200/80 gap-4">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                    <i class="fas fa-bookmark me-1 text-pink-500"></i> Fan Saved Events
                </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                My Saved Events
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Track upcoming schedules, live countdowns, and organizer updates for saved events.</p>
        </div>
        <span class="px-4 py-2 rounded-2xl text-xs font-bold bg-slate-900 text-white shadow-sm flex items-center shrink-0 self-start md:self-auto">
            <i class="fas fa-heart me-2 text-rose-400"></i> <?= count($saved_events) ?> Saved Event(s)
        </span>
    </div>

    <?php if (empty($saved_events)): ?>
        <div class="bg-white rounded-2xl p-12 text-center max-w-lg mx-auto my-12 border border-slate-200 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                <i class="far fa-bookmark"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">No Saved Events Yet</h3>
            <p class="text-slate-500 text-xs mb-6">Discover upcoming concerts, fan meetings, and cupsleeve events and save them here for quick countdown tracking.</p>
            <a href="<?= $base_url ?>/events.php" class="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all inline-block">
                Discover K-Pop Events
            </a>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($saved_events as $event): ?>
                <?php 
                    $calc_status = get_calculated_event_status($event);
                    $eventTimestamp = strtotime($event['event_date'] . ' ' . ($event['start_time'] ?? '00:00:00'));
                ?>
                <div class="glass-card rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between group">
                    <div>
                        <!-- Poster & Badges -->
                        <div class="relative h-44 overflow-hidden bg-slate-100">
                            <img src="<?= htmlspecialchars($event['poster_image']) ?>" alt="<?= htmlspecialchars($event['event_name']) ?>" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                            
                            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-purple-700 backdrop-blur-md">
                                    <?= htmlspecialchars($event['category_name']) ?>
                                </span>
                                <?= get_status_badge($calc_status) ?>
                            </div>

                            <button onclick="toggleSaveEvent(<?= $event['id'] ?>, this)" 
                                    class="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 text-white border border-rose-400 backdrop-blur-md flex items-center justify-center text-xs shadow-md hover:bg-rose-600 transition-colors" title="Remove Saved Event">
                                <i class="fas fa-trash-can"></i>
                            </button>
                        </div>

                        <!-- Content -->
                        <div class="p-5">
                            <p class="text-xs font-bold text-pink-600 mb-1"><?= htmlspecialchars($event['artist_name'] ?? 'Multiple Artists') ?></p>
                            <h3 class="text-base font-bold text-slate-900 mb-3 line-clamp-2">
                                <a href="<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>" class="hover:text-pink-600 transition-colors">
                                    <?= htmlspecialchars($event['event_name']) ?>
                                </a>
                            </h3>

                            <div class="space-y-1.5 text-xs text-slate-600 mb-4 font-medium">
                                <div class="flex items-center">
                                    <i class="far fa-calendar-alt w-4 text-pink-500 me-2"></i>
                                    <span><?= date('D, d M Y', strtotime($event['event_date'])) ?></span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-location-dot w-4 text-rose-500 me-2"></i>
                                    <span class="truncate"><?= htmlspecialchars($event['venue_name']) ?></span>
                                </div>
                            </div>

                            <!-- Live Mini Countdown -->
                            <?php if ($calc_status === 'UPCOMING'): ?>
                                <div class="bg-pink-50/70 p-3 rounded-xl border border-pink-100 text-center">
                                    <span class="text-[10px] text-pink-600 uppercase font-bold block mb-1">Countdown</span>
                                    <div class="text-xs font-extrabold text-purple-700 font-mono" id="saved-timer-<?= $event['id'] ?>">
                                        Calculating...
                                    </div>
                                </div>
                                <script>
                                    (function() {
                                        const target = <?= $eventTimestamp ?> * 1000;
                                        function update() {
                                            const diff = target - new Date().getTime();
                                            const el = document.getElementById('saved-timer-<?= $event['id'] ?>');
                                            if (!el) return;
                                            if (diff <= 0) {
                                                el.textContent = "Event Started";
                                                return;
                                            }
                                            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                                            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                            el.textContent = `${d}d ${h}h ${m}m remaining`;
                                        }
                                        update();
                                        setInterval(update, 30000);
                                    })();
                                </script>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="p-5 pt-0">
                        <a href="<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>" 
                           class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-pink-500 text-slate-800 hover:text-white text-xs font-bold block text-center transition-all">
                            View Event & Updates
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
