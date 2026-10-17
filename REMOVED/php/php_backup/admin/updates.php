<?php
// admin/updates.php - Event Updates Overview & Management

$page_title = "Manage Event Updates | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

// Handle Delete Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action_delete'])) {
    $upd_id = intval($_POST['update_id'] ?? 0);
    if ($upd_id) {
        $pdo->prepare("DELETE FROM event_updates WHERE id = ?")->execute([$upd_id]);
        log_activity($current_user['id'], 'DELETE_UPDATE', 'event_updates', $upd_id, 'Admin deleted update');
        set_flash_message('info', 'Event update removed.');
        header("Location: {$base_url}/admin/updates.php");
        exit;
    }
}

// Fetch all event updates
$updates = $pdo->query("
    SELECT eu.*, e.event_name, u.full_name as author_name
    FROM event_updates eu
    JOIN events e ON eu.event_id = e.id
    LEFT JOIN users u ON eu.created_by = u.id
    ORDER BY eu.created_at DESC
")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                <i class="fas fa-bullhorn me-1.5 text-pink-500"></i> Event Announcements
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            Event Updates Overview
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Monitor all announcements, venue changes, and postponement updates published by organizers.</p>
    </div>

    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <?php if (empty($updates)): ?>
            <p class="text-xs text-slate-500 font-medium text-center py-6">No event updates recorded in system.</p>
        <?php else: ?>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs text-slate-700">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                        <tr>
                            <th class="p-3.5"><i class="fas fa-heading me-1.5 text-pink-500"></i> Update Title</th>
                            <th class="p-3.5"><i class="far fa-calendar-alt me-1.5 text-purple-500"></i> Associated Event</th>
                            <th class="p-3.5"><i class="fas fa-tag me-1.5 text-indigo-500"></i> Update Type</th>
                            <th class="p-3.5"><i class="fas fa-user-pen me-1.5 text-blue-500"></i> Posted By</th>
                            <th class="p-3.5"><i class="far fa-clock me-1.5 text-slate-500"></i> Posted Date</th>
                            <th class="p-3.5 text-right"><i class="fas fa-sliders me-1.5 text-slate-500"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($updates as $upd): ?>
                            <tr class="hover:bg-pink-50/30 transition-colors">
                                <td class="p-3.5 font-bold text-slate-900"><?= htmlspecialchars($upd['update_title']) ?></td>
                                <td class="p-3.5 font-bold text-purple-700"><?= htmlspecialchars($upd['event_name']) ?></td>
                                <td class="p-3.5">
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-pink-100 text-pink-700 border border-pink-200">
                                        <?= htmlspecialchars($upd['update_type']) ?>
                                    </span>
                                </td>
                                <td class="p-3.5 font-medium text-slate-800"><?= htmlspecialchars($upd['author_name'] ?? 'Organizer') ?></td>
                                <td class="p-3.5 text-slate-500 font-medium"><?= date('d M Y, H:i', strtotime($upd['created_at'])) ?></td>
                                <td class="p-3.5 text-right">
                                    <form method="POST" action="" class="inline" onsubmit="return confirm('Delete update?');">
                                        <input type="hidden" name="update_id" value="<?= $upd['id'] ?>">
                                        <input type="hidden" name="action_delete" value="1">
                                        <button type="submit" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 inline-flex items-center justify-center transition-colors" title="Delete Update">
                                            <i class="fas fa-trash-can text-xs"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
