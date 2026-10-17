<?php
// events.php - Event Discovery, Search, Filtering & Sorting Page (Enhanced Design)

$page_title = "Discover K-Pop Events | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';

// Get query filters
$search = trim($_GET['search'] ?? '');
$artist_filter = intval($_GET['artist'] ?? 0);
$category_filter = trim($_GET['category'] ?? '');
$location_filter = trim($_GET['location'] ?? '');
$status_filter = trim($_GET['status'] ?? '');
$sort = trim($_GET['sort'] ?? 'upcoming');

// Build SQL Query
$sql = "
    SELECT e.*, a.name as artist_name, c.name as category_name, c.slug as category_slug, v.name as venue_display,
           u.full_name as organizer_name, u.organization_name, u.organization_type, u.social_handle, u.social_url, u.is_verified_organizer
    FROM events e
    LEFT JOIN artists a ON e.artist_id = a.id
    LEFT JOIN event_categories c ON e.category_id = c.id
    LEFT JOIN venues v ON e.venue_id = v.id
    LEFT JOIN users u ON e.organizer_id = u.id
    WHERE e.verification_status = 'VERIFIED'
";

$params = [];

if (!empty($search)) {
    $sql .= " AND (e.event_name LIKE ? OR a.name LIKE ? OR e.venue_name LIKE ? OR e.city LIKE ? OR e.state LIKE ?)";
    $searchTerm = "%{$search}%";
    $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm]);
}

if ($artist_filter > 0) {
    $sql .= " AND e.artist_id = ?";
    $params[] = $artist_filter;
}

if (!empty($category_filter)) {
    $sql .= " AND c.slug = ?";
    $params[] = $category_filter;
}

if (!empty($location_filter)) {
    $sql .= " AND (e.city = ? OR e.state = ?)";
    $params[] = $location_filter;
    $params[] = $location_filter;
}

if (!empty($status_filter)) {
    $sql .= " AND e.event_status = ?";
    $params[] = $status_filter;
}

switch ($sort) {
    case 'latest':
        $sql .= " ORDER BY e.created_at DESC";
        break;
    case 'name_asc':
        $sql .= " ORDER BY e.event_name ASC";
        break;
    case 'name_desc':
        $sql .= " ORDER BY e.event_name DESC";
        break;
    case 'upcoming':
    default:
        $sql .= " ORDER BY e.event_date ASC, e.start_time ASC";
        break;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$events = $stmt->fetchAll();

$all_artists = $pdo->query("SELECT * FROM artists ORDER BY name ASC")->fetchAll();
$all_categories = $pdo->query("SELECT * FROM event_categories ORDER BY name ASC")->fetchAll();
$all_locations = $pdo->query("SELECT DISTINCT city FROM events WHERE verification_status = 'VERIFIED' AND city IS NOT NULL ORDER BY city ASC")->fetchAll(PDO::FETCH_COLUMN);
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                    <i class="fas fa-compass me-1 text-pink-500"></i> Event Discovery Directory
                </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                Discover K-Pop Events
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Search, filter, and track verified concerts, fan meetings, and cupsleeve gatherings in Malaysia.</p>
        </div>
        <span class="px-4 py-2 rounded-2xl text-xs font-bold bg-slate-900 text-white shadow-sm flex items-center shrink-0 self-start md:self-auto">
            <i class="fas fa-calendar-check me-2 text-pink-400"></i> <?= count($events) ?> Verified Event(s)
        </span>
    </div>

    <!-- Quick K-Pop Group Profiles Bar (kpopofficial.com style) -->
    <div class="mb-8 bg-slate-50 p-4 rounded-3xl border border-slate-200/90 shadow-sm">
        <div class="flex items-center justify-between mb-3 px-1">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center">
                <i class="fas fa-users text-pink-500 me-2"></i> K-Pop Group Profiles & Event Trackers
            </h3>
            <span class="text-[11px] text-slate-500 font-semibold">Click group to view profile & member details</span>
        </div>
        <div class="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-none">
            <?php foreach ($all_artists as $art): ?>
                <a href="<?= $base_url ?>/artist-details.php?id=<?= $art['id'] ?>" 
                   class="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-sm transition-all shrink-0">
                    <img src="<?= htmlspecialchars($art['image_url']) ?>" class="w-6 h-6 rounded-full object-cover border border-slate-200">
                    <span class="text-xs font-extrabold text-slate-800"><?= htmlspecialchars($art['name']) ?></span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Multi-Criteria Search & Filter Panel -->
    <form method="GET" action="<?= $base_url ?>/events.php" class="glass-card p-6 rounded-3xl mb-10 shadow-md border border-slate-200/90">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            
            <!-- Keyword Search -->
            <div>
                <label class="block text-xs font-extrabold text-slate-700 mb-1.5">Search Keyword</label>
                <div class="relative">
                    <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-500 text-xs"></i>
                    <input type="text" name="search" value="<?= htmlspecialchars($search) ?>" 
                           placeholder="Event name, artist, venue..." 
                           class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs font-bold">
                </div>
            </div>

            <!-- Artist Filter -->
            <div>
                <label class="block text-xs font-extrabold text-slate-700 mb-1.5">Artist / Group</label>
                <select name="artist" class="w-full bg-slate-50 text-slate-900 py-2.5 px-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs font-bold">
                    <option value="">All Artists & Groups</option>
                    <?php foreach ($all_artists as $art): ?>
                        <option value="<?= $art['id'] ?>" <?= $artist_filter == $art['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($art['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Category Filter -->
            <div>
                <label class="block text-xs font-extrabold text-slate-700 mb-1.5">Event Category</label>
                <select name="category" class="w-full bg-slate-50 text-slate-900 py-2.5 px-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs font-bold">
                    <option value="">All Categories</option>
                    <?php foreach ($all_categories as $cat): ?>
                        <option value="<?= htmlspecialchars($cat['slug']) ?>" <?= $category_filter == $cat['slug'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($cat['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Location Filter -->
            <div>
                <label class="block text-xs font-extrabold text-slate-700 mb-1.5">Location / City</label>
                <select name="location" class="w-full bg-slate-50 text-slate-900 py-2.5 px-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs font-bold">
                    <option value="">All Locations</option>
                    <?php foreach ($all_locations as $loc): ?>
                        <option value="<?= htmlspecialchars($loc) ?>" <?= $location_filter == $loc ? 'selected' : '' ?>>
                            <?= htmlspecialchars($loc) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-4">
            <!-- Sort selector & Status Filter -->
            <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div class="flex items-center space-x-2">
                    <span class="text-xs text-slate-500 font-extrabold"><i class="fas fa-arrow-down-short-wide me-1 text-purple-500"></i> Sort By:</span>
                    <select name="sort" class="bg-slate-50 text-slate-900 py-2 px-3 rounded-2xl border border-slate-200 text-xs font-bold">
                        <option value="upcoming" <?= $sort == 'upcoming' ? 'selected' : '' ?>>Upcoming Date (Default)</option>
                        <option value="latest" <?= $sort == 'latest' ? 'selected' : '' ?>>Latest Added</option>
                        <option value="name_asc" <?= $sort == 'name_asc' ? 'selected' : '' ?>>Name A - Z</option>
                        <option value="name_desc" <?= $sort == 'name_desc' ? 'selected' : '' ?>>Name Z - A</option>
                    </select>
                </div>

                <div class="flex items-center space-x-2">
                    <span class="text-xs text-slate-500 font-extrabold">Status:</span>
                    <select name="status" class="bg-slate-50 text-slate-900 py-2 px-3 rounded-2xl border border-slate-200 text-xs font-bold">
                        <option value="">All Statuses</option>
                        <option value="UPCOMING" <?= $status_filter == 'UPCOMING' ? 'selected' : '' ?>>Upcoming</option>
                        <option value="ONGOING" <?= $status_filter == 'ONGOING' ? 'selected' : '' ?>>Ongoing</option>
                        <option value="COMPLETED" <?= $status_filter == 'COMPLETED' ? 'selected' : '' ?>>Completed</option>
                        <option value="POSTPONED" <?= $status_filter == 'POSTPONED' ? 'selected' : '' ?>>Postponed</option>
                        <option value="CANCELLED" <?= $status_filter == 'CANCELLED' ? 'selected' : '' ?>>Cancelled</option>
                    </select>
                </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <a href="<?= $base_url ?>/events.php" class="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold">
                    Reset Filters
                </a>
                <button type="submit" class="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black shadow-md shadow-pink-500/20">
                    Apply Filters
                </button>
            </div>
        </div>
    </form>

    <!-- Event Cards Grid -->
    <?php if (empty($events)): ?>
        <div class="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto my-12 border border-slate-200 shadow-md">
            <div class="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                <i class="fas fa-calendar-xmark"></i>
            </div>
            <h3 class="text-lg font-black text-slate-900 mb-2">No Matching Events Found</h3>
            <p class="text-slate-500 text-xs mb-6 font-semibold">We couldn't find any verified events matching your specific search parameters.</p>
            <a href="<?= $base_url ?>/events.php" class="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-extrabold inline-block shadow-md">
                Clear Filters
            </a>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($events as $event): ?>
                <?php 
                    $calc_status = get_calculated_event_status($event);
                    $isSaved = is_event_saved($current_user['id'] ?? null, $event['id']);
                ?>
                <div class="glass-card rounded-3xl overflow-hidden hover:border-pink-300 transition-all duration-300 flex flex-col group hover:-translate-y-1">
                    <div class="relative h-52 overflow-hidden bg-slate-100">
                        <img src="<?= htmlspecialchars($event['poster_image']) ?>" alt="<?= htmlspecialchars($event['event_name']) ?>" 
                             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/30"></div>
                        
                        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                            <span class="px-3 py-1 rounded-xl text-[11px] font-black bg-white/95 text-purple-700 shadow-md backdrop-blur-md">
                                <?= htmlspecialchars($event['category_name'] ?? 'K-Pop Event') ?>
                            </span>
                            <?= get_status_badge($calc_status) ?>
                        </div>

                        <!-- Date Badge Overlaid on Image -->
                        <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 text-center shadow-md border border-white/40">
                            <span class="block text-xs font-black text-pink-600 uppercase"><?= date('M', strtotime($event['event_date'])) ?></span>
                            <span class="block text-lg font-black text-slate-900 leading-none"><?= date('d', strtotime($event['event_date'])) ?></span>
                        </div>

                        <!-- Floating Top-Right Action Buttons (Save & Share) -->
                        <div class="absolute top-3 right-3 flex items-center space-x-2 z-10">
                            <button onclick="toggleSaveEvent(<?= $event['id'] ?>, this)" 
                                    title="Save Event"
                                    class="w-9 h-9 rounded-full <?= $isSaved ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/90 text-slate-700 hover:text-rose-500 border-slate-200' ?> border backdrop-blur-md flex items-center justify-center text-xs shadow-md transition-all cursor-pointer hover:scale-110">
                                <i class="<?= $isSaved ? 'fas' : 'far' ?> fa-heart text-xs"></i>
                            </button>
                            <button onclick="openShareModal('<?= addslashes(htmlspecialchars($event['event_name'])) ?>', '<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>')" 
                                    title="Share Event"
                                    class="w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:text-pink-600 border border-slate-200 backdrop-blur-md flex items-center justify-center text-xs shadow-md transition-all cursor-pointer hover:scale-110">
                                <i class="fas fa-share-nodes text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                        <div>
                            <div class="flex items-center text-xs font-extrabold text-pink-600 mb-2">
                                <i class="fas fa-microphone-lines me-1.5"></i>
                                <span><?= htmlspecialchars($event['artist_name'] ?? 'Multiple Artists') ?></span>
                            </div>
                            <h3 class="text-lg font-black text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
                                <a href="<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>">
                                    <?= htmlspecialchars($event['event_name']) ?>
                                </a>
                            </h3>
                        </div>

                        <div class="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600 font-bold">
                            <div class="flex items-center">
                                <i class="far fa-clock w-4 me-2 text-pink-500"></i>
                                <span><?= date('h:i A', strtotime($event['start_time'])) ?></span>
                            </div>
                            <div class="flex items-center truncate">
                                <i class="fas fa-location-dot w-4 me-2 text-rose-500"></i>
                                <span class="truncate"><?= htmlspecialchars($event['venue_name']) ?>, <?= htmlspecialchars($event['city']) ?></span>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <?= get_organizer_badge([
                                    'is_verified_organizer' => $event['is_verified_organizer'] ?? 0,
                                    'organization_type' => $event['organization_type'] ?? 'Fanclub',
                                    'social_handle' => $event['social_handle'] ?? ''
                                ]) ?>
                            </div>
                            <a href="<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>" 
                               class="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-500 hover:to-purple-600 text-pink-700 hover:text-white text-xs font-extrabold transition-all shadow-sm">
                                View Event Details &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
