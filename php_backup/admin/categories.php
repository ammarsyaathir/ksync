<?php
// admin/categories.php - Event Category Management (Enhanced Design)

$page_title = "Manage Event Categories | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action_add'])) {
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $slug = strtolower(str_replace(' ', '-', $name));

        if (!empty($name)) {
            $ins = $pdo->prepare("INSERT INTO event_categories (name, slug, description) VALUES (?, ?, ?)");
            $ins->execute([$name, $slug, $description]);
            log_activity($current_user['id'], 'ADD_CATEGORY', 'event_categories', $pdo->lastInsertId(), "Admin added category '{$name}'");
            set_flash_message('success', "Action Completed: Category '{$name}' created.");
            header("Location: {$base_url}/admin/categories.php");
            exit;
        }
    }
}

$categories = $pdo->query("SELECT c.*, COUNT(e.id) as event_count FROM event_categories c LEFT JOIN events e ON c.id = e.category_id GROUP BY c.id ORDER BY c.id ASC")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <i class="fas fa-tags me-1.5 text-emerald-600"></i> Event Categories
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            Event Category Management
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Configure categories (Concert, Fan Meeting, Cupsleeve Event, Pop-up, etc.).</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Add Category Form -->
        <div class="lg:col-span-1">
            <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 class="text-base font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center">
                    <i class="fas fa-plus-circle text-emerald-500 me-2"></i> Add New Category
                </h3>
                <form method="POST" action="" class="space-y-4">
                    <input type="hidden" name="action_add" value="1">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-tag me-1 text-emerald-500"></i> Category Name *</label>
                        <input type="text" name="name" required placeholder="e.g. Fan Sign Event"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-align-left me-1 text-slate-400"></i> Description</label>
                        <textarea name="description" rows="3" placeholder="Category purpose..."
                                  class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all">
                        Add Category
                    </button>
                </form>
            </div>
        </div>

        <!-- Categories Table -->
        <div class="lg:col-span-2">
            <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <table class="w-full text-left text-xs text-slate-700 font-medium">
                    <thead class="bg-slate-50 text-slate-900 uppercase font-extrabold border-b border-slate-200">
                        <tr>
                            <th class="p-3"><i class="fas fa-tag me-1 text-emerald-500"></i> Category</th>
                            <th class="p-3"><i class="fas fa-code me-1 text-purple-500"></i> Slug Identifier</th>
                            <th class="p-3"><i class="fas fa-calendar-days me-1 text-pink-500"></i> Active Events</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($categories as $cat): ?>
                            <tr class="hover:bg-slate-50/80 transition-colors">
                                <td class="p-3 font-black text-slate-900 text-sm"><?= htmlspecialchars($cat['name']) ?></td>
                                <td class="p-3 font-mono text-purple-700 font-bold"><?= htmlspecialchars($cat['slug']) ?></td>
                                <td class="p-3"><span class="px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-black text-[11px]"><?= $cat['event_count'] ?> events</span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
