<?php
// admin/artists.php - K-Pop Artist & Group Management (Enhanced Design)

$page_title = "Manage Artists | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

// Handle Add / Delete Artist
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action_add'])) {
        $name = trim($_POST['name'] ?? '');
        $group_type = trim($_POST['group_type'] ?? 'Boy Group');
        $agency = trim($_POST['agency'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $image_url = trim($_POST['image_url'] ?? '');

        if (empty($image_url)) {
            $image_url = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop';
        }

        if (!empty($name)) {
            $ins = $pdo->prepare("INSERT INTO artists (name, group_type, image_url, agency, description) VALUES (?, ?, ?, ?, ?)");
            $ins->execute([$name, $group_type, $image_url, $agency, $description]);
            log_activity($current_user['id'], 'ADD_ARTIST', 'artists', $pdo->lastInsertId(), "Admin added artist '{$name}'");
            set_flash_message('success', "Action Completed: Artist '{$name}' added successfully.");
            header("Location: {$base_url}/admin/artists.php");
            exit;
        }
    } elseif (isset($_POST['action_delete'])) {
        $del_id = intval($_POST['artist_id'] ?? 0);
        if ($del_id) {
            $pdo->prepare("DELETE FROM artists WHERE id = ?")->execute([$del_id]);
            log_activity($current_user['id'], 'DELETE_ARTIST', 'artists', $del_id, 'Admin deleted artist');
            set_flash_message('info', 'Action Completed: Artist removed.');
            header("Location: {$base_url}/admin/artists.php");
            exit;
        }
    }
}

$artists = $pdo->query("SELECT * FROM artists ORDER BY name ASC")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                <i class="fas fa-microphone-lines me-1.5 text-pink-500"></i> Artist Registry
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            K-Pop Artist & Group Directory
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Manage artists, boy groups, girl groups, and soloists for event tagging.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Add Artist Form -->
        <div class="lg:col-span-1">
            <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 class="text-base font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center">
                    <i class="fas fa-plus-circle text-pink-500 me-2"></i> Add New Artist / Group
                </h3>

                <form method="POST" action="" class="space-y-4">
                    <input type="hidden" name="action_add" value="1">

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-user me-1 text-pink-500"></i> Artist / Group Name *</label>
                        <input type="text" name="name" required placeholder="e.g. Stray Kids"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-500">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-users-viewfinder me-1 text-purple-500"></i> Group Type</label>
                        <select name="group_type" class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold">
                            <option value="Boy Group">Boy Group</option>
                            <option value="Girl Group">Girl Group</option>
                            <option value="Soloist">Soloist</option>
                            <option value="Co-ed">Co-ed Group</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-building me-1 text-indigo-500"></i> Entertainment Agency</label>
                        <input type="text" name="agency" placeholder="e.g. JYP Entertainment"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-image me-1 text-emerald-500"></i> Image URL</label>
                        <input type="url" name="image_url" placeholder="https://image-url.com/artist.jpg"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-align-left me-1 text-slate-400"></i> Description</label>
                        <textarea name="description" rows="2" placeholder="Brief artist bio..."
                                  class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium"></textarea>
                    </div>

                    <button type="submit" class="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-pink-500/20 transition-all">
                        Save Artist
                    </button>
                </form>
            </div>
        </div>

        <!-- Artists Grid List -->
        <div class="lg:col-span-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <?php foreach ($artists as $art): ?>
                    <div class="glass-card p-5 rounded-3xl border border-slate-200/90 flex items-center space-x-4 shadow-sm hover:border-pink-300 transition-all">
                        <div class="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-pink-300 bg-slate-100 shadow-sm p-0.5">
                            <img src="<?= htmlspecialchars($art['image_url']) ?>" class="w-full h-full object-cover rounded-full">
                        </div>
                        <div class="flex-grow min-w-0">
                            <h4 class="font-black text-slate-900 text-sm truncate"><?= htmlspecialchars($art['name']) ?></h4>
                            <p class="text-[11px] text-pink-600 font-extrabold"><?= htmlspecialchars($art['group_type']) ?></p>
                            <p class="text-[10px] text-slate-500 font-semibold truncate"><i class="fas fa-building me-1 text-slate-400"></i> <?= htmlspecialchars($art['agency'] ?? 'Agency N/A') ?></p>
                        </div>
                        <form method="POST" action="" onsubmit="return confirm('Delete artist?');">
                            <input type="hidden" name="artist_id" value="<?= $art['id'] ?>">
                            <input type="hidden" name="action_delete" value="1">
                            <button type="submit" class="p-2 text-slate-400 hover:text-rose-600 font-bold transition-colors" title="Delete Artist"><i class="fas fa-trash-can"></i></button>
                        </form>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
