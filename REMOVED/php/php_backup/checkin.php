<?php
// checkin.php - Signed QR Event Check-in Page for Fans

$page_title = "Event Check-In | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';

$event_id = intval($_GET['event_id'] ?? 0);
$token = trim($_GET['token'] ?? '');

if (!$event_id) {
    echo "<div class='max-w-md mx-auto px-4 py-16 text-center'><h2 class='text-xl font-bold text-rose-600'>Invalid Event Check-In URL</h2></div>";
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

// Fetch Event Details
$stmt = $pdo->prepare("SELECT e.*, a.name as artist_name FROM events e LEFT JOIN artists a ON e.artist_id = a.id WHERE e.id = ?");
$stmt->execute([$event_id]);
$event = $stmt->fetch();

if (!$event) {
    echo "<div class='max-w-md mx-auto px-4 py-16 text-center'><h2 class='text-xl font-bold text-rose-600'>Event Not Found</h2></div>";
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

$checkin_status = null;
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_logged_in()) {
    $success = record_event_checkin($event_id, $_SESSION['user_id']);
    if ($success) {
        $checkin_status = 'success';
        $message = "You have successfully checked in to " . htmlspecialchars($event['event_name']) . "!";
        log_activity($_SESSION['user_id'], 'EVENT_CHECKIN', 'events', $event_id, "User checked in to event #{$event_id}");
    } else {
        $checkin_status = 'info';
        $message = "You are already checked in to this event!";
    }
}
?>

<div class="max-w-lg mx-auto px-4 py-12">
    <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-pink-500/30">
            <i class="fas fa-qrcode"></i>
        </div>

        <h1 class="text-2xl font-black text-slate-900 mb-1">Event Check-In</h1>
        <p class="text-xs font-bold text-pink-600 uppercase tracking-wider mb-6"><?= htmlspecialchars($event['artist_name'] ?? 'K-Pop Event') ?></p>

        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6 text-left">
            <h2 class="font-bold text-slate-800 text-sm mb-1"><?= htmlspecialchars($event['event_name']) ?></h2>
            <p class="text-xs text-slate-500 mb-2"><i class="fas fa-location-dot text-pink-500 me-1"></i> <?= htmlspecialchars($event['venue_name']) ?>, <?= htmlspecialchars($event['city']) ?></p>
            <p class="text-xs text-slate-500"><i class="fas fa-calendar-day text-purple-500 me-1"></i> <?= date('M d, Y', strtotime($event['event_date'])) ?></p>
        </div>

        <?php if ($checkin_status === 'success'): ?>
            <div class="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
                <i class="fas fa-circle-check text-emerald-500 text-lg me-1.5 align-middle"></i> <?= $message ?>
            </div>
        <?php elseif ($checkin_status === 'info'): ?>
            <div class="p-4 mb-6 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold shadow-sm">
                <i class="fas fa-info-circle text-cyan-500 text-lg me-1.5 align-middle"></i> <?= $message ?>
            </div>
        <?php endif; ?>

        <?php if (!is_logged_in()): ?>
            <div class="p-4 mb-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-left">
                <i class="fas fa-triangle-exclamation text-amber-500 me-1"></i> Please log in to your K-Sync account to confirm your event check-in.
            </div>
            <a href="<?= $base_url ?>/login.php" class="w-full inline-block py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-md">
                Log In to Check In
            </a>
        <?php else: ?>
            <form method="POST" action="">
                <button type="submit" class="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-pink-500/25 transition-all transform active:scale-95">
                    <i class="fas fa-check-circle me-2"></i> Confirm My Attendance Check-In
                </button>
            </form>
        <?php endif; ?>

        <div class="mt-6 pt-4 border-t border-slate-100">
            <a href="<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>" class="text-xs text-slate-500 font-bold hover:text-pink-600">
                &larr; Return to Event Details
            </a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
