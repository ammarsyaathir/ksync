<?php
// buddies.php - K-Sync Event Buddy Community & "Who's Going?" Directory
$page_title = "Event Buddy Directory | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';
require_login();

$user_id = $current_user['id'];
$event_id = intval($_GET['event_id'] ?? 0);
$active_tab = trim($_GET['tab'] ?? 'discover');

$selected_event = null;
if ($event_id > 0) {
    $stmt = $pdo->prepare("SELECT e.*, a.name as artist_name FROM events e LEFT JOIN artists a ON e.artist_id = a.id WHERE e.id = ?");
    $stmt->execute([$event_id]);
    $selected_event = $stmt->fetch();
}

// All verified events for dropdown selector
$events_list = $pdo->query("SELECT id, event_name, event_date, city FROM events WHERE verification_status = 'VERIFIED' ORDER BY event_date ASC")->fetchAll();

// 1. Discover Interested Fans for the event
$interested_fans = [];
if ($event_id > 0) {
    $stmt = $pdo->prepare("
        SELECT u.id, u.full_name, u.profile_image, u.bio, u.location, u.buddy_preference,
               br.status as connection_status, br.sender_id, br.id as request_id
        FROM event_interest ei
        JOIN users u ON ei.user_id = u.id
        LEFT JOIN buddy_requests br ON (br.event_id = ei.event_id AND ((br.sender_id = ? AND br.receiver_id = u.id) OR (br.sender_id = u.id AND br.receiver_id = ?)))
        WHERE ei.event_id = ? AND u.id != ?
        ORDER BY ei.created_at DESC
    ");
    $stmt->execute([$user_id, $user_id, $event_id, $user_id]);
    $interested_fans = $stmt->fetchAll();
}

// 2. My Connections
$my_connections = $pdo->prepare("
    SELECT br.*, 
           CASE WHEN br.sender_id = ? THEN u2.full_name ELSE u1.full_name END as buddy_name,
           CASE WHEN br.sender_id = ? THEN u2.profile_image ELSE u1.profile_image END as buddy_image,
           CASE WHEN br.sender_id = ? THEN u2.location ELSE u1.location END as buddy_location,
           e.event_name, c.id as conversation_id
    FROM buddy_requests br
    JOIN users u1 ON br.sender_id = u1.id
    JOIN users u2 ON br.receiver_id = u2.id
    JOIN events e ON br.event_id = e.id
    LEFT JOIN conversations c ON (c.event_id = br.event_id AND c.conversation_type = 'DIRECT' AND c.id IN (
        SELECT conversation_id FROM conversation_members WHERE user_id = ?
    ))
    WHERE (br.sender_id = ? OR br.receiver_id = ?) AND br.status = 'ACCEPTED'
    ORDER BY br.responded_at DESC
");
$my_connections->execute([$user_id, $user_id, $user_id, $user_id, $user_id, $user_id]);
$connections = $my_connections->fetchAll();

// 3. Pending Incoming Requests
$pending_requests = $pdo->prepare("
    SELECT br.*, u.full_name as sender_name, u.profile_image, u.location, e.event_name
    FROM buddy_requests br
    JOIN users u ON br.sender_id = u.id
    JOIN events e ON br.event_id = e.id
    WHERE br.receiver_id = ? AND br.status = 'PENDING'
    ORDER BY br.created_at DESC
");
$pending_requests->execute([$user_id]);
$requests = $pending_requests->fetchAll();

// 4. Event Groups for selected event
$event_groups = [];
if ($event_id > 0) {
    $grpStmt = $pdo->prepare("
        SELECT g.*, u.full_name as creator_name,
               (SELECT COUNT(*) FROM event_group_members WHERE group_id = g.id AND status = 'ACTIVE') as member_count,
               (SELECT COUNT(*) FROM event_group_members WHERE group_id = g.id AND user_id = ? AND status = 'ACTIVE') as is_member,
               c.id as conversation_id
        FROM event_groups g
        JOIN users u ON g.created_by = u.id
        LEFT JOIN conversations c ON c.group_id = g.id
        WHERE g.event_id = ?
        ORDER BY g.created_at DESC
    ");
    $grpStmt->execute([$user_id, $event_id]);
    $event_groups = $grpStmt->fetchAll();
}
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-700 border border-pink-200">
                    <i class="fas fa-handshake me-1.5 text-pink-500"></i> Event Connection Module
                </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
                🤝 K-Sync Event Buddy ("Who's Going?")
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Connect safely with fellow K-Pop fans attending the same concert, fan meeting, or cupsleeve gathering in Malaysia.</p>
        </div>
        
        <!-- Event Filter Selector -->
        <form method="GET" action="buddies.php" class="flex items-center space-x-2 shrink-0">
            <select name="event_id" onchange="this.form.submit()" class="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white shadow-sm focus:ring-2 focus:ring-pink-500">
                <option value="0">-- Select Event to View "Who's Going?" --</option>
                <?php foreach ($events_list as $ev): ?>
                    <option value="<?= $ev['id'] ?>" <?= $event_id == $ev['id'] ? 'selected' : '' ?>>
                        <?= htmlspecialchars($ev['event_name']) ?> (<?= date('M d', strtotime($ev['event_date'])) ?> &bull; <?= htmlspecialchars($ev['city']) ?>)
                    </option>
                <?php endforeach; ?>
            </select>
        </form>
    </div>

    <!-- Active Event Notice -->
    <?php if ($selected_event): ?>
        <div class="p-5 mb-8 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
                <img src="<?= htmlspecialchars($selected_event['poster_image']) ?>" class="w-14 h-16 object-cover rounded-2xl border border-white/30 shrink-0">
                <div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white border border-white/30">
                        <?= htmlspecialchars($selected_event['artist_name'] ?? 'K-Pop Event') ?>
                    </span>
                    <h2 class="text-lg font-black text-white leading-tight mt-0.5"><?= htmlspecialchars($selected_event['event_name']) ?></h2>
                    <p class="text-xs text-pink-100 font-medium"><i class="far fa-calendar-alt me-1"></i> <?= date('F d, Y', strtotime($selected_event['event_date'])) ?> &bull; <i class="fas fa-location-dot me-1"></i> <?= htmlspecialchars($selected_event['venue_name']) ?></p>
                </div>
            </div>
            <a href="event-details.php?id=<?= $event_id ?>" class="px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-xs font-black shadow-md hover:bg-slate-100 transition flex items-center shrink-0">
                View Event Page <i class="fas fa-arrow-right ms-2"></i>
            </a>
        </div>
    <?php endif; ?>

    <!-- Navigation Tabs -->
    <div class="flex items-center space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
        <a href="buddies.php?event_id=<?= $event_id ?>&tab=discover" class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 <?= $active_tab === 'discover' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
            <i class="fas fa-users me-2"></i> Discover Interested Fans
        </a>
        <a href="buddies.php?event_id=<?= $event_id ?>&tab=groups" class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 <?= $active_tab === 'groups' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
            <i class="fas fa-user-group me-2"></i> Event Buddy Groups (Max 5)
        </a>
        <a href="buddies.php?event_id=<?= $event_id ?>&tab=connections" class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 <?= $active_tab === 'connections' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
            <i class="fas fa-comments me-2"></i> My Buddy Chats (<?= count($connections) ?>)
        </a>
        <a href="buddies.php?event_id=<?= $event_id ?>&tab=requests" class="px-5 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 relative <?= $active_tab === 'requests' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
            <i class="fas fa-envelope-open-text me-2"></i> Connection Requests
            <?php if (!empty($requests)): ?>
                <span class="ms-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-500 text-white"><?= count($requests) ?></span>
            <?php endif; ?>
        </a>
    </div>

    <!-- TAB 1: DISCOVER INTERESTED FANS -->
    <?php if ($active_tab === 'discover'): ?>
        <?php if ($event_id == 0): ?>
            <div class="glass-card p-10 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-4">
                <i class="fas fa-compass text-pink-500 text-4xl block"></i>
                <h3 class="text-base font-extrabold text-slate-800">Select an Event to View "Who's Going?"</h3>
                <p class="text-xs text-slate-500 max-w-md mx-auto">Please pick an event from the dropdown selector above to see fans who marked themselves as interested.</p>
            </div>
        <?php elseif (empty($interested_fans)): ?>
            <div class="glass-card p-10 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-4">
                <i class="fas fa-user-slash text-slate-400 text-4xl block"></i>
                <h3 class="text-base font-extrabold text-slate-800">No other fans listed yet for this event</h3>
                <p class="text-xs text-slate-500 max-w-md mx-auto">Be the first to click <strong>"I'm Interested"</strong> on the event page to show up in this event directory!</p>
            </div>
        <?php else: ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php foreach ($interested_fans as $fan): ?>
                    <div class="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 bg-white flex flex-col justify-between">
                        <div class="space-y-3">
                            <div class="flex items-center space-x-3.5">
                                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0 shadow-sm">
                                    <?php if (!empty($fan['profile_image'])): ?>
                                        <img src="<?= htmlspecialchars($fan['profile_image']) ?>" class="w-full h-full object-cover">
                                    <?php else: ?>
                                        <?= strtoupper(substr($fan['full_name'], 0, 1)) ?>
                                    <?php endif; ?>
                                </div>
                                <div>
                                    <h4 class="text-base font-extrabold text-slate-900 leading-tight"><?= htmlspecialchars($fan['full_name']) ?></h4>
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block mt-1">
                                        <i class="fas fa-location-dot me-1 text-pink-500"></i> <?= htmlspecialchars($fan['location'] ?: 'Malaysia') ?>
                                    </span>
                                </div>
                            </div>
                            <p class="text-xs text-slate-600 font-medium italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                &ldquo;<?= htmlspecialchars($fan['buddy_preference'] ?: 'Looking for event buddy for concert!') ?>&rdquo;
                            </p>
                        </div>

                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <?php if ($fan['connection_status'] === 'ACCEPTED'): ?>
                                <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 flex items-center">
                                    <i class="fas fa-check-circle me-1.5 text-emerald-600"></i> Connected
                                </span>
                            <?php elseif ($fan['connection_status'] === 'PENDING'): ?>
                                <span class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-100 text-amber-800 flex items-center">
                                    <i class="fas fa-clock me-1.5 text-amber-600"></i> Request Pending
                                </span>
                            <?php else: ?>
                                <button onclick="sendConnectRequest(<?= $event_id ?>, <?= $fan['id'] ?>)" class="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs shadow-md hover:opacity-95 transition flex items-center justify-center">
                                    <i class="fas fa-handshake me-2"></i> Connect for Event
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

    <!-- TAB 2: GROUPS -->
    <?php elseif ($active_tab === 'groups'): ?>
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-black text-slate-900">Event Buddy Groups (Max 5 Members)</h3>
            <?php if ($event_id > 0): ?>
                <button onclick="document.getElementById('createGroupModal').classList.remove('hidden')" class="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-extrabold shadow-md hover:bg-slate-800 transition">
                    <i class="fas fa-plus me-1.5 text-pink-400"></i> Create Event Group
                </button>
            <?php endif; ?>
        </div>

        <?php if (empty($event_groups)): ?>
            <div class="glass-card p-10 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-4">
                <i class="fas fa-users-viewfinder text-purple-500 text-4xl block"></i>
                <h3 class="text-base font-extrabold text-slate-800">No Small Groups Created Yet</h3>
                <p class="text-xs text-slate-500 max-w-md mx-auto">Create a small coordination group (up to 5 fans) for entrance meetups, train carpools, and fan banner projects.</p>
            </div>
        <?php else: ?>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <?php foreach ($event_groups as $grp): ?>
                    <div class="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm bg-white space-y-4">
                        <div class="flex items-start justify-between">
                            <div>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
                                    <i class="fas fa-users me-1"></i> Group (<?= $grp['member_count'] ?> / 5 Members)
                                </span>
                                <h4 class="text-lg font-black text-slate-900 mt-1"><?= htmlspecialchars($grp['group_name']) ?></h4>
                                <p class="text-xs text-slate-500 font-semibold">Created by <?= htmlspecialchars($grp['creator_name']) ?></p>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <?php if ($grp['is_member'] > 0): ?>
                                <a href="buddy-chat.php?conversation_id=<?= $grp['conversation_id'] ?>" class="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-md hover:bg-emerald-700 transition flex items-center">
                                    <i class="fas fa-comments me-2"></i> Open Group Chat
                                </a>
                            <?php elseif ($grp['member_count'] >= 5): ?>
                                <span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500">Group Full (5/5)</span>
                            <?php else: ?>
                                <button onclick="joinGroup(<?= $grp['id'] ?>)" class="px-4 py-2 rounded-2xl bg-pink-600 text-white text-xs font-extrabold shadow-md hover:bg-pink-700 transition">
                                    <i class="fas fa-user-plus me-1.5"></i> Join Group
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

    <!-- TAB 3: CONNECTIONS & CHATS -->
    <?php elseif ($active_tab === 'connections'): ?>
        <?php if (empty($connections)): ?>
            <div class="glass-card p-10 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-4">
                <i class="fas fa-comments text-slate-400 text-4xl block"></i>
                <h3 class="text-base font-extrabold text-slate-800">No Active Event Buddy Connections</h3>
                <p class="text-xs text-slate-500 max-w-md mx-auto">Discover fans attending the same event and send a connection request to unlock private event buddy chat.</p>
            </div>
        <?php else: ?>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <?php foreach ($connections as $conn): ?>
                    <div class="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm bg-white flex items-center justify-between">
                        <div class="flex items-center space-x-3.5">
                            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
                                <?php if (!empty($conn['buddy_image'])): ?>
                                    <img src="<?= htmlspecialchars($conn['buddy_image']) ?>" class="w-full h-full object-cover">
                                <?php else: ?>
                                    <?= strtoupper(substr($conn['buddy_name'], 0, 1)) ?>
                                <?php endif; ?>
                            </div>
                            <div>
                                <h4 class="text-base font-extrabold text-slate-900"><?= htmlspecialchars($conn['buddy_name']) ?></h4>
                                <p class="text-xs text-pink-600 font-bold"><i class="fas fa-ticket me-1"></i> <?= htmlspecialchars($conn['event_name']) ?></p>
                                <span class="text-[10px] text-slate-400 font-medium"><i class="fas fa-location-dot me-1"></i> <?= htmlspecialchars($conn['buddy_location'] ?: 'Malaysia') ?></span>
                            </div>
                        </div>
                        <a href="buddy-chat.php?conversation_id=<?= $conn['conversation_id'] ?>" class="px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-black shadow-md hover:bg-slate-800 transition flex items-center">
                            <i class="fas fa-paper-plane me-2 text-pink-400"></i> Open Chat
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

    <!-- TAB 4: REQUESTS -->
    <?php elseif ($active_tab === 'requests'): ?>
        <?php if (empty($requests)): ?>
            <div class="glass-card p-10 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-4">
                <i class="fas fa-envelope-open text-slate-400 text-4xl block"></i>
                <h3 class="text-base font-extrabold text-slate-800">No Pending Connection Requests</h3>
            </div>
        <?php else: ?>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <?php foreach ($requests as $req): ?>
                    <div class="glass-card p-6 rounded-3xl border border-pink-200 shadow-sm bg-white space-y-4">
                        <div class="flex items-center space-x-3.5">
                            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
                                <?= strtoupper(substr($req['sender_name'], 0, 1)) ?>
                            </div>
                            <div>
                                <h4 class="text-base font-extrabold text-slate-900"><?= htmlspecialchars($req['sender_name']) ?></h4>
                                <p class="text-xs text-pink-600 font-bold"><i class="fas fa-ticket me-1"></i> For: <?= htmlspecialchars($req['event_name']) ?></p>
                                <span class="text-[10px] text-slate-400 font-medium"><i class="fas fa-location-dot me-1"></i> <?= htmlspecialchars($req['location'] ?: 'Malaysia') ?></span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3 pt-2">
                            <button onclick="respondRequest(<?= $req['id'] ?>, 'accept')" class="flex-1 py-2.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 transition">
                                <i class="fas fa-check me-1.5"></i> Accept
                            </button>
                            <button onclick="respondRequest(<?= $req['id'] ?>, 'decline')" class="flex-1 py-2.5 rounded-2xl bg-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-300 transition">
                                <i class="fas fa-xmark me-1.5"></i> Decline
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    <?php endif; ?>
</div>

<!-- Modal: Create Event Group -->
<div id="createGroupModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
            <h3 class="text-base font-black text-slate-900 flex items-center">
                <i class="fas fa-users text-pink-500 me-2"></i> Create Event Buddy Group
            </h3>
            <button onclick="document.getElementById('createGroupModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600">
                <i class="fas fa-xmark text-lg"></i>
            </button>
        </div>
        <p class="text-xs text-slate-500">Groups are capped at <strong>5 members</strong> to keep coordination easy.</p>
        <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Group Name</label>
            <input type="text" id="group_name_input" placeholder="e.g. ATEEZ KL Entrance Meetup Group" class="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-pink-500">
        </div>
        <div class="flex justify-end space-x-2 pt-2">
            <button onclick="document.getElementById('createGroupModal').classList.add('hidden')" class="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold">Cancel</button>
            <button onclick="submitCreateGroup(<?= $event_id ?>)" class="px-5 py-2 rounded-2xl bg-pink-600 text-white text-xs font-extrabold shadow-md">Create Group</button>
        </div>
    </div>
</div>

<script>
function sendConnectRequest(eventId, receiverId) {
    const formData = new FormData();
    formData.append('action', 'send_request');
    formData.append('event_id', eventId);
    formData.append('receiver_id', receiverId);

    fetch('ajax/buddy_actions.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = 'login.php';
            return;
        }
        alert(data.message);
        if (data.success) location.reload();
    });
}

function respondRequest(requestId, status) {
    const action = status === 'accept' ? 'accept_request' : 'decline_request';
    const formData = new FormData();
    formData.append('action', action);
    formData.append('request_id', requestId);

    fetch('ajax/buddy_actions.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = 'login.php';
            return;
        }
        alert(data.message);
        if (data.success) location.reload();
    });
}

function submitCreateGroup(eventId) {
    const name = document.getElementById('group_name_input').value;
    if (!name) return alert('Please enter group name');

    const formData = new FormData();
    formData.append('action', 'create_group');
    formData.append('event_id', eventId);
    formData.append('group_name', name);

    fetch('ajax/buddy_actions.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = 'login.php';
            return;
        }
        alert(data.message);
        if (data.success) window.location.href = 'buddies.php?event_id=' + eventId + '&tab=groups';
    });
}

function joinGroup(groupId) {
    const formData = new FormData();
    formData.append('action', 'join_group');
    formData.append('group_id', groupId);

    fetch('ajax/buddy_actions.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = 'login.php';
            return;
        }
        alert(data.message);
        if (data.success) location.reload();
    });
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
