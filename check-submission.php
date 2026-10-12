<?php
// check-submission.php - Public Event Submission Status Tracker, Timeline & Resubmission Portal (UC21, UC22, UC23, UC57)
ob_start();

require_once __DIR__ . '/config/auth.php';
require_once __DIR__ . '/includes/functions.php';

$base_url = (strpos($_SERVER['REQUEST_URI'], '/ksync_malaysia') !== false) ? '/ksync_malaysia' : '';
$current_user = get_current_user_data();

$query_code = trim($_GET['code'] ?? '');
$query_email = trim($_GET['email'] ?? '');
$event = null;
$multiple_events = [];
$resubmit_success = false;

// Handle Correction & Resubmission POST Action (UC23: Correct and Resubmit Event)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'resubmit_event') {
    $event_id = intval($_POST['event_id'] ?? 0);
    $tracking_code = trim($_POST['tracking_code'] ?? '');
    
    // Fetch event to verify tracking code match
    $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ? AND tracking_code = ?");
    $stmt->execute([$event_id, $tracking_code]);
    $ev = $stmt->fetch();

    if ($ev && $ev['verification_status'] === 'REJECTED') {
        $event_name = trim($_POST['event_name'] ?? $ev['event_name']);
        $event_date = trim($_POST['event_date'] ?? $ev['event_date']);
        $start_time = trim($_POST['start_time'] ?? $ev['start_time']);
        $end_time = trim($_POST['end_time'] ?? $ev['end_time']);
        $venue_name = trim($_POST['venue_name'] ?? $ev['venue_name']);
        $address = trim($_POST['address'] ?? $ev['address']);
        $city = trim($_POST['city'] ?? $ev['city']);
        $state = trim($_POST['state'] ?? $ev['state']);
        $ticket_info = trim($_POST['ticket_info'] ?? $ev['ticket_info']);
        $official_url = trim($_POST['official_url'] ?? $ev['official_url']);
        $poster_image = trim($_POST['poster_image'] ?? $ev['poster_image']);
        $description = trim($_POST['description'] ?? $ev['description']);

        $updateStmt = $pdo->prepare("UPDATE events SET 
            event_name = ?, event_date = ?, start_time = ?, end_time = ?,
            venue_name = ?, address = ?, city = ?, state = ?,
            ticket_info = ?, official_url = ?, poster_image = ?, description = ?,
            verification_status = 'PENDING',
            rejection_reason = NULL,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $updateStmt->execute([
            $event_name, $event_date, $start_time, $end_time ?: null,
            $venue_name, $address, $city, $state,
            $ticket_info, $official_url, $poster_image, $description,
            $event_id
        ]);

        log_activity($ev['organizer_id'], 'RESUBMIT_EVENT', 'events', $event_id, "Event '{$event_name}' [Ref: {$tracking_code}] corrected and resubmitted by organizer");
        set_flash_message('success', "Event '{$event_name}' updated and resubmitted for admin review! Verification status reset to PENDING.");
        header("Location: {$base_url}/check-submission.php?code=" . urlencode($tracking_code));
        exit;
    }
}

// Search by Code or Email (UC21)
if (!empty($query_code)) {
    $stmt = $pdo->prepare("
        SELECT e.*, a.name as artist_name, c.name as category_name
        FROM events e
        LEFT JOIN artists a ON e.artist_id = a.id
        LEFT JOIN event_categories c ON e.category_id = c.id
        WHERE UPPER(e.tracking_code) = UPPER(?)
    ");
    $stmt->execute([$query_code]);
    $event = $stmt->fetch();
} elseif (!empty($query_email)) {
    $stmt = $pdo->prepare("
        SELECT e.*, a.name as artist_name, c.name as category_name
        FROM events e
        LEFT JOIN artists a ON e.artist_id = a.id
        LEFT JOIN event_categories c ON e.category_id = c.id
        WHERE LOWER(e.submitter_email) = LOWER(?)
        ORDER BY e.created_at DESC
    ");
    $stmt->execute([$query_email]);
    $multiple_events = $stmt->fetchAll();
    if (count($multiple_events) === 1) {
        $event = $multiple_events[0];
        $multiple_events = [];
    }
}

$page_title = "Track Event Submission | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                <i class="fas fa-barcode me-1.5 text-pink-500"></i> Model 2: Organizer Status Portal (UC21)
            </span>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            Track Event Submission
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">
            Check the verification status of your event submission, review administrator feedback, or correct and resubmit rejected entries.
        </p>
    </div>

    <!-- Search / Lookup Box -->
    <div class="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm mb-8 bg-white/95">
        <form method="GET" action="" class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-grow">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <i class="fas fa-magnifying-glass"></i>
                </span>
                <input type="text" name="code" value="<?= htmlspecialchars($query_code) ?>"
                       placeholder="Enter Tracking Reference Code (e.g. KS-2026-5DC99)"
                       class="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase tracking-wider">
            </div>
            <button type="submit" class="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-pink-500/25 transition-all shrink-0">
                Check Status
            </button>
        </form>

        <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
            <div>
                <i class="fas fa-envelope me-1 text-slate-400"></i> Don't have your reference code? 
                <a href="?email=<?= urlencode($current_user['email'] ?? 'organizer@ksync.my') ?>" class="text-pink-600 hover:underline font-bold">Look up by Submitter Email</a>
            </div>
            <span class="text-[11px] text-slate-400 font-medium">Model 2: No account login required</span>
        </div>
    </div>

    <?php if ($event): ?>
        <!-- SINGLE EVENT STATUS VIEW -->
        <div class="space-y-6">
            <!-- Status Result Header Card -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm bg-white/95 relative overflow-hidden">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                            <i class="fas fa-hashtag text-pink-500 me-1.5"></i> Reference: <span class="font-mono text-slate-900 ms-1 font-black"><?= htmlspecialchars($event['tracking_code']) ?></span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 mt-1">
                            <?= htmlspecialchars($event['event_name']) ?>
                        </h2>
                        <div class="text-xs text-slate-500 font-semibold mt-1 flex items-center space-x-3">
                            <span><i class="far fa-calendar me-1"></i> Submitted: <?= date('d M Y, h:i A', strtotime($event['created_at'])) ?></span>
                            <span>•</span>
                            <span><i class="fas fa-user me-1"></i> <?= htmlspecialchars($event['submitter_name'] ?? 'Organizer') ?></span>
                        </div>
                    </div>

                    <!-- Current Status Badge -->
                    <div class="shrink-0">
                        <?php if ($event['verification_status'] === 'VERIFIED'): ?>
                            <div class="px-5 py-2.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs flex items-center shadow-sm">
                                <i class="fas fa-circle-check text-emerald-600 text-sm me-2"></i> Approved & Published Live
                            </div>
                        <?php elseif ($event['verification_status'] === 'REJECTED'): ?>
                            <div class="px-5 py-2.5 rounded-2xl bg-rose-100 text-rose-800 border border-rose-300 font-black text-xs flex items-center shadow-sm">
                                <i class="fas fa-circle-xmark text-rose-600 text-sm me-2"></i> Needs Correction / Rejected
                            </div>
                        <?php else: ?>
                            <div class="px-5 py-2.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs flex items-center shadow-sm">
                                <i class="fas fa-clock text-amber-600 text-sm me-2 animate-pulse"></i> Pending Admin Verification
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Submission Status Timeline (UC57) -->
                <div class="mt-8 pt-6 border-t border-slate-100">
                    <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-6 flex items-center">
                        <i class="fas fa-timeline text-pink-500 me-2"></i> Status Milestone Timeline (UC57)
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <!-- Step 1: Received -->
                        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center text-xs font-bold mb-2">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="text-xs font-black text-emerald-900">1. Submitted</div>
                            <div class="text-[10px] text-emerald-700 font-semibold mt-0.5">Code Assigned</div>
                            <div class="text-[9px] text-emerald-600 mt-1"><?= date('d M, H:i', strtotime($event['created_at'])) ?></div>
                        </div>

                        <!-- Step 2: Queue & Review -->
                        <div class="p-4 rounded-2xl <?= $event['verification_status'] !== 'PENDING' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-300 ring-2 ring-amber-400/50' ?> text-center">
                            <div class="w-8 h-8 rounded-full <?= $event['verification_status'] !== 'PENDING' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white animate-pulse' ?> mx-auto flex items-center justify-center text-xs font-bold mb-2">
                                <i class="fas <?= $event['verification_status'] !== 'PENDING' ? 'fa-check' : 'fa-hourglass-half' ?>"></i>
                            </div>
                            <div class="text-xs font-black <?= $event['verification_status'] !== 'PENDING' ? 'text-emerald-900' : 'text-amber-900' ?>">2. In Review</div>
                            <div class="text-[10px] <?= $event['verification_status'] !== 'PENDING' ? 'text-emerald-700' : 'text-amber-700' ?> font-semibold mt-0.5">Admin Queue</div>
                        </div>

                        <!-- Step 3: Evidence Check -->
                        <div class="p-4 rounded-2xl <?= $event['verification_status'] === 'VERIFIED' ? 'bg-emerald-50 border border-emerald-200' : ($event['verification_status'] === 'REJECTED' ? 'bg-rose-50 border border-rose-200' : 'bg-slate-100 border border-slate-200 opacity-60') ?> text-center">
                            <div class="w-8 h-8 rounded-full <?= $event['verification_status'] === 'VERIFIED' ? 'bg-emerald-600 text-white' : ($event['verification_status'] === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-700') ?> mx-auto flex items-center justify-center text-xs font-bold mb-2">
                                <i class="fas <?= $event['verification_status'] === 'VERIFIED' ? 'fa-check' : ($event['verification_status'] === 'REJECTED' ? 'fa-triangle-exclamation' : 'fa-magnifying-glass') ?>"></i>
                            </div>
                            <div class="text-xs font-black <?= $event['verification_status'] === 'VERIFIED' ? 'text-emerald-900' : ($event['verification_status'] === 'REJECTED' ? 'text-rose-900' : 'text-slate-700') ?>">3. Evidence Check</div>
                            <div class="text-[10px] <?= $event['verification_status'] === 'VERIFIED' ? 'text-emerald-700' : ($event['verification_status'] === 'REJECTED' ? 'text-rose-700' : 'text-slate-500') ?> font-semibold mt-0.5">Source & Links</div>
                        </div>

                        <!-- Step 4: Final Decision -->
                        <div class="p-4 rounded-2xl <?= $event['verification_status'] === 'VERIFIED' ? 'bg-emerald-50 border border-emerald-200 ring-2 ring-emerald-400/50' : ($event['verification_status'] === 'REJECTED' ? 'bg-rose-50 border border-rose-200 ring-2 ring-rose-400/50' : 'bg-slate-100 border border-slate-200 opacity-60') ?> text-center">
                            <div class="w-8 h-8 rounded-full <?= $event['verification_status'] === 'VERIFIED' ? 'bg-emerald-600 text-white' : ($event['verification_status'] === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-700') ?> mx-auto flex items-center justify-center text-xs font-bold mb-2">
                                <i class="fas <?= $event['verification_status'] === 'VERIFIED' ? 'fa-globe' : ($event['verification_status'] === 'REJECTED' ? 'fa-xmark' : 'fa-flag') ?>"></i>
                            </div>
                            <div class="text-xs font-black <?= $event['verification_status'] === 'VERIFIED' ? 'text-emerald-900' : ($event['verification_status'] === 'REJECTED' ? 'text-rose-900' : 'text-slate-700') ?>">4. Decision (UC22)</div>
                            <div class="text-[10px] <?= $event['verification_status'] === 'VERIFIED' ? 'text-emerald-700' : ($event['verification_status'] === 'REJECTED' ? 'text-rose-700' : 'text-slate-500') ?> font-semibold mt-0.5">
                                <?= $event['verification_status'] === 'VERIFIED' ? 'Published Live' : ($event['verification_status'] === 'REJECTED' ? 'Action Required' : 'Awaiting') ?>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Admin Rejection Feedback Box (UC22) -->
                <?php if ($event['verification_status'] === 'REJECTED'): ?>
                    <div class="mt-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-left">
                        <div class="flex items-center space-x-2 text-rose-700 font-black text-xs uppercase tracking-wider mb-2">
                            <i class="fas fa-triangle-exclamation text-rose-600 text-sm"></i>
                            <span>Admin Verification Feedback & Reason (UC22)</span>
                        </div>
                        <p class="text-xs font-bold leading-relaxed bg-white/70 p-3.5 rounded-xl border border-rose-200 text-rose-950 font-mono">
                            <?= nl2br(htmlspecialchars($event['rejection_reason'] ?: 'Please update official ticketing or announcement URL to verify event authenticity.')) ?>
                        </p>
                        <p class="text-[11px] text-rose-700 mt-2 font-medium">
                            <i class="fas fa-arrow-turn-down me-1"></i> You can modify the details below and resubmit directly for immediate re-evaluation (UC23).
                        </p>
                    </div>
                <?php elseif ($event['verification_status'] === 'VERIFIED'): ?>
                    <div class="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                        <div>
                            <span class="font-black text-xs uppercase text-emerald-800 tracking-wider flex items-center">
                                <i class="fas fa-circle-check text-emerald-600 me-2"></i> Event is Published Live
                            </span>
                            <p class="text-xs text-emerald-700 font-medium mt-0.5">
                                Fans can now discover, bookmark, and chat about this event on the public platform.
                            </p>
                        </div>
                        <a href="<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all shrink-0">
                            View Live Event <i class="fas fa-arrow-up-right-from-square ms-1"></i>
                        </a>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Event Details Summary Card -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm bg-white/95">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-6 flex items-center">
                    <i class="fas fa-circle-info text-purple-500 me-2"></i> Submitted Event Information
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-1">
                        <img src="<?= htmlspecialchars($event['poster_image']) ?>" alt="Poster" 
                             class="w-full h-auto max-h-80 object-cover rounded-2xl shadow-md border border-slate-200">
                    </div>

                    <div class="md:col-span-2 space-y-4 text-xs text-slate-700">
                        <div>
                            <span class="font-bold text-slate-400 uppercase text-[10px]">Event Name</span>
                            <div class="text-base font-black text-slate-900"><?= htmlspecialchars($event['event_name']) ?></div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="font-bold text-slate-400 uppercase text-[10px]">Category</span>
                                <div class="font-bold text-slate-800"><?= htmlspecialchars($event['category_name'] ?? 'K-Pop Event') ?></div>
                            </div>
                            <div>
                                <span class="font-bold text-slate-400 uppercase text-[10px]">Featured Artist</span>
                                <div class="font-bold text-slate-800"><?= htmlspecialchars($event['artist_name'] ?? 'Various Artists') ?></div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="font-bold text-slate-400 uppercase text-[10px]">Date & Time</span>
                                <div class="font-bold text-slate-800">
                                    <?= date('d M Y', strtotime($event['event_date'])) ?> • <?= htmlspecialchars(substr($event['start_time'], 0, 5)) ?>
                                </div>
                            </div>
                            <div>
                                <span class="font-bold text-slate-400 uppercase text-[10px]">Venue</span>
                                <div class="font-bold text-slate-800"><?= htmlspecialchars($event['venue_name']) ?>, <?= htmlspecialchars($event['city']) ?></div>
                            </div>
                        </div>

                        <?php if (!empty($event['official_url'])): ?>
                            <div>
                                <span class="font-bold text-slate-400 uppercase text-[10px]">Official Source / Ticket Link</span>
                                <div>
                                    <a href="<?= htmlspecialchars($event['official_url']) ?>" target="_blank" class="text-pink-600 hover:underline font-bold break-all">
                                        <?= htmlspecialchars($event['official_url']) ?> <i class="fas fa-external-link text-[10px] ms-1"></i>
                                    </a>
                                </div>
                            </div>
                        <?php endif; ?>

                        <?php if (!empty($event['ticket_info'])): ?>
                            <div>
                                <span class="font-bold text-slate-400 uppercase text-[10px]">Ticket Info</span>
                                <div class="font-medium text-slate-800"><?= nl2br(htmlspecialchars($event['ticket_info'])) ?></div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- UC23: CORRECT AND RESUBMIT FORM (Shown when REJECTED) -->
            <?php if ($event['verification_status'] === 'REJECTED'): ?>
                <div class="glass-card p-6 sm:p-8 rounded-3xl border-2 border-pink-400 shadow-xl bg-white/95" id="resubmit-section">
                    <div class="flex items-center space-x-3 mb-6 pb-4 border-b border-pink-100">
                        <div class="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center text-lg shadow-md shadow-pink-500/30">
                            <i class="fas fa-pen-to-square"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-black text-slate-900">
                                Correct and Resubmit Event (UC23)
                            </h3>
                            <p class="text-xs text-slate-600 font-medium">Update the rejected information according to admin feedback and submit for re-review.</p>
                        </div>
                    </div>

                    <form method="POST" action="" class="space-y-5">
                        <input type="hidden" name="action" value="resubmit_event">
                        <input type="hidden" name="event_id" value="<?= $event['id'] ?>">
                        <input type="hidden" name="tracking_code" value="<?= htmlspecialchars($event['tracking_code']) ?>">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-extrabold text-slate-700 mb-1">Event Name *</label>
                                <input type="text" name="event_name" required value="<?= htmlspecialchars($event['event_name']) ?>"
                                       class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            </div>

                            <div>
                                <label class="block text-xs font-extrabold text-slate-700 mb-1">Event Date *</label>
                                <input type="date" name="event_date" required value="<?= htmlspecialchars($event['event_date']) ?>"
                                       class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-extrabold text-slate-700 mb-1">Start Time *</label>
                                <input type="time" name="start_time" required value="<?= htmlspecialchars($event['start_time']) ?>"
                                       class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-extrabold text-slate-700 mb-1">End Time</label>
                                <input type="time" name="end_time" value="<?= htmlspecialchars($event['end_time'] ?? '') ?>"
                                       class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-extrabold text-slate-700 mb-1">City *</label>
                                <input type="text" name="city" required value="<?= htmlspecialchars($event['city']) ?>"
                                       class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-extrabold text-slate-700 mb-1">Venue Name *</label>
                                <input type="text" name="venue_name" required value="<?= htmlspecialchars($event['venue_name']) ?>"
                                       class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-extrabold text-slate-700 mb-1">Venue Address</label>
                                <input type="text" name="address" value="<?= htmlspecialchars($event['address']) ?>"
                                       class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-link text-indigo-500 me-1"></i> Official Source URL * (Evidence)</label>
                            <input type="url" name="official_url" required value="<?= htmlspecialchars($event['official_url'] ?? '') ?>"
                                   placeholder="https://official-source.com"
                                   class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium">
                        </div>

                        <div>
                            <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-image text-pink-500 me-1"></i> Poster Image URL</label>
                            <input type="url" name="poster_image" value="<?= htmlspecialchars($event['poster_image']) ?>"
                                   class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium">
                        </div>

                        <div>
                            <label class="block text-xs font-extrabold text-slate-700 mb-1">Event Description & Changes Made</label>
                            <textarea name="description" rows="3" class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium"><?= htmlspecialchars($event['description'] ?? '') ?></textarea>
                        </div>

                        <div class="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                            <button type="submit" class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm shadow-lg shadow-pink-500/25 transition-all">
                                <i class="fas fa-rotate me-2"></i> Resubmit for Admin Verification (UC23)
                            </button>
                        </div>
                    </form>
                </div>
            <?php endif; ?>
        </div>

    <?php elseif (!empty($multiple_events)): ?>
        <!-- MULTIPLE SUBMISSIONS LIST (SEARCH BY EMAIL) -->
        <div class="space-y-4">
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-wider mb-2">
                Found <?= count($multiple_events) ?> Submissions for <?= htmlspecialchars($query_email) ?>
            </h3>

            <?php foreach ($multiple_events as $ev): ?>
                <div class="glass-card p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/95 hover:border-pink-300 transition-all">
                    <div class="flex items-center space-x-4">
                        <img src="<?= htmlspecialchars($ev['poster_image']) ?>" alt="Poster" class="w-14 h-18 object-cover rounded-xl border border-slate-200">
                        <div>
                            <span class="font-mono text-xs font-black text-pink-600 uppercase"><?= htmlspecialchars($ev['tracking_code']) ?></span>
                            <h4 class="text-base font-black text-slate-900"><?= htmlspecialchars($ev['event_name']) ?></h4>
                            <div class="text-xs text-slate-500 font-semibold">
                                <?= date('d M Y', strtotime($ev['event_date'])) ?> • <?= htmlspecialchars($ev['venue_name']) ?>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center space-x-3 shrink-0">
                        <?php if ($ev['verification_status'] === 'VERIFIED'): ?>
                            <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">VERIFIED</span>
                        <?php elseif ($ev['verification_status'] === 'REJECTED'): ?>
                            <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">REJECTED</span>
                        <?php else: ?>
                            <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">PENDING</span>
                        <?php endif; ?>

                        <a href="?code=<?= urlencode($ev['tracking_code']) ?>" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs">
                            View Details <i class="fas fa-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

    <?php elseif (!empty($query_code) || !empty($query_email)): ?>
        <!-- NOT FOUND STATE -->
        <div class="glass-card p-8 rounded-3xl border border-rose-200 text-center bg-white/95">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mb-4">
                <i class="fas fa-triangle-exclamation"></i>
            </div>
            <h3 class="text-lg font-black text-slate-900">No Submission Found</h3>
            <p class="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                We could not find any event submission matching <span class="font-mono font-bold text-slate-900"><?= htmlspecialchars($query_code ?: $query_email) ?></span>. Please double check the code from your confirmation screen.
            </p>
            <div class="mt-6">
                <a href="<?= $base_url ?>/submit-event.php" class="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs shadow-md">
                    Submit a New Event
                </a>
            </div>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
