<?php
// organizer/dashboard.php - Organizer Overview & Control Panel (Enhanced Design)

$page_title = "Organizer Dashboard | K-Sync Malaysia";
require_once __DIR__ . '/../includes/header.php';
require_role('organizer');

$organizer_id = $current_user['id'];

// Stats counts
$stmt = $pdo->prepare("SELECT COUNT(*) FROM events WHERE organizer_id = ?");
$stmt->execute([$organizer_id]);
$total_events = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM events WHERE organizer_id = ? AND verification_status = 'VERIFIED'");
$stmt->execute([$organizer_id]);
$verified_events = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM events WHERE organizer_id = ? AND verification_status = 'PENDING'");
$stmt->execute([$organizer_id]);
$pending_events = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM events WHERE organizer_id = ? AND verification_status = 'REJECTED'");
$stmt->execute([$organizer_id]);
$rejected_events = $stmt->fetchColumn();

// Recent submitted events
$stmtEvents = $pdo->prepare("
    SELECT e.*, c.name as category_name
    FROM events e
    LEFT JOIN event_categories c ON e.category_id = c.id
    WHERE e.organizer_id = ?
    ORDER BY e.created_at DESC
    LIMIT 5
");
$stmtEvents->execute([$organizer_id]);
$recent_events = $stmtEvents->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <div class="mb-2 flex items-center space-x-2">
                <?= get_organizer_badge($current_user) ?>
                <?php $lvl = get_organizer_level_info($current_user['id']); echo $lvl['badge']; ?>
            </div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                <i class="fas fa-chart-line text-emerald-500 me-3"></i> Organizer Dashboard
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-semibold">Submit, manage, generate check-in QR codes, and publish updates for your K-Pop events in Malaysia.</p>
        </div>
        <a href="<?= $base_url ?>/organizer/submit-event.php" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm shadow-md shadow-pink-500/25 transition-all flex items-center justify-center transform hover:-translate-y-0.5">
            <i class="fas fa-plus-circle me-2"></i> Submit New Event
        </a>
    </div>

    <!-- Clear Helper Notice -->
    <div class="p-4 mb-8 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3 shadow-sm">
        <i class="fas fa-circle-info text-emerald-600 text-base mt-0.5 shrink-0"></i>
        <div class="font-semibold leading-relaxed">
            <strong>Organizer Workflow Guidance:</strong> Newly submitted events enter a <span class="font-bold text-amber-800">PENDING</span> state for administrator verification. Once verified by an admin, your event becomes publicly visible to thousands of Malaysian fans. You can publish updates at any time to notify fans who saved your event!
        </div>
    </div>

    <!-- Summary Metrics Grid (Distinct Card Colors) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <!-- Card 1: Purple Theme -->
        <div class="bg-purple-50/70 p-6 rounded-3xl border border-purple-200 shadow-sm">
            <div class="flex items-center justify-between text-purple-800 text-xs font-bold mb-2">
                <span>Total Submitted</span>
                <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm shadow-sm"><i class="fas fa-calendar-days"></i></div>
            </div>
            <p class="text-3xl font-extrabold text-purple-900"><?= $total_events ?></p>
            <p class="text-[11px] text-purple-700 font-medium mt-1.5"><i class="fas fa-list-check me-1"></i> All time submissions</p>
        </div>

        <!-- Card 2: Emerald Theme -->
        <div class="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 shadow-sm">
            <div class="flex items-center justify-between text-emerald-800 text-xs font-bold mb-2">
                <span>Verified Events</span>
                <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-sm"><i class="fas fa-circle-check"></i></div>
            </div>
            <p class="text-3xl font-extrabold text-emerald-900"><?= $verified_events ?></p>
            <p class="text-[11px] text-emerald-700 font-medium mt-1.5"><i class="fas fa-globe me-1"></i> Live on Discovery</p>
        </div>

        <!-- Card 3: Amber Theme -->
        <div class="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 shadow-sm">
            <div class="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                <span>Pending Review</span>
                <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm shadow-sm"><i class="fas fa-clock"></i></div>
            </div>
            <p class="text-3xl font-extrabold text-amber-900"><?= $pending_events ?></p>
            <p class="text-[11px] text-amber-700 font-medium mt-1.5"><i class="fas fa-hourglass-half me-1"></i> Under admin review</p>
        </div>

        <!-- Card 4: Rose Theme -->
        <div class="bg-rose-50/70 p-6 rounded-3xl border border-rose-200 shadow-sm">
            <div class="flex items-center justify-between text-rose-800 text-xs font-bold mb-2">
                <span>Rejected Events</span>
                <div class="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-sm shadow-sm"><i class="fas fa-circle-xmark"></i></div>
            </div>
            <p class="text-3xl font-extrabold text-rose-900"><?= $rejected_events ?></p>
            <p class="text-[11px] text-rose-700 font-medium mt-1.5"><i class="fas fa-triangle-exclamation me-1"></i> Action required</p>
        </div>
    </div>

    <!-- Recent Submissions Table -->
    <div class="glass-card rounded-3xl border border-slate-200/90 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 class="text-base font-black text-slate-900 flex items-center"><i class="fas fa-list text-pink-500 me-2"></i> Recent Event Submissions</h3>
            <a href="<?= $base_url ?>/organizer/my-events.php" class="text-xs font-extrabold text-pink-600 hover:text-pink-700">View All My Events &rarr;</a>
        </div>

        <?php if (empty($recent_events)): ?>
            <div class="text-center py-8 text-slate-500 text-xs font-semibold">
                <i class="fas fa-folder-open text-slate-300 text-3xl mb-2 block"></i>
                You haven't submitted any K-Pop events yet. Click <strong>Submit New Event</strong> above to create your first event!
            </div>
        <?php else: ?>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs text-slate-700 font-medium">
                    <thead class="bg-slate-50 text-slate-900 uppercase font-extrabold border-b border-slate-200">
                        <tr>
                            <th class="p-3"><i class="fas fa-calendar-star me-1 text-pink-500"></i> Event Name</th>
                            <th class="p-3"><i class="fas fa-tags me-1 text-purple-500"></i> Category</th>
                            <th class="p-3"><i class="far fa-calendar-alt me-1 text-indigo-500"></i> Event Date</th>
                            <th class="p-3"><i class="fas fa-shield-halved me-1 text-emerald-500"></i> Verification</th>
                            <th class="p-3 text-right"><i class="fas fa-gear me-1"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($recent_events as $ev): ?>
                            <tr class="hover:bg-slate-50/80 transition-colors">
                                <td class="p-3 font-black text-slate-900"><?= htmlspecialchars($ev['event_name']) ?></td>
                                <td class="p-3 font-semibold text-purple-700"><?= htmlspecialchars($ev['category_name'] ?? 'General') ?></td>
                                <td class="p-3 font-semibold"><?= date('d M Y', strtotime($ev['event_date'])) ?></td>
                                <td class="p-3"><?= get_verification_badge($ev['verification_status']) ?></td>
                                <td class="p-3 text-right space-x-2">
                                    <button onclick="openQrModal('<?= addslashes(htmlspecialchars($ev['event_name'])) ?>', '<?= $base_url ?>/checkin.php?event_id=<?= $ev['id'] ?>')" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-all inline-flex items-center"><i class="fas fa-qrcode me-1 text-emerald-600"></i> Check-in QR</button>
                                    <a href="<?= $base_url ?>/organizer/edit-event.php?id=<?= $ev['id'] ?>" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all inline-flex items-center"><i class="fas fa-pen-to-square me-1 text-cyan-600"></i> Edit</a>
                                    <a href="<?= $base_url ?>/organizer/submit-update.php?event_id=<?= $ev['id'] ?>" class="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold transition-all inline-flex items-center"><i class="fas fa-bullhorn me-1 text-pink-600"></i> Post Update</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

<!-- QR CODE MODAL DIALOG -->
<div id="qrModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden animate-fade-in p-4">
    <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold mx-auto mb-3">
            <i class="fas fa-qrcode"></i>
        </div>
        <h3 id="qrModalTitle" class="text-base font-black text-slate-900 mb-1">Event Check-In QR Code</h3>
        <p class="text-xs text-slate-500 mb-4 font-semibold">Display or print this QR code at your venue for attendees to scan and check in.</p>
        
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 flex items-center justify-center">
            <img id="qrImage" src="" alt="QR Code" class="w-48 h-48 rounded-xl shadow-sm border border-slate-200">
        </div>

        <div class="flex space-x-2">
            <a id="qrDirectLink" href="#" target="_blank" class="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-sm">
                Open Check-in Link
            </a>
            <button onclick="document.getElementById('qrModal').classList.add('hidden')" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
                Close
            </button>
        </div>
    </div>
</div>

<script>
function openQrModal(eventName, checkinUrl) {
    document.getElementById('qrModalTitle').textContent = eventName;
    document.getElementById('qrDirectLink').href = checkinUrl;
    document.getElementById('qrImage').src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(window.location.origin + checkinUrl);
    document.getElementById('qrModal').classList.remove('hidden');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
