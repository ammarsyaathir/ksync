<?php
// artist-details.php - Dedicated K-Pop Artist Page & Itinerary Calendar

$artist_id = intval($_GET['id'] ?? 0);
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

// Fetch Artist Info
$stmt = $pdo->prepare("SELECT * FROM artists WHERE id = ?");
$stmt->execute([$artist_id]);
$artist = $stmt->fetch();

if (!$artist) {
    header("Location: {$base_url}/events.php");
    exit;
}

// Demo Group Member Profiles & Birthdays Data
$member_profiles = [
    'SEVENTEEN' => [
        ['name' => 'S.Coups (Choi Seung-cheol)', 'role' => 'Leader & Main Rapper', 'birthday' => '1995-08-08'],
        ['name' => 'Jeonghan (Yoon Jeong-han)', 'role' => 'Lead Vocalist', 'birthday' => '1995-10-04'],
        ['name' => 'Joshua (Hong Ji-soo)', 'role' => 'Lead Vocalist', 'birthday' => '1995-12-30'],
        ['name' => 'Jun (Wen Junhui)', 'role' => 'Lead Dancer, Sub Vocalist', 'birthday' => '1996-06-10'],
        ['name' => 'Hoshi (Kwon Soon-young)', 'role' => 'Performance Unit Leader', 'birthday' => '1996-06-15'],
        ['name' => 'Wonwoo (Jeon Won-woo)', 'role' => 'Lead Rapper', 'birthday' => '1996-07-17'],
        ['name' => 'Woozi (Lee Ji-hoon)', 'role' => 'Vocal Unit Leader & Producer', 'birthday' => '1996-11-22'],
        ['name' => 'DK (Lee Seok-min)', 'role' => 'Main Vocalist', 'birthday' => '1997-02-18'],
        ['name' => 'Mingyu (Kim Min-gyu)', 'role' => 'Lead Rapper', 'birthday' => '1997-04-06'],
        ['name' => 'The8 (Xu Minghao)', 'role' => 'Lead Dancer', 'birthday' => '1997-11-07'],
        ['name' => 'Seungkwan (Boo Seung-kwan)', 'role' => 'Main Vocalist', 'birthday' => '1998-01-16'],
        ['name' => 'Vernon (Chwe Hansol)', 'role' => 'Main Rapper', 'birthday' => '1998-02-18'],
        ['name' => 'Dino (Lee Chan)', 'role' => 'Main Dancer, Maknae', 'birthday' => '1999-02-11']
    ],
    'TWICE' => [
        ['name' => 'Nayeon (Im Na-yeon)', 'role' => 'Lead Vocalist, Center', 'birthday' => '1995-09-22'],
        ['name' => 'Jeongyeon (Yoo Jeong-yeon)', 'role' => 'Lead Vocalist', 'birthday' => '1996-11-01'],
        ['name' => 'Momo (Hirai Momo)', 'role' => 'Main Dancer, Sub Rapper', 'birthday' => '1996-11-09'],
        ['name' => 'Sana (Minatozaki Sana)', 'role' => 'Sub Vocalist', 'birthday' => '1996-12-29'],
        ['name' => 'Jihyo (Park Ji-hyo)', 'role' => 'Leader, Main Vocalist', 'birthday' => '1997-02-01'],
        ['name' => 'Mina (Myoui Mina)', 'role' => 'Main Dancer, Sub Vocalist', 'birthday' => '1997-03-24'],
        ['name' => 'Dahyun (Kim Da-hyun)', 'role' => 'Lead Rapper', 'birthday' => '1998-05-28'],
        ['name' => 'Chaeyoung (Son Chae-young)', 'role' => 'Main Rapper', 'birthday' => '1999-04-23'],
        ['name' => 'Tzuyu (Chou Tzu-yu)', 'role' => 'Lead Dancer, Maknae', 'birthday' => '1999-06-14']
    ],
    'TOMORROW X TOGETHER (TXT)' => [
        ['name' => 'Soobin (Choi Soo-bin)', 'role' => 'Leader, Sub Vocalist', 'birthday' => '2000-12-05'],
        ['name' => 'Yeonjun (Choi Yeon-jun)', 'role' => 'Main Dancer, Rapper', 'birthday' => '1999-09-13'],
        ['name' => 'Beomgyu (Choi Beom-gyu)', 'role' => 'Visual, Sub Vocalist', 'birthday' => '2001-03-13'],
        ['name' => 'Taehyun (Kang Tae-hyun)', 'role' => 'Main Vocalist', 'birthday' => '2002-02-05'],
        ['name' => 'Huening Kai (Kai Kamal Huening)', 'role' => 'Main Vocalist, Maknae', 'birthday' => '2002-08-14']
    ],
    'IU (Lee Ji-eun)' => [
        ['name' => 'IU (Lee Ji-eun)', 'role' => 'Solo Singer-Songwriter & Actress', 'birthday' => '1993-05-16']
    ]
];

$members = $member_profiles[$artist['name']] ?? [
    ['name' => $artist['name'] . ' Members', 'role' => $artist['group_type'], 'birthday' => '1998-01-01']
];

// Fetch Upcoming Events for this Artist
$stmtEv = $pdo->prepare("
    SELECT e.*, c.name as category_name, c.badge_color, v.name as venue_display
    FROM events e
    LEFT JOIN event_categories c ON e.category_id = c.id
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.artist_id = ? AND e.verification_status = 'VERIFIED'
    ORDER BY e.event_date ASC
");
$stmtEv->execute([$artist_id]);
$artist_events = $stmtEv->fetchAll();

$page_title = htmlspecialchars($artist['name']) . " Profile & Event Itinerary | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Artist Banner Header -->
    <div class="glass-card rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl relative">
        <div class="h-64 w-full relative">
            <img src="<?= htmlspecialchars($artist['image_url']) ?>" alt="<?= htmlspecialchars($artist['name']) ?>" class="w-full h-full object-cover blur-sm opacity-40 scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div class="p-6 sm:p-8 relative -mt-32 flex flex-col md:flex-row items-center md:items-end gap-6 text-white">
            <div class="w-36 h-36 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shrink-0 bg-slate-100">
                <img src="<?= htmlspecialchars($artist['image_url']) ?>" alt="<?= htmlspecialchars($artist['name']) ?>" class="w-full h-full object-cover">
            </div>

            <div class="space-y-2 text-center md:text-left flex-grow">
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span class="px-3.5 py-1 rounded-full text-xs font-black bg-pink-500 text-white shadow-sm">
                        <?= htmlspecialchars($artist['group_type']) ?>
                    </span>
                    <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                        <i class="fas fa-building me-1"></i> <?= htmlspecialchars($artist['agency'] ?? 'K-Pop Entertainment') ?>
                    </span>
                </div>
                <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white"><?= htmlspecialchars($artist['name']) ?></h1>
                <p class="text-xs sm:text-sm text-slate-200 font-medium max-w-2xl leading-relaxed"><?= htmlspecialchars($artist['description']) ?></p>
            </div>
        </div>
    </div>

    <!-- Member Profiles & Birthday Schedule -->
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-slate-900 flex items-center">
                <i class="fas fa-cake-candles text-pink-500 me-2"></i> Group Members & Birthdays
            </h2>
            <span class="text-xs text-slate-500 font-semibold"><?= count($members) ?> Profile(s) Listed</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <?php foreach ($members as $m): ?>
                <?php 
                    $bdayMonthDay = date('M d', strtotime($m['birthday']));
                ?>
                <div class="glass-card p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-3.5 hover:border-pink-300 transition-all">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md">
                        <?= strtoupper(substr($m['name'], 0, 1)) ?>
                    </div>
                    <div class="overflow-hidden">
                        <h3 class="font-black text-slate-900 text-xs truncate"><?= htmlspecialchars($m['name']) ?></h3>
                        <p class="text-[11px] text-purple-700 font-semibold truncate"><?= htmlspecialchars($m['role']) ?></p>
                        <p class="text-[10px] text-pink-600 font-bold mt-0.5"><i class="fas fa-birthday-cake me-1"></i> Birthday: <?= $bdayMonthDay ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Group Event Itinerary Timeline (Concerts, Fan Meetings, Cupsleeve Events) -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
                <h2 class="text-xl font-black text-slate-900 flex items-center">
                    <i class="fas fa-calendar-star text-purple-600 me-2"></i> Malaysian Event Itinerary
                </h2>
                <p class="text-xs text-slate-500 font-semibold mt-0.5">All upcoming concerts, fan meetings, and cupsleeve birthday gatherings for <?= htmlspecialchars($artist['name']) ?> in Malaysia.</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-200 self-start sm:self-auto">
                <?= count($artist_events) ?> Upcoming Event(s)
            </span>
        </div>

        <?php if (empty($artist_events)): ?>
            <div class="text-center py-12 text-slate-500 text-xs font-semibold">
                <i class="fas fa-calendar-xmark text-slate-300 text-4xl mb-3 block"></i>
                No upcoming Malaysian events listed for <strong><?= htmlspecialchars($artist['name']) ?></strong> right now. Check back soon for new cupsleeve celebrations and tour announcements!
            </div>
        <?php else: ?>
            <div class="space-y-4">
                <?php foreach ($artist_events as $ev): ?>
                    <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-start space-x-4">
                            <div class="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                                <img src="<?= htmlspecialchars($ev['poster_image']) ?>" class="w-full h-full object-cover">
                            </div>
                            <div class="space-y-1">
                                <div class="flex items-center space-x-2">
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-700">
                                        <?= htmlspecialchars($ev['category_name']) ?>
                                    </span>
                                    <span class="text-[11px] font-bold text-slate-500"><i class="far fa-calendar-alt me-1 text-purple-500"></i> <?= date('D, d M Y', strtotime($ev['event_date'])) ?></span>
                                </div>
                                <h3 class="font-black text-slate-900 text-sm hover:text-pink-600 transition-colors">
                                    <a href="<?= $base_url ?>/event-details.php?id=<?= $ev['id'] ?>"><?= htmlspecialchars($ev['event_name']) ?></a>
                                </h3>
                                <p class="text-xs text-slate-600 font-medium"><i class="fas fa-location-dot text-rose-500 me-1"></i> <?= htmlspecialchars($ev['venue_name']) ?>, <?= htmlspecialchars($ev['city']) ?></p>
                            </div>
                        </div>

                        <a href="<?= $base_url ?>/event-details.php?id=<?= $ev['id'] ?>" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm text-center shrink-0">
                            View Event &rarr;
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
