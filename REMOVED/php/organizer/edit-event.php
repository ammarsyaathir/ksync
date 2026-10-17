<?php
// organizer/edit-event.php - Edit Organizer Event

$page_title = "Edit Event | K-Sync Malaysia";
require_once __DIR__ . '/../includes/header.php';
require_role('organizer');

$event_id = intval($_GET['id'] ?? 0);
if (!$event_id) {
    header("Location: {$base_url}/organizer/my-events.php");
    exit;
}

// Fetch event & verify ownership (rule 4 & 18: organizers can ONLY edit events they submitted)
$stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
$stmt->execute([$event_id]);
$event = $stmt->fetch();

if (!$event) {
    $_SESSION['flash_error'] = "Event not found.";
    header("Location: {$base_url}/organizer/my-events.php");
    exit;
}

// Check ownership unless admin
if ($current_user['role_name'] !== 'Admin' && $event['organizer_id'] != $current_user['id']) {
    $_SESSION['flash_error'] = "Access denied. You can only edit events you submitted.";
    header("Location: {$base_url}/organizer/my-events.php");
    exit;
}

$error = '';
$artists = $pdo->query("SELECT * FROM artists ORDER BY name ASC")->fetchAll();
$categories = $pdo->query("SELECT * FROM event_categories ORDER BY name ASC")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_name = trim($_POST['event_name'] ?? '');
    $artist_id = intval($_POST['artist_id'] ?? 0);
    $category_id = intval($_POST['category_id'] ?? 0);
    $event_date = trim($_POST['event_date'] ?? '');
    $start_time = trim($_POST['start_time'] ?? '');
    $end_time = trim($_POST['end_time'] ?? '');
    $venue_name = trim($_POST['venue_name'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $state = trim($_POST['state'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $ticket_info = trim($_POST['ticket_info'] ?? '');
    $event_rules = trim($_POST['event_rules'] ?? '');
    $official_url = trim($_POST['official_url'] ?? '');
    $poster_image = trim($_POST['poster_image'] ?? '');
    $event_status = trim($_POST['event_status'] ?? 'UPCOMING');

    if (empty($event_name) || empty($category_id) || empty($event_date) || empty($start_time) || empty($venue_name) || empty($city)) {
        $error = "Please fill in all required fields.";
    } else {
        $upd = $pdo->prepare("UPDATE events SET 
            artist_id = ?, category_id = ?, event_name = ?, description = ?,
            event_date = ?, start_time = ?, end_time = ?, venue_name = ?, address = ?,
            city = ?, state = ?, ticket_info = ?, event_rules = ?, official_url = ?,
            poster_image = ?, event_status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?");
            
        $upd->execute([
            $artist_id ?: null,
            $category_id,
            $event_name,
            $description,
            $event_date,
            $start_time,
            $end_time ?: null,
            $venue_name,
            $address,
            $city,
            $state,
            $ticket_info,
            $event_rules,
            $official_url,
            $poster_image,
            $event_status,
            $event_id
        ]);

        // Record immutable audit history for critical field changes
        record_event_change($event_id, $current_user['id'], 'Event Date', $event['event_date'], $event_date);
        record_event_change($event_id, $current_user['id'], 'Start Time', $event['start_time'], $start_time);
        record_event_change($event_id, $current_user['id'], 'Venue Name', $event['venue_name'], $venue_name);
        record_event_change($event_id, $current_user['id'], 'Event Status', $event['event_status'], $event_status);

        log_activity($current_user['id'], 'EDIT_EVENT', 'events', $event_id, "Organizer edited event '{$event_name}'");
        set_flash_message('success', "Event details updated successfully!");
        header("Location: {$base_url}/organizer/my-events.php");
        exit;
    }
}
?>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                    <i class="fas fa-pen-to-square me-1.5 text-indigo-600"></i> Event Editor
                </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                Edit Event Submission
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Updating: <strong class="text-pink-600 font-semibold"><?= htmlspecialchars($event['event_name']) ?></strong></p>
        </div>
        <a href="<?= $base_url ?>/organizer/my-events.php" class="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center shrink-0 cursor-pointer">
            <i class="fas fa-arrow-left me-2 text-pink-400"></i> Back to My Events
        </a>
    </div>

    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
        <?php if ($error): ?>
            <div class="p-3.5 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center">
                <i class="fas fa-triangle-exclamation me-2 text-rose-500"></i> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="" class="space-y-6">
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-heading me-1 text-pink-500"></i> Event Name *</label>
                    <input type="text" name="event_name" value="<?= htmlspecialchars($event['event_name']) ?>" required
                           class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-user-ninja me-1 text-purple-500"></i> Artist / Group</label>
                        <select name="artist_id" class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                            <option value="">Select Artist</option>
                            <?php foreach ($artists as $a): ?>
                                <option value="<?= $a['id'] ?>" <?= $event['artist_id'] == $a['id'] ? 'selected' : '' ?>><?= htmlspecialchars($a['name']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-tags me-1 text-indigo-500"></i> Category *</label>
                        <select name="category_id" required class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                            <?php foreach ($categories as $c): ?>
                                <option value="<?= $c['id'] ?>" <?= $event['category_id'] == $c['id'] ? 'selected' : '' ?>><?= htmlspecialchars($c['name']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-toggle-on me-1 text-emerald-500"></i> Status Override</label>
                        <select name="event_status" class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                            <option value="UPCOMING" <?= $event['event_status'] == 'UPCOMING' ? 'selected' : '' ?>>UPCOMING</option>
                            <option value="ONGOING" <?= $event['event_status'] == 'ONGOING' ? 'selected' : '' ?>>ONGOING</option>
                            <option value="COMPLETED" <?= $event['event_status'] == 'COMPLETED' ? 'selected' : '' ?>>COMPLETED</option>
                            <option value="POSTPONED" <?= $event['event_status'] == 'POSTPONED' ? 'selected' : '' ?>>POSTPONED</option>
                            <option value="CANCELLED" <?= $event['event_status'] == 'CANCELLED' ? 'selected' : '' ?>>CANCELLED</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="far fa-calendar-alt me-1 text-pink-500"></i> Event Date *</label>
                        <input type="date" name="event_date" value="<?= htmlspecialchars($event['event_date']) ?>" required
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="far fa-clock me-1 text-purple-500"></i> Start Time *</label>
                        <input type="time" name="start_time" value="<?= htmlspecialchars($event['start_time']) ?>" required
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-hourglass-end me-1 text-indigo-500"></i> End Time</label>
                        <input type="time" name="end_time" value="<?= htmlspecialchars($event['end_time'] ?? '') ?>"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-building me-1 text-amber-500"></i> Venue Name *</label>
                        <input type="text" name="venue_name" value="<?= htmlspecialchars($event['venue_name']) ?>" required
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-city me-1 text-cyan-500"></i> City *</label>
                        <input type="text" name="city" value="<?= htmlspecialchars($event['city']) ?>" required
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-location-dot me-1 text-rose-500"></i> Address</label>
                        <input type="text" name="address" value="<?= htmlspecialchars($event['address']) ?>"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-map me-1 text-blue-500"></i> State</label>
                        <input type="text" name="state" value="<?= htmlspecialchars($event['state']) ?>"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-align-left me-1 text-slate-500"></i> Description</label>
                    <textarea name="description" rows="3" class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"><?= htmlspecialchars($event['description'] ?? '') ?></textarea>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-ticket me-1 text-pink-500"></i> Ticket Info</label>
                    <textarea name="ticket_info" rows="2" class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"><?= htmlspecialchars($event['ticket_info'] ?? '') ?></textarea>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-shield-halved me-1 text-purple-500"></i> Event Rules</label>
                    <textarea name="event_rules" rows="2" class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"><?= htmlspecialchars($event['event_rules'] ?? '') ?></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-link me-1 text-indigo-500"></i> Official Source URL</label>
                        <input type="url" name="official_url" value="<?= htmlspecialchars($event['official_url'] ?? '') ?>"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1"><i class="fas fa-image me-1 text-emerald-500"></i> Poster Image URL</label>
                        <input type="url" name="poster_image" value="<?= htmlspecialchars($event['poster_image'] ?? '') ?>"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <a href="<?= $base_url ?>/organizer/my-events.php" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all">Cancel</a>
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all">
                    Update Event Details
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
