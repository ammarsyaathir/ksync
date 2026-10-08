<?php
// index.php - K-Sync Malaysia Home Page (Enhanced Design)

$page_title = "K-Sync Malaysia | Centralized K-Pop Event Information & Discovery";
require_once __DIR__ . '/includes/header.php';

// Fetch Featured / Upcoming Verified Events
$stmt = $pdo->prepare("
    SELECT e.*, a.name as artist_name, c.name as category_name, c.badge_color, v.name as venue_display
    FROM events e
    LEFT JOIN artists a ON e.artist_id = a.id
    LEFT JOIN event_categories c ON e.category_id = c.id
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.verification_status = 'VERIFIED'
    ORDER BY e.event_date ASC
    LIMIT 6
");
$stmt->execute();
$upcoming_events = $stmt->fetchAll();

// Fetch Categories with Event Counts
$stmtCategories = $pdo->query("
    SELECT c.*, COUNT(e.id) as event_count 
    FROM event_categories c 
    LEFT JOIN events e ON c.id = e.category_id AND e.verification_status = 'VERIFIED'
    GROUP BY c.id
    ORDER BY c.id ASC
");
$categories = $stmtCategories->fetchAll();

// Fetch Featured Artists
$stmtArtists = $pdo->query("
    SELECT a.*, COUNT(e.id) as event_count 
    FROM artists a 
    LEFT JOIN events e ON a.id = e.artist_id AND e.verification_status = 'VERIFIED'
    GROUP BY a.id
    ORDER BY event_count DESC, a.name ASC
    LIMIT 6
");
$featured_artists = $stmtArtists->fetchAll();
?>

<!-- Hero Section (Light, Vibrant & Graphic Rich) -->
<div class="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-slate-200 bg-gradient-to-b from-pink-50 via-purple-50/50 to-slate-50 animate-fade-in">
    <!-- Soft Decorative Orbs -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none ai-glow"></div>
    <div class="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl pointer-events-none ai-float"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-flex items-center space-x-2 mb-6">
            <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                <i class="fas fa-compass me-1 text-pink-500"></i> Verified K-Pop Event Discovery Platform
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">Malaysia</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Discover K-Pop Events <br class="hidden sm:inline">
            <span class="text-slate-800">In Malaysia</span>
        </h1>
        <p class="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 leading-relaxed font-medium">
            Centralized discovery for concerts, fan meetings, cupsleeve gatherings, birthday pop-ups, and exhibitions across Malaysia.
        </p>

        <!-- Quick Event Search Bar -->
        <form action="<?= $base_url ?>/events.php" method="GET" class="max-w-3xl mx-auto">
            <div class="bg-white p-3 rounded-3xl flex flex-col sm:flex-row items-center gap-2.5 shadow-xl border border-slate-200">
                <div class="relative w-full flex-grow">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" name="search" placeholder="Search by artist, event name, venue or city..." 
                           class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm font-medium">
                </div>
                <button type="submit" class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center cursor-pointer">
                    <span>Search Events</span>
                    <i class="fas fa-arrow-right ms-2 text-xs"></i>
                </button>
            </div>
        </form>

        <!-- Quick Tag Badges -->
        <div class="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-600 font-medium">
            <span class="text-slate-500 font-bold me-1">Popular Right Now:</span>
            <a href="<?= $base_url ?>/events.php?search=SEVENTEEN" class="px-3.5 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all cursor-pointer">#SEVENTEEN</a>
            <a href="<?= $base_url ?>/events.php?search=TWICE" class="px-3.5 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all cursor-pointer">#TWICE</a>
            <a href="<?= $base_url ?>/events.php?search=IU" class="px-3.5 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all cursor-pointer">#IU</a>
            <a href="<?= $base_url ?>/events.php?category=cupsleeve-event" class="px-3.5 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all cursor-pointer">#CupsleeveKL</a>
            <a href="<?= $base_url ?>/events.php?search=Axiata" class="px-3.5 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all cursor-pointer">#AxiataArena</a>
        </div>
    </div>
</div>

<!-- Community Feature Highlights Counter Bar (Distinct Card Colors) -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
    <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Card 1: Pink Theme -->
            <div class="p-4 rounded-2xl bg-pink-50/80 border border-pink-200 flex items-center space-x-3.5">
                <div class="w-11 h-11 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg shrink-0 font-bold shadow-sm">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div>
                    <h4 class="text-lg font-extrabold text-pink-950">100% Free</h4>
                    <p class="text-[11px] font-medium text-pink-800">Discovery Hub</p>
                </div>
            </div>

            <!-- Card 2: Emerald Theme -->
            <div class="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center space-x-3.5">
                <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shrink-0 font-bold shadow-sm">
                    <i class="fas fa-circle-check"></i>
                </div>
                <div>
                    <h4 class="text-lg font-extrabold text-emerald-950">Verified</h4>
                    <p class="text-[11px] font-medium text-emerald-800">Organizers</p>
                </div>
            </div>

            <!-- Card 3: Indigo Theme -->
            <div class="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center space-x-3.5">
                <div class="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg shrink-0 font-bold shadow-sm">
                    <i class="fas fa-bell"></i>
                </div>
                <div>
                    <h4 class="text-lg font-extrabold text-indigo-950">Real-Time</h4>
                    <p class="text-[11px] font-medium text-indigo-800">Event Alerts</p>
                </div>
            </div>

            <!-- Card 4: Purple Theme -->
            <div class="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center space-x-3.5">
                <div class="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg shrink-0 font-bold shadow-sm">
                    <i class="fas fa-stopwatch"></i>
                </div>
                <div>
                    <h4 class="text-lg font-extrabold text-purple-950">Countdown</h4>
                    <p class="text-[11px] font-medium text-purple-800">Upcoming Shows</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Upcoming Verified Events Section -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
                <i class="fas fa-calendar-days text-pink-600 me-2.5"></i> Upcoming K-Pop Events
            </h2>
            <p class="text-slate-600 text-sm mt-1 font-medium">Verified official & fan-organized K-Pop events happening in Malaysia</p>
        </div>
        <a href="<?= $base_url ?>/events.php" class="mt-4 md:mt-0 text-sm font-bold text-pink-600 hover:text-pink-700 flex items-center cursor-pointer group">
            <span>Explore All Events</span>
            <i class="fas fa-chevron-right ms-1.5 group-hover:translate-x-1 transition-transform text-xs"></i>
        </a>
    </div>

    <!-- Event Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach ($upcoming_events as $event): ?>
            <?php 
                $calc_status = get_calculated_event_status($event);
                $isSaved = is_event_saved($current_user['id'] ?? null, $event['id']);
            ?>
            <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <!-- Poster Banner -->
                <div class="relative h-52 overflow-hidden bg-slate-100">
                    <img src="<?= htmlspecialchars($event['poster_image']) ?>" alt="<?= htmlspecialchars($event['event_name']) ?>" 
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/20"></div>
                    
                    <!-- Category & Status Badges -->
                    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        <span class="px-3 py-1 rounded-xl text-[11px] font-bold bg-white text-slate-900 shadow-md">
                            <?= htmlspecialchars($event['category_name'] ?? 'K-Pop Event') ?>
                        </span>
                        <?= get_status_badge($calc_status) ?>
                    </div>

                    <!-- Date Badge Overlaid on Image -->
                    <div class="absolute bottom-3 left-3 bg-white/95 rounded-2xl px-3 py-1.5 text-center shadow-md border border-white/40">
                        <span class="block text-xs font-bold text-pink-600 uppercase"><?= date('M', strtotime($event['event_date'])) ?></span>
                        <span class="block text-lg font-extrabold text-slate-900 leading-none"><?= date('d', strtotime($event['event_date'])) ?></span>
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

                <!-- Card Body -->
                <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                        <div class="flex items-center text-xs font-bold text-purple-600 mb-2">
                            <i class="fas fa-microphone-lines me-1.5 text-purple-500"></i>
                            <span><?= htmlspecialchars($event['artist_name'] ?? 'Multiple Artists') ?></span>
                        </div>
                        <h3 class="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
                            <a href="<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>" class="cursor-pointer">
                                <?= htmlspecialchars($event['event_name']) ?>
                            </a>
                        </h3>
                    </div>

                    <div class="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600 font-medium">
                        <div class="flex items-center">
                            <i class="far fa-clock w-4 me-2 text-pink-500"></i>
                            <span><?= date('h:i A', strtotime($event['start_time'])) ?></span>
                        </div>
                        <div class="flex items-center truncate">
                            <i class="fas fa-location-dot w-4 me-2 text-rose-500"></i>
                            <span class="truncate"><?= htmlspecialchars($event['venue_name']) ?>, <?= htmlspecialchars($event['city']) ?></span>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-[11px] text-emerald-700 font-bold flex items-center"><i class="fas fa-circle-check me-1 text-emerald-600"></i> Verified</span>
                        <a href="<?= $base_url ?>/event-details.php?id=<?= $event['id'] ?>" 
                           class="px-5 py-2 rounded-xl bg-pink-50 hover:bg-pink-600 text-pink-700 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer">
                            View Details &rarr;
                        </a>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- Browse by Category Section (Distinct Category Card Colors) -->
<div class="bg-slate-100/70 border-y border-slate-200 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-xl mx-auto mb-12">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Browse by Event Type</h2>
            <p class="text-slate-600 text-sm mt-2 font-medium">Filter events tailored to your favorite K-Pop activities</p>
        </div>

        <?php
            $catColors = [
                0 => 'bg-pink-50/90 border-pink-200 hover:border-pink-400 text-pink-600 text-pink-900',
                1 => 'bg-purple-50/90 border-purple-200 hover:border-purple-400 text-purple-600 text-purple-900',
                2 => 'bg-indigo-50/90 border-indigo-200 hover:border-indigo-400 text-indigo-600 text-indigo-900',
                3 => 'bg-emerald-50/90 border-emerald-200 hover:border-emerald-400 text-emerald-600 text-emerald-900',
            ];
        ?>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <?php foreach ($categories as $idx => $cat): ?>
                <?php 
                    $colorStyle = $catColors[$idx % count($catColors)];
                    $parts = explode(' ', $colorStyle);
                    $bgBorder = $parts[0] . ' ' . $parts[1] . ' ' . $parts[2];
                    $iconColor = $parts[3];
                    $textColor = $parts[4];
                ?>
                <a href="<?= $base_url ?>/events.php?category=<?= urlencode($cat['slug']) ?>" 
                   class="<?= $bgBorder ?> p-6 rounded-3xl border hover:shadow-lg transition-all text-center group cursor-pointer">
                    <div class="w-14 h-14 rounded-2xl bg-white <?= $iconColor ?> border border-slate-200 mx-auto flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4 shadow-sm">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <h3 class="font-extrabold <?= $textColor ?> text-sm"><?= htmlspecialchars($cat['name']) ?></h3>
                    <p class="text-xs text-slate-500 mt-1 font-medium"><?= $cat['event_count'] ?> active events</p>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<!-- Featured K-Pop Artists -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Popular K-Pop Artists</h2>
            <p class="text-slate-600 text-sm font-medium">Follow upcoming tours and fan events by group</p>
        </div>
        <a href="<?= $base_url ?>/events.php" class="text-sm font-bold text-slate-800 hover:text-slate-900 cursor-pointer">View All Artists &rarr;</a>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        <?php foreach ($featured_artists as $art): ?>
            <a href="<?= $base_url ?>/artist-details.php?id=<?= $art['id'] ?>" 
               class="bg-white p-5 rounded-3xl border border-slate-200 text-center hover:border-slate-300 hover:shadow-md transition-all group cursor-pointer">
                <div class="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-slate-200 group-hover:border-slate-400 transition-colors shadow-sm p-0.5 bg-white">
                    <img src="<?= htmlspecialchars($art['image_url']) ?>" alt="<?= htmlspecialchars($art['name']) ?>" class="w-full h-full object-cover rounded-full">
                </div>
                <h4 class="font-bold text-sm text-slate-900 truncate"><?= htmlspecialchars($art['name']) ?></h4>
                <p class="text-[11px] text-slate-500 font-medium"><?= htmlspecialchars($art['group_type']) ?></p>
            </a>
        <?php endforeach; ?>
    </div>
</div>

<!-- Organizer Call-to-Action -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
    <div class="bg-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-200 shadow-lg">
        <div class="relative z-10 max-w-2xl">
            <span class="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 mb-4 border border-slate-200 shadow-sm">For Event Organizers</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Are you hosting a K-Pop Event in Malaysia?</h2>
            <p class="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                Submit your concert, fan meeting, cupsleeve gathering, or birthday pop-up to K-Sync Malaysia. Reach thousands of verified Malaysian K-Pop fans, manage event updates, and trigger instant notifications.
            </p>
            <div class="flex flex-wrap gap-3">
                <a href="<?= $base_url ?>/organizer/submit-event.php" class="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer">
                    Submit Event Now
                </a>
                <a href="<?= $base_url ?>/register.php?role=organizer" class="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm transition-all cursor-pointer">
                    Register Organizer Account
                </a>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
