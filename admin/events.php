<?php
// admin/events.php - Manage All Events Page (Enhanced Design)

$page_title = "Manage All Events | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

// Actions (delete event)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action_delete'])) {
    $del_id = intval($_POST['event_id'] ?? 0);
    if ($del_id) {
        $pdo->prepare("DELETE FROM events WHERE id = ?")->execute([$del_id]);
        log_activity($current_user['id'], 'DELETE_EVENT', 'events', $del_id, 'Admin deleted event');
        set_flash_message('success', 'Action Completed: Event deleted successfully.');
        header("Location: {$base_url}/admin/events.php");
        exit;
    }
}

// Fetch all events
$events = $pdo->query("
    SELECT e.*, u.full_name as organizer_name, c.name as category_name, a.name as artist_name
    FROM events e
    LEFT JOIN users u ON e.organizer_id = u.id
    LEFT JOIN event_categories c ON e.category_id = c.id
    LEFT JOIN artists a ON e.artist_id = a.id
    ORDER BY e.created_at DESC
")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200/80 gap-4">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                    <i class="fas fa-calendar-days me-1.5 text-pink-500"></i> Event Directory Management
                </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                Manage System Events
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Complete overview of all submitted, pending, and verified events in Malaysia.</p>
        </div>
        <a href="<?= $base_url ?>/organizer/submit-event.php" class="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center shrink-0 cursor-pointer">
            <i class="fas fa-plus-circle me-2 text-pink-400"></i> Add New Event
        </a>
    </div>

    <!-- Table Card -->
    <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700 font-medium">
                <thead class="bg-slate-50 text-slate-900 uppercase font-extrabold border-b border-slate-200">
                    <tr>
                        <th class="p-3"><i class="fas fa-calendar-star me-1 text-pink-500"></i> Event Name</th>
                        <th class="p-3"><i class="fas fa-user me-1 text-indigo-500"></i> Organizer</th>
                        <th class="p-3"><i class="fas fa-microphone-lines me-1 text-purple-500"></i> Artist / Group</th>
                        <th class="p-3"><i class="fas fa-tags me-1 text-emerald-500"></i> Category</th>
                        <th class="p-3"><i class="far fa-calendar-alt me-1 text-slate-400"></i> Event Date</th>
                        <th class="p-3"><i class="fas fa-shield-halved me-1 text-amber-500"></i> Verification</th>
                        <th class="p-3"><i class="fas fa-flag me-1 text-cyan-500"></i> Status</th>
                        <th class="p-3 text-right"><i class="fas fa-gear me-1"></i> Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <?php foreach ($events as $ev): ?>
                        <tr class="hover:bg-slate-50/80 transition-colors">
                            <td class="p-3 font-black text-slate-900 max-w-xs truncate"><?= htmlspecialchars($ev['event_name']) ?></td>
                            <td class="p-3 font-semibold"><?= htmlspecialchars($ev['organizer_name'] ?? 'System Admin') ?></td>
                            <td class="p-3 font-bold text-pink-600"><?= htmlspecialchars($ev['artist_name'] ?? 'Multiple') ?></td>
                            <td class="p-3 font-semibold text-purple-700"><?= htmlspecialchars($ev['category_name'] ?? 'General') ?></td>
                            <td class="p-3 font-semibold"><?= date('d M Y', strtotime($ev['event_date'])) ?></td>
                            <td class="p-3"><?= get_verification_badge($ev['verification_status']) ?></td>
                            <td class="p-3"><?= get_status_badge(get_calculated_event_status($ev)) ?></td>
                            <td class="p-3 text-right space-x-2">
                                <a href="<?= $base_url ?>/event-details.php?id=<?= $ev['id'] ?>" target="_blank" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all inline-flex items-center" title="View Details"><i class="fas fa-eye me-1 text-slate-500"></i> View</a>
                                <a href="<?= $base_url ?>/organizer/edit-event.php?id=<?= $ev['id'] ?>" class="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold transition-all inline-flex items-center" title="Edit Event"><i class="fas fa-pen-to-square me-1 text-cyan-600"></i> Edit</a>
                                <form method="POST" action="" class="inline" onsubmit="return confirm('Are you sure you want to permanently delete this event?');">
                                    <input type="hidden" name="event_id" value="<?= $ev['id'] ?>">
                                    <input type="hidden" name="action_delete" value="1">
                                    <button type="submit" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-all inline-flex items-center" title="Delete Event"><i class="fas fa-trash-can me-1 text-rose-600"></i> Delete</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
