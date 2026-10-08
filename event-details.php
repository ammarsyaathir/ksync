<?php
// event-details.php - Event Details, Live Countdown, Updates & Location (Enhanced Design)

$base_url = (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/ksync_malaysia') !== false) ? '/ksync_malaysia' : '';
$event_id = intval($_GET['id'] ?? 0);
if (!$event_id) {
    header("Location: {$base_url}/events.php");
    exit;
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

// Fetch Event Details
$stmt = $pdo->prepare("
    SELECT e.*, 
           a.name as artist_name, a.group_type, a.image_url as artist_image,
           c.name as category_name, c.badge_color,
           v.name as venue_display, v.map_link, v.transit_info,
           u.full_name as organizer_name, u.email as organizer_email,
           u.organization_name, u.organization_type, u.social_handle, u.social_url, u.is_verified_organizer
    FROM events e
    LEFT JOIN artists a ON e.artist_id = a.id
    LEFT JOIN event_categories c ON e.category_id = c.id
    LEFT JOIN venues v ON e.venue_id = v.id
    LEFT JOIN users u ON e.organizer_id = u.id
    WHERE e.id = ?
");
$stmt->execute([$event_id]);
$event = $stmt->fetch();

if (!$event) {
    $_SESSION['flash_error'] = "Event not found.";
    header("Location: {$base_url}/events.php");
    exit;
}

// Handle Community Event Report POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'report_event') {
    $reason = trim($_POST['report_reason'] ?? '');
    $details = trim($_POST['report_details'] ?? '');
    $reporter_id = $current_user['id'] ?? null;
    
    if (!empty($reason)) {
        $stmtRep = $pdo->prepare("INSERT INTO event_reports (event_id, user_id, report_reason, report_details) VALUES (?, ?, ?, ?)");
        $stmtRep->execute([$event_id, $reporter_id, $reason, $details]);
        set_flash_message('success', 'Thank you! Your community report has been submitted to system moderators.');
        header("Location: {$base_url}/event-details.php?id={$event_id}");
        exit;
    }
}

$calc_status = get_calculated_event_status($event);

// Fetch Event Updates
$stmtUpdates = $pdo->prepare("
    SELECT eu.*, u.full_name as author_name 
    FROM event_updates eu
    LEFT JOIN users u ON eu.created_by = u.id
    WHERE eu.event_id = ?
    ORDER BY eu.created_at DESC
");
$stmtUpdates->execute([$event_id]);
$updates = $stmtUpdates->fetchAll();

$page_title = htmlspecialchars($event['event_name']) . " | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';

$isSaved = is_event_saved($current_user['id'] ?? null, $event['id']);
$eventTimestamp = strtotime($event['event_date'] . ' ' . ($event['start_time'] ?? '00:00:00'));

// Event Interest Queries (K-Sync Event Buddy Module)
$interest_count_stmt = $pdo->prepare("SELECT COUNT(*) FROM event_interest WHERE event_id = ?");
$interest_count_stmt->execute([$event['id']]);
$interest_count = $interest_count_stmt->fetchColumn();

$is_interested = false;
if (is_logged_in()) {
    $is_int_stmt = $pdo->prepare("SELECT COUNT(*) FROM event_interest WHERE event_id = ? AND user_id = ?");
    $is_int_stmt->execute([$event['id'], $current_user['id']]);
    $is_interested = $is_int_stmt->fetchColumn() > 0;
}

$top_fans_stmt = $pdo->prepare("
    SELECT u.full_name, u.profile_image 
    FROM event_interest ei 
    JOIN users u ON ei.user_id = u.id 
    WHERE ei.event_id = ? 
    LIMIT 3
");
$top_fans_stmt->execute([$event['id']]);
$top_interested_fans = $top_fans_stmt->fetchAll();
$disputedInfo = check_event_disputed_status($event['id']);
$orgLevelInfo = get_organizer_level_info($event['organizer_id']);
$changeHistory = get_event_change_history($event['id']);
?>

<!-- Banner Header -->
<div class="relative bg-gradient-to-b from-pink-100/70 via-purple-50/40 to-slate-50 border-b border-pink-100">
    <div class="h-64 sm:h-80 w-full relative overflow-hidden">
        <img src="<?= htmlspecialchars($event['poster_image']) ?>" alt="<?= htmlspecialchars($event['event_name']) ?>" class="w-full h-full object-cover blur-md opacity-25 scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-48 pb-8">
        <?php if ($disputedInfo['is_disputed']): ?>
            <div class="p-4 mb-6 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-900 text-xs font-bold shadow-lg flex items-start space-x-3">
                <i class="fas fa-triangle-exclamation text-amber-600 text-xl mt-0.5 shrink-0"></i>
                <div>
                    <h3 class="text-sm font-black text-amber-900">⚠️ Disputed Event Notice (<?= $disputedInfo['report_count'] ?> Community Reports)</h3>
                    <p class="mt-1 font-semibold leading-relaxed">Multiple Malaysian fans have flagged details on this event. Please cross-check official organizer profiles before making travel arrangements.</p>
                </div>
            </div>
        <?php endif; ?>

        <div class="flex flex-col md:flex-row gap-8 items-start">
            <!-- Poster Card -->
            <div class="w-full md:w-72 shrink-0 rounded-3xl overflow-hidden bg-white shadow-2xl border-4 border-white group">
                <img src="<?= htmlspecialchars($event['poster_image']) ?>" alt="<?= htmlspecialchars($event['event_name']) ?>" class="w-full h-auto object-cover">
            </div>

            <!-- Details Header -->
            <div class="flex-grow space-y-4">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="px-3.5 py-1 rounded-full text-xs font-black bg-white text-pink-700 border border-pink-200 shadow-sm">
                        <?= htmlspecialchars($event['category_name']) ?>
                    </span>
                    <?= get_status_badge($calc_status) ?>
                    <?= $orgLevelInfo['badge'] ?>
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><i class="fas fa-link me-1 text-emerald-500"></i> Details match source</span>
                </div>

                <h1 class="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                    <?= htmlspecialchars($event['event_name']) ?>
                </h1>

                <div class="flex items-center space-x-3 text-slate-700 text-sm font-extrabold">
                    <div class="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border-2 border-pink-300 shadow-sm">
                        <img src="<?= htmlspecialchars($event['artist_image'] ?? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100') ?>" class="w-full h-full object-cover">
                    </div>
                    <span>Featured Artist: <strong class="text-pink-600 font-black"><?= htmlspecialchars($event['artist_name'] ?? 'Multiple Artists') ?></strong></span>
                </div>

                <!-- Live Countdown Timer (for UPCOMING events) -->
                <?php if ($calc_status === 'UPCOMING'): ?>
                    <div class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 p-5 rounded-3xl max-w-md shadow-xl text-white">
                        <p class="text-xs font-black mb-2 flex items-center text-pink-100 uppercase tracking-wider">
                            <i class="fas fa-stopwatch me-2 animate-pulse text-white text-sm"></i> Live Countdown To Event:
                        </p>
                        <div id="countdown-timer" class="grid grid-cols-4 gap-2.5 text-center">
                            <div class="bg-white/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/25">
                                <span id="cd-days" class="block text-2xl font-black">00</span>
                                <span class="text-[10px] uppercase font-bold text-pink-100">Days</span>
                            </div>
                            <div class="bg-white/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/25">
                                <span id="cd-hours" class="block text-2xl font-black">00</span>
                                <span class="text-[10px] uppercase font-bold text-pink-100">Hours</span>
                            </div>
                            <div class="bg-white/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/25">
                                <span id="cd-mins" class="block text-2xl font-black">00</span>
                                <span class="text-[10px] uppercase font-bold text-pink-100">Mins</span>
                            </div>
                            <div class="bg-white/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/25">
                                <span id="cd-secs" class="block text-2xl font-black">00</span>
                                <span class="text-[10px] uppercase font-bold text-pink-100">Secs</span>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>

                <!-- Action Bar (Interested, Save, Share, Add to Calendar, Official Link) -->
                <div class="pt-2 flex flex-wrap items-center gap-3">
                    <button onclick="toggleInterest(<?= $event['id'] ?>, this)" 
                            class="px-5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center cursor-pointer <?= $is_interested ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200' ?>">
                        <i class="fas fa-heart me-2 text-pink-500"></i>
                        <span id="interest_btn_text"><?= $is_interested ? 'I\'m Interested ✓' : 'I\'m Interested' ?></span>
                        <span id="interest_count_badge" class="ms-2 px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-current font-bold"><?= $interest_count ?></span>
                    </button>

                    <a href="buddies.php?event_id=<?= $event['id'] ?>" class="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition flex items-center">
                        <i class="fas fa-handshake me-2 text-pink-400"></i> Who's Going? (Find Buddies)
                    </a>

                    <button onclick="toggleSaveEvent(<?= $event['id'] ?>, this)" 
                            class="px-5 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition-all flex items-center cursor-pointer <?= $isSaved ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-800 hover:bg-rose-50 border border-slate-200' ?>">
                        <i class="<?= $isSaved ? 'fas' : 'far' ?> fa-bookmark me-2 text-rose-500"></i>
                        <span><?= $isSaved ? 'Saved to My Events' : 'Save Event' ?></span>
                    </button>

                    <button onclick="openShareModal('<?= addslashes(htmlspecialchars($event['event_name'])) ?>', '<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>')" 
                            class="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs shadow-sm transition-all flex items-center cursor-pointer">
                        <i class="fas fa-share-nodes me-2 text-pink-500"></i> Share
                    </button>

                    <?php if (!empty($event['official_url'])): ?>
                        <a href="<?= htmlspecialchars($event['official_url']) ?>" target="_blank" rel="noopener noreferrer" 
                           class="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs shadow-sm transition-all flex items-center cursor-pointer">
                            <i class="fas fa-arrow-up-right-from-square me-2 text-pink-500"></i> Official Page
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Main Details Body -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2-Columns: Information Tabs -->
        <div class="lg:col-span-2 space-y-8">
            <!-- Event Description -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
                <h3 class="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center">
                    <i class="fas fa-align-left text-pink-500 me-2.5"></i> About This Event
                </h3>
                <div class="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                    <?= htmlspecialchars($event['description'] ?? 'No detailed description provided.') ?>
                </div>
            </div>

            <!-- Concert Day Survival & Fan Prep Checklist -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-200/90 shadow-md space-y-5 bg-gradient-to-b from-emerald-50/40 via-white to-white">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                    <div>
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <i class="fas fa-list-check text-emerald-600 me-1"></i> Interactive Fan Survival Tool
                            </span>
                        </div>
                        <h3 class="text-xl font-black text-slate-900">
                            Concert Day Survival & Fan Prep Checklist
                        </h3>
                        <p class="text-xs text-slate-500 font-semibold mt-0.5">Check off items as you prepare for concert day. Your progress is saved automatically!</p>
                    </div>
                    <!-- Live Progress Bar -->
                    <div class="bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 text-right shrink-0">
                        <span id="checklist-count-label" class="text-xs font-black text-emerald-700 block">0 / 7 Items Prepared (0%)</span>
                        <div class="w-36 bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                            <div id="checklist-progress-bar" class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-0 transition-all duration-300"></div>
                        </div>
                    </div>
                </div>

                <!-- LRT / Transit Route Station Banner (If Available) -->
                <?php if (!empty($event['transit_info'])): ?>
                    <div class="p-4 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-900 text-xs font-semibold flex items-start space-x-3 shadow-sm">
                        <div class="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0 font-bold text-sm">
                            <i class="fas fa-train-subway"></i>
                        </div>
                        <div>
                            <strong class="font-extrabold text-sky-950 block text-xs">LRT / MRT Transit Direction:</strong>
                            <p class="text-sky-800 mt-0.5 font-medium leading-relaxed"><?= htmlspecialchars($event['transit_info']) ?></p>
                        </div>
                    </div>
                <?php endif; ?>

                <!-- Checklist Items Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label class="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start space-x-3 cursor-pointer hover:border-emerald-300 transition-all shadow-sm group">
                        <input type="checkbox" onchange="updateChecklistProgress()" class="chk-item rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5" data-id="e_<?= $event_id ?>_ticket">
                        <div class="text-xs font-bold text-slate-800">
                            <span class="block group-hover:text-emerald-700 transition-colors"><i class="fas fa-ticket text-amber-500 me-1.5"></i> E-Ticket / Barcode Saved</span>
                            <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">Barcode or official wristband QR code saved offline on phone.</span>
                        </div>
                    </label>

                    <label class="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start space-x-3 cursor-pointer hover:border-emerald-300 transition-all shadow-sm group">
                        <input type="checkbox" onchange="updateChecklistProgress()" class="chk-item rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5" data-id="e_<?= $event_id ?>_id">
                        <div class="text-xs font-bold text-slate-800">
                            <span class="block group-hover:text-emerald-700 transition-colors"><i class="fas fa-id-card text-indigo-500 me-1.5"></i> NRIC / Passport ID</span>
                            <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">Required for identity check at ticket redemption queue.</span>
                        </div>
                    </label>

                    <label class="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start space-x-3 cursor-pointer hover:border-emerald-300 transition-all shadow-sm group">
                        <input type="checkbox" onchange="updateChecklistProgress()" class="chk-item rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5" data-id="e_<?= $event_id ?>_lightstick">
                        <div class="text-xs font-bold text-slate-800">
                            <span class="block group-hover:text-emerald-700 transition-colors"><i class="fas fa-wand-sparkles text-pink-500 me-1.5"></i> Lightstick & Spare AAA Batteries</span>
                            <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">3x fresh AAA batteries (insert only inside queue area).</span>
                        </div>
                    </label>

                    <label class="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start space-x-3 cursor-pointer hover:border-emerald-300 transition-all shadow-sm group">
                        <input type="checkbox" onchange="updateChecklistProgress()" class="chk-item rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5" data-id="e_<?= $event_id ?>_bag">
                        <div class="text-xs font-bold text-slate-800">
                            <span class="block group-hover:text-emerald-700 transition-colors"><i class="fas fa-bag-shopping text-purple-500 me-1.5"></i> Compact Bag (Max A4 Size)</span>
                            <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">Venue security prohibits backpacks larger than A4 paper.</span>
                        </div>
                    </label>

                    <label class="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start space-x-3 cursor-pointer hover:border-emerald-300 transition-all shadow-sm group">
                        <input type="checkbox" onchange="updateChecklistProgress()" class="chk-item rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5" data-id="e_<?= $event_id ?>_powerbank">
                        <div class="text-xs font-bold text-slate-800">
                            <span class="block group-hover:text-emerald-700 transition-colors"><i class="fas fa-battery-three-quarters text-emerald-500 me-1.5"></i> Power Bank (&lt; 20,000mAh)</span>
                            <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">Keep phone charged for photos & Grab ride home.</span>
                        </div>
                    </label>

                    <label class="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start space-x-3 cursor-pointer hover:border-emerald-300 transition-all shadow-sm group">
                        <input type="checkbox" onchange="updateChecklistProgress()" class="chk-item rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5" data-id="e_<?= $event_id ?>_water">
                        <div class="text-xs font-bold text-slate-800">
                            <span class="block group-hover:text-emerald-700 transition-colors"><i class="fas fa-bottle-water text-sky-500 me-1.5"></i> Sealed Water (&lt; 500ml)</span>
                            <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">Stay hydrated while queueing outside venue.</span>
                        </div>
                    </label>

                    <label class="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start space-x-3 cursor-pointer hover:border-emerald-300 transition-all shadow-sm group sm:col-span-2">
                        <input type="checkbox" onchange="updateChecklistProgress()" class="chk-item rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5" data-id="e_<?= $event_id ?>_lrt">
                        <div class="text-xs font-bold text-slate-800">
                            <span class="block group-hover:text-emerald-700 transition-colors"><i class="fas fa-route text-rose-500 me-1.5"></i> LRT / Transit Route Planned</span>
                            <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">Check LRT operation extension times & Grab pick-up points.</span>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Ticket Information -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
                <h3 class="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center">
                    <i class="fas fa-ticket text-amber-500 me-2.5"></i> Ticket Information
                </h3>
                <div class="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 font-medium">
                    <?= htmlspecialchars($event['ticket_info'] ?? 'Free entry / No ticket details specified.') ?>
                </div>
            </div>

            <!-- Event Rules & Guidelines -->
            <?php if (!empty($event['event_rules'])): ?>
                <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center">
                        <i class="fas fa-clipboard-list text-rose-500 me-2.5"></i> Event Rules & Venue Guidelines
                    </h3>
                    <div class="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-rose-50/60 p-5 rounded-2xl border border-rose-200/80 font-medium">
                        <?= htmlspecialchars($event['event_rules']) ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Latest Event Updates Published by Organizer -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
                <h3 class="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span class="flex items-center"><i class="fas fa-bullhorn text-pink-500 me-2.5"></i> Latest Event Updates</span>
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700"><?= count($updates) ?> updates</span>
                </h3>

                <?php if (empty($updates)): ?>
                    <p class="text-xs text-slate-500 italic font-medium">No updates have been posted by the organizer yet.</p>
                <?php else: ?>
                    <div class="space-y-4">
                        <?php foreach ($updates as $upd): ?>
                            <div class="p-5 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="px-3 py-0.5 rounded-full text-[10px] font-bold bg-pink-500 text-white uppercase">
                                        <?= htmlspecialchars($upd['update_type']) ?>
                                    </span>
                                    <span class="text-[11px] text-slate-500 font-medium"><?= date('d M Y, h:i A', strtotime($upd['created_at'])) ?></span>
                                </div>
                                <h4 class="font-bold text-slate-900 text-sm"><?= htmlspecialchars($upd['update_title']) ?></h4>
                                <p class="text-xs text-slate-700 whitespace-pre-line font-medium"><?= htmlspecialchars($upd['update_description']) ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Web-Based Event Community Group Chat & Q&A Hub -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-purple-200/90 shadow-md space-y-6 bg-gradient-to-b from-purple-50/30 via-white to-white">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                    <div>
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700 border border-purple-200">
                                <i class="fas fa-comments text-purple-600 me-1"></i> Live Web Chat Hub
                            </span>
                            <span id="chat-live-pulse" class="flex h-2 w-2 relative">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                        <h3 class="text-xl font-black text-slate-900">
                            Event Community Discussion & Q&A
                        </h3>
                        <p class="text-xs text-slate-500 font-semibold mt-0.5">Chat with fellow fans & ask organizer questions. Chat closes 24h after event ends.</p>
                    </div>
                    <span id="chat-message-count" class="px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white shadow-sm shrink-0 self-start sm:self-auto">
                        0 Messages
                    </span>
                </div>

                <!-- Chat Message Stream Container -->
                <div id="chat-messages-container" class="space-y-3.5 max-h-96 overflow-y-auto pr-2 custom-scrollbar p-1">
                    <div class="text-center text-xs text-slate-400 font-semibold py-8">
                        <i class="fas fa-spinner fa-spin me-2 text-purple-500"></i> Loading live messages...
                    </div>
                </div>

                <!-- Chat Input Form or Guest / Closure Banner -->
                <div id="chat-input-wrapper" class="pt-3 border-t border-slate-100">
                    <?php if (!is_logged_in()): ?>
                        <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold flex items-center justify-between">
                            <span class="flex items-center"><i class="fas fa-right-to-bracket text-purple-600 me-2 text-sm"></i> Log in to join this event's live group chat.</span>
                            <a href="<?= $base_url ?>/login.php" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-sm">Log In &rarr;</a>
                        </div>
                    <?php else: ?>
                        <form id="chat-form" onsubmit="sendChatMessage(event)" class="flex gap-2">
                            <input type="text" id="chat-input-text" placeholder="Type a message or ask a question to fans & organizer..." 
                                   required maxlength="500"
                                   class="flex-grow bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <button type="submit" id="btn-send-chat" 
                                    class="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-md transition-all flex items-center shrink-0 cursor-pointer">
                                <span>Send</span> <i class="fas fa-paper-plane ms-2"></i>
                            </button>
                        </form>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Immutable Event Change History Audit Log -->
            <?php if (!empty($changeHistory)): ?>
                <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                    <h3 class="text-sm font-black text-slate-900 flex items-center">
                        <i class="fas fa-clock-rotate-left text-amber-500 me-2"></i> Event Change Audit History
                    </h3>
                    <div class="space-y-3">
                        <?php foreach ($changeHistory as $chg): ?>
                            <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-slate-700">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="font-black text-amber-900 uppercase tracking-wider text-[10px]">
                                        <i class="fas fa-pen me-1 text-amber-600"></i> Field Changed: <?= htmlspecialchars($chg['field_name']) ?>
                                    </span>
                                    <span class="text-[10px] text-slate-400 font-medium"><?= date('M d, H:i', strtotime($chg['changed_at'])) ?></span>
                                </div>
                                <p class="font-semibold text-slate-800">
                                    Changed from <span class="line-through text-slate-400"><?= htmlspecialchars($chg['old_value']) ?></span> to <strong class="text-emerald-700"><?= htmlspecialchars($chg['new_value']) ?></strong>
                                </p>
                                <p class="text-[10px] text-slate-500 mt-1">Updated by <?= htmlspecialchars($chg['changed_by_name']) ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <!-- Right 1-Column: Event Sidebar Stats & Embedded Map -->
        <div class="space-y-6">
            <!-- Date & Time Card -->
            <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Date & Time</h3>
                
                <div class="flex items-start space-x-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-pink-100 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0 shadow-sm">
                        <i class="far fa-calendar-alt text-xl"></i>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 font-medium">Event Date</p>
                        <p class="text-sm font-bold text-slate-900"><?= date('l, d F Y', strtotime($event['event_date'])) ?></p>
                    </div>
                </div>

                <div class="flex items-start space-x-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0 shadow-sm">
                        <i class="far fa-clock text-xl"></i>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 font-medium">Time</p>
                        <p class="text-sm font-bold text-slate-900">
                            <?= date('h:i A', strtotime($event['start_time'])) ?>
                            <?= !empty($event['end_time']) ? ' - ' . date('h:i A', strtotime($event['end_time'])) : '' ?>
                        </p>
                    </div>
                </div>

                <button onclick="addToCalendar('<?= addslashes(htmlspecialchars($event['event_name'])) ?>', '<?= $event['event_date'] ?>', '<?= $event['start_time'] ?>', '<?= $event['end_time'] ?>', '<?= addslashes(htmlspecialchars($event['venue_name'])) ?>', '<?= addslashes(htmlspecialchars($event['city'])) ?>')" 
                        class="w-full py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center transition-all cursor-pointer">
                    <i class="far fa-calendar-plus me-2 text-purple-600"></i> Add to calendar
                </button>
            </div>

            <!-- Location, Venue & Embedded Interactive Google Map Card -->
            <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Venue & Google Map</h3>
                
                <div class="space-y-2">
                    <h4 class="font-bold text-slate-900 text-base flex items-center">
                        <i class="fas fa-location-dot text-rose-500 me-2"></i>
                        <?= htmlspecialchars($event['venue_name']) ?>
                    </h4>
                    <p class="text-xs text-slate-600 leading-relaxed font-medium"><?= htmlspecialchars($event['address']) ?></p>
                    <p class="text-xs font-bold text-pink-600"><?= htmlspecialchars($event['city']) ?>, <?= htmlspecialchars($event['state']) ?></p>
                </div>

                <?php 
                    $mapQuery = urlencode($event['venue_name'] . ' ' . $event['address'] . ' ' . $event['city'] . ' Malaysia');
                    $directMapUrl = !empty($event['map_link']) ? $event['map_link'] : "https://maps.google.com/?q={$mapQuery}";
                ?>

                <a href="<?= htmlspecialchars($directMapUrl) ?>" target="_blank" rel="noopener noreferrer" 
                   class="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center transition-all shadow-sm cursor-pointer">
                    <i class="fas fa-map-location-dot me-2 text-rose-400"></i> Open in maps
                </a>

                <!-- Interactive Embedded Google Maps Iframe -->
                <div class="rounded-2xl overflow-hidden border border-slate-200 shadow-sm mt-3 h-56 bg-slate-100">
                    <iframe class="w-full h-full border-0" loading="lazy" allowfullscreen 
                            src="https://maps.google.com/maps?q=<?= $mapQuery ?>&t=&z=14&ie=UTF8&iwloc=&output=embed">
                    </iframe>
                </div>
            </div>

            <!-- Organizer Profile Card -->
            <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">Event Organizer / Fanclub</h3>
                <div class="flex items-center space-x-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-sm shrink-0">
                        <?= strtoupper(substr($event['organization_name'] ?: ($event['organizer_name'] ?? 'O'), 0, 1)) ?>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm font-black text-slate-900 leading-snug">
                            <?= htmlspecialchars($event['organization_name'] ?: $event['organizer_name']) ?>
                        </p>
                        <div>
                            <?= get_organizer_badge([
                                'is_verified_organizer' => $event['is_verified_organizer'] ?? 0,
                                'organization_type' => $event['organization_type'] ?? 'Fanclub',
                                'social_handle' => $event['social_handle'] ?? ''
                            ]) ?>
                        </div>
                    </div>
                </div>

                <?php if (!empty($event['social_url'])): ?>
                    <div class="pt-2 border-t border-slate-100">
                        <a href="<?= htmlspecialchars($event['social_url']) ?>" target="_blank" 
                           class="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center border border-sky-200 transition-all">
                            <i class="fab fa-twitter me-2"></i> Visit Official Social Profile &rarr;
                        </a>
                    </div>
                <?php endif; ?>

                <div class="pt-2 border-t border-slate-100">
                    <button onclick="openReportModal()" class="w-full py-2 text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer">
                        <i class="fas fa-flag me-1.5 text-slate-400"></i> Report suspicious or fake event info
                    </button>
                </div>
            </div>
        </div>

    </div>
</div>

<!-- Community Event Report Modal -->
<div id="report-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4">
    <div class="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl">
        <h3 class="text-lg font-black text-slate-900 mb-2 flex items-center">
            <i class="fas fa-flag text-rose-500 me-2"></i> Report Event to Community Moderators
        </h3>
        <p class="text-xs text-slate-600 font-semibold mb-4">Report incorrect details, fake ticketing links, or duplicate listings for <strong class="text-slate-900"><?= htmlspecialchars($event['event_name']) ?></strong>.</p>
        
        <form method="POST" action="">
            <input type="hidden" name="action" value="report_event">

            <div class="mb-4">
                <label class="block text-xs font-extrabold text-slate-700 mb-1">Reason for Report *</label>
                <select name="report_reason" required class="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold">
                    <option value="">Select Reason</option>
                    <option value="Fake / Suspicious Link">Fake or Suspicious Ticket Link</option>
                    <option value="Incorrect Date or Venue">Incorrect Date, Time or Venue</option>
                    <option value="Impersonating Fanclub">Impersonating Official Fanclub / Organizer</option>
                    <option value="Cancelled Event">Event Cancelled but still listed</option>
                    <option value="Other">Other Reason</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-xs font-extrabold text-slate-700 mb-1">Additional Details (Optional)</label>
                <textarea name="report_details" rows="3" placeholder="Provide extra details for moderators..."
                          class="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"></textarea>
            </div>

            <div class="flex justify-end space-x-2">
                <button type="button" onclick="closeReportModal()" class="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 text-xs font-extrabold">Cancel</button>
                <button type="submit" class="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-500/20">
                    Submit Report
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function openReportModal() {
    document.getElementById('report-modal').classList.remove('hidden');
}
function closeReportModal() {
    document.getElementById('report-modal').classList.add('hidden');
}
</script>

<!-- Countdown Timer JavaScript -->
<?php if ($calc_status === 'UPCOMING'): ?>
<script>
    const targetTimestamp = <?= $eventTimestamp ?> * 1000;
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetTimestamp - now;

        if (difference <= 0) {
            document.getElementById('countdown-timer').innerHTML = '<div class="col-span-4 text-white font-bold py-2">Event Has Started!</div>';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-mins').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cd-secs').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
</script>
<?php endif; ?>

<!-- Live Group Chat JavaScript -->
<script>
const eventId = <?= $event_id ?>;
const currentUserId = <?= intval($current_user['id'] ?? 0) ?>;

function fetchChatMessages() {
    fetch('<?= $base_url ?>/ajax/get_chat_messages.php?event_id=' + eventId)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'success') {
                const container = document.getElementById('chat-messages-container');
                const countBadge = document.getElementById('chat-message-count');
                const inputWrapper = document.getElementById('chat-input-wrapper');
                
                if (countBadge) countBadge.textContent = data.messages.length + ' Message' + (data.messages.length !== 1 ? 's' : '');
                
                // If chat closed (24 hours after event end), render locked status banner
                if (data.is_chat_closed) {
                    if (inputWrapper) {
                        inputWrapper.innerHTML = `
                            <div class="p-4 rounded-2xl bg-slate-100 text-slate-600 font-extrabold text-xs text-center border border-slate-200/80 shadow-inner">
                                <i class="fas fa-lock text-slate-400 me-2 text-sm"></i> 
                                This Event Group Chat closed 24 hours after the event ended (${data.closure_date_formatted}). Messages are preserved in read-only mode.
                            </div>
                        `;
                    }
                    const livePulse = document.getElementById('chat-live-pulse');
                    if (livePulse) livePulse.innerHTML = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-600">CLOSED</span>';
                }

                if (data.messages.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-8 text-slate-400 text-xs font-semibold">
                            <i class="far fa-comments text-3xl mb-2 text-slate-300 block"></i>
                            No messages in this chat yet. Be the first to start the discussion!
                        </div>
                    `;
                    return;
                }

                let html = '';
                data.messages.forEach(msg => {
                    const isSelf = (currentUserId > 0 && msg.user_id == currentUserId);
                    const isOrg = msg.is_event_organizer;
                    
                    let badgeHtml = '';
                    if (isOrg) {
                        badgeHtml = '<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-700 border border-purple-200 me-1"><i class="fas fa-crown text-amber-500 me-1"></i> Organizer</span>';
                    } else if (msg.is_verified_organizer) {
                        badgeHtml = '<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 me-1"><i class="fas fa-certificate text-emerald-500 me-1"></i> Verified</span>';
                    }

                    const bgClass = isSelf ? 'bg-purple-600 text-white shadow-sm' : (isOrg ? 'bg-purple-50 border border-purple-200 text-slate-900' : 'bg-slate-100 text-slate-900');
                    const textClass = isSelf ? 'text-purple-100' : 'text-slate-500';

                    html += `
                        <div class="flex items-start space-x-2.5 ${isSelf ? 'flex-row-reverse space-x-reverse' : ''}">
                            <div class="w-8 h-8 rounded-full ${isOrg ? 'bg-gradient-to-tr from-purple-600 to-pink-500' : 'bg-slate-800'} text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
                                ${msg.display_name.substring(0, 1).toUpperCase()}
                            </div>
                            <div class="max-w-[80%]">
                                <div class="flex items-center space-x-1 mb-1 ${isSelf ? 'justify-end' : ''}">
                                    <span class="text-[11px] font-black ${isSelf ? 'text-purple-700' : 'text-slate-900'}">${escapeHtml(msg.display_name)}</span>
                                    ${badgeHtml}
                                    <span class="text-[9px] text-slate-400 font-semibold me-1">${msg.created_at_formatted}</span>
                                </div>
                                <div class="p-3 rounded-2xl ${bgClass} text-xs font-semibold leading-relaxed whitespace-pre-line">
                                    ${msg.message}
                                </div>
                            </div>
                        </div>
                    `;
                });

                const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 50;
                container.innerHTML = html;
                if (isScrolledToBottom) {
                    container.scrollTop = container.scrollHeight;
                }
            }
        });
}

function sendChatMessage(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input-text');
    const btn = document.getElementById('btn-send-chat');
    const msg = input.value.trim();

    if (!msg) return;

    btn.disabled = true;
    btn.classList.add('opacity-50');

    fetch('<?= $base_url ?>/ajax/send_chat_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'event_id=' + eventId + '&message=' + encodeURIComponent(msg)
    })
    .then(r => r.json())
    .then(data => {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        if (data.status === 'success') {
            input.value = '';
            fetchChatMessages();
        } else {
            alert(data.message || 'Failed to send message.');
        }
    })
    .catch(err => {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        alert('Connection error sending chat message.');
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

fetchChatMessages();
setInterval(fetchChatMessages, 5000);
</script>

<!-- Interactive Concert Survival Checklist JavaScript -->
<script>
function updateChecklistProgress() {
    const items = document.querySelectorAll('.chk-item');
    let checkedCount = 0;
    
    items.forEach(item => {
        const id = item.getAttribute('data-id');
        if (item.checked) {
            checkedCount++;
            localStorage.setItem(id, '1');
        } else {
            localStorage.removeItem(id);
        }
    });

    const total = items.length;
    const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

    const label = document.getElementById('checklist-count-label');
    const progressBar = document.getElementById('checklist-progress-bar');

    if (label) label.textContent = `${checkedCount} / ${total} Items Prepared (${percentage}%)`;
    if (progressBar) progressBar.style.width = `${percentage}%`;
}

function toggleInterest(eventId, btn) {
    const formData = new FormData();
    formData.append('action', 'toggle_interest');
    formData.append('event_id', eventId);

    fetch('<?= $base_url ?>/ajax/buddy_actions.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = '<?= $base_url ?>/login.php';
            return;
        }
        if (data.success) {
            if (data.is_interested) {
                btn.className = 'px-5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white';
                btn.innerHTML = `<i class="fas fa-heart me-2 text-white"></i> <span id="interest_btn_text">I'm Interested ✓</span> <span id="interest_count_badge" class="ms-2 px-2 py-0.5 rounded-full text-[10px] bg-white/30 text-white font-bold">${data.count}</span>`;
            } else {
                btn.className = 'px-5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center cursor-pointer bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200';
                btn.innerHTML = `<i class="fas fa-heart me-2 text-pink-500"></i> <span id="interest_btn_text">I'm Interested</span> <span id="interest_count_badge" class="ms-2 px-2 py-0.5 rounded-full text-[10px] bg-pink-200 text-pink-800 font-bold">${data.count}</span>`;
            }
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.error('Error toggling interest:', err);
        alert('Could not update interest state. Please try again.');
    });
}

function loadChecklistState() {
    const items = document.querySelectorAll('.chk-item');
    items.forEach(item => {
        const id = item.getAttribute('data-id');
        if (localStorage.getItem(id) === '1') {
            item.checked = true;
        }
    });
    updateChecklistProgress();
}

document.addEventListener('DOMContentLoaded', loadChecklistState);
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
