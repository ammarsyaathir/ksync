<?php
// admin/venues.php - Malaysian Venue Directory Management (Enhanced Design)

$page_title = "Manage Venues | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action_add'])) {
        $name = trim($_POST['name'] ?? '');
        $address = trim($_POST['address'] ?? '');
        $city = trim($_POST['city'] ?? '');
        $state = trim($_POST['state'] ?? '');
        $map_link = trim($_POST['map_link'] ?? '');
        $capacity = intval($_POST['capacity'] ?? 0);

        if (!empty($name) && !empty($city)) {
            $ins = $pdo->prepare("INSERT INTO venues (name, address, city, state, map_link, capacity) VALUES (?, ?, ?, ?, ?, ?)");
            $ins->execute([$name, $address, $city, $state, $map_link, $capacity]);
            log_activity($current_user['id'], 'ADD_VENUE', 'venues', $pdo->lastInsertId(), "Admin added venue '{$name}'");
            set_flash_message('success', "Action Completed: Venue '{$name}' created.");
            header("Location: {$base_url}/admin/venues.php");
            exit;
        }
    }
}

$venues = $pdo->query("SELECT v.*, COUNT(e.id) as event_count FROM venues v LEFT JOIN events e ON v.id = e.venue_id GROUP BY v.id ORDER BY v.name ASC")->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                <i class="fas fa-location-dot me-1.5 text-rose-500"></i> Venue Directory
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            Malaysian Venue Directory
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Manage venues, arenas, stadiums, and cafe locations across Malaysia.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Add Venue Form -->
        <div class="lg:col-span-1">
            <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 class="text-base font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center">
                    <i class="fas fa-plus-circle text-rose-500 me-2"></i> Add New Venue
                </h3>
                <form method="POST" action="" class="space-y-4">
                    <input type="hidden" name="action_add" value="1">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-building me-1 text-rose-500"></i> Venue Name *</label>
                        <input type="text" name="name" required placeholder="e.g. Zepp KL"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-map-pin me-1 text-slate-400"></i> Address</label>
                        <input type="text" name="address" placeholder="Jalan Hang Tuah..."
                               class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-city me-1 text-pink-500"></i> City *</label>
                            <input type="text" name="city" required placeholder="Kuala Lumpur"
                                   class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-map me-1 text-purple-500"></i> State</label>
                            <input type="text" name="state" placeholder="W.P. KL"
                                   class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-link me-1 text-indigo-500"></i> Google Maps Link</label>
                        <input type="url" name="map_link" placeholder="https://maps.google.com/..."
                               class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-users-rectangle me-1 text-emerald-500"></i> Capacity</label>
                        <input type="number" name="capacity" placeholder="e.g. 2500"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold">
                    </div>
                    <button type="submit" class="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md shadow-rose-500/20 transition-all">
                        Save Venue
                    </button>
                </form>
            </div>
        </div>

        <!-- Venues List Table -->
        <div class="lg:col-span-2">
            <div class="glass-card p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <table class="w-full text-left text-xs text-slate-700 font-medium">
                    <thead class="bg-slate-50 text-slate-900 uppercase font-extrabold border-b border-slate-200">
                        <tr>
                            <th class="p-3"><i class="fas fa-building me-1 text-rose-500"></i> Venue Name</th>
                            <th class="p-3"><i class="fas fa-location-dot me-1 text-pink-500"></i> Location</th>
                            <th class="p-3"><i class="fas fa-users me-1 text-indigo-500"></i> Capacity</th>
                            <th class="p-3"><i class="fas fa-calendar-star me-1 text-emerald-500"></i> Events Hosted</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($venues as $v): ?>
                            <tr class="hover:bg-slate-50/80 transition-colors">
                                <td class="p-3 font-black text-slate-900 text-sm"><?= htmlspecialchars($v['name']) ?></td>
                                <td class="p-3 font-bold text-slate-700"><?= htmlspecialchars($v['city']) ?>, <?= htmlspecialchars($v['state']) ?></td>
                                <td class="p-3 font-mono font-bold text-slate-600"><?= number_format($v['capacity']) ?></td>
                                <td class="p-3"><span class="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-black text-[11px]"><?= $v['event_count'] ?> events</span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
