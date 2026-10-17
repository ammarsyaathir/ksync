<?php
// organizer/submit-update.php - Submit Event Update & Notify Saved Fans

$page_title = "Publish Event Update | K-Sync Malaysia";
require_once __DIR__ . '/../includes/header.php';
require_role('organizer');

$event_id = intval($_GET['event_id'] ?? 0);
if (!$event_id) {
    header("Location: {$base_url}/organizer/my-events.php");
    exit;
}

// Verify event ownership
$stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
$stmt->execute([$event_id]);
$event = $stmt->fetch();

if (!$event || ($current_user['role_name'] !== 'Admin' && $event['organizer_id'] != $current_user['id'])) {
    $_SESSION['flash_error'] = "Access denied or event not found.";
    header("Location: {$base_url}/organizer/my-events.php");
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $update_title = trim($_POST['update_title'] ?? '');
    $update_type = trim($_POST['update_type'] ?? 'General Announcement');
    $update_description = trim($_POST['update_description'] ?? '');

    if (empty($update_title) || empty($update_description)) {
        $error = "Update title and description are required.";
    } else {
        // Insert Update
        $ins = $pdo->prepare("INSERT INTO event_updates (event_id, created_by, update_title, update_description, update_type) VALUES (?, ?, ?, ?, ?)");
        $ins->execute([$event_id, $current_user['id'], $update_title, $update_description, $update_type]);
        $update_id = $pdo->lastInsertId();

        // If update type is Postponement or Cancellation, auto-update event status
        if ($update_type === 'Postponement') {
            $pdo->prepare("UPDATE events SET event_status = 'POSTPONED' WHERE id = ?")->execute([$event_id]);
        } elseif ($update_type === 'Cancellation') {
            $pdo->prepare("UPDATE events SET event_status = 'CANCELLED' WHERE id = ?")->execute([$event_id]);
        }

        // TRIGGER NOTIFICATIONS FOR ALL FANS WHO SAVED THIS EVENT
        trigger_event_update_notifications($event_id, $update_id, $update_title);

        log_activity($current_user['id'], 'SUBMIT_UPDATE', 'event_updates', $update_id, "Organizer published update '{$update_title}' for event #{$event_id}");

        set_flash_message('success', "Event update published! Notifications sent to fans who saved this event.");
        header("Location: {$base_url}/event-details.php?id={$event_id}");
        exit;
    }
}
?>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                <i class="fas fa-bullhorn me-1.5 text-pink-500"></i> Event Announcement Hub
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            Publish Event Update
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">For Event: <strong class="text-purple-700 font-semibold"><?= htmlspecialchars($event['event_name']) ?></strong></p>
    </div>

    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
        <?php if ($error): ?>
            <div class="p-3.5 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center">
                <i class="fas fa-triangle-exclamation me-2 text-rose-500"></i> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-tags me-1 text-purple-500"></i> Update Type *</label>
                <select name="update_type" required class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="General Announcement">General Announcement</option>
                    <option value="Venue Change">Venue Change</option>
                    <option value="Date Change">Date Change</option>
                    <option value="Time Change">Time Change</option>
                    <option value="Postponement">Postponement</option>
                    <option value="Cancellation">Cancellation</option>
                </select>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-heading me-1 text-pink-500"></i> Update Title *</label>
                <input type="text" name="update_title" required placeholder="e.g. VIP Soundcheck Schedule Released"
                       class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-align-left me-1 text-indigo-500"></i> Update Details / Description *</label>
                <textarea name="update_description" rows="5" required placeholder="Describe the update details for fans..."
                          class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"></textarea>
            </div>

            <div class="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-800 space-y-1">
                <p class="font-bold flex items-center text-purple-900"><i class="fas fa-bell me-1.5 text-pink-500"></i> Automated Notification Warning:</p>
                <p class="font-medium">Publishing this update will automatically generate an in-system notification for all fans who saved this event.</p>
            </div>

            <div class="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <a href="<?= $base_url ?>/organizer/my-events.php" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all">Cancel</a>
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all">
                    <i class="fas fa-paper-plane me-1"></i> Publish & Notify Fans
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
