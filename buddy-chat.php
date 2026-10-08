<?php
// buddy-chat.php - Private & Small Group Event Buddy Chat Engine
$page_title = "Event Buddy Chat | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';
require_login();

$user_id = $current_user['id'];
$conversation_id = intval($_GET['conversation_id'] ?? 0);

if (!$conversation_id) {
    header("Location: {$base_url}/buddies.php");
    exit;
}

// Fetch conversation details & check membership
$stmt = $pdo->prepare("
    SELECT c.*, e.event_name, e.poster_image, g.group_name
    FROM conversations c
    JOIN events e ON c.event_id = e.id
    LEFT JOIN event_groups g ON c.group_id = g.id
    JOIN conversation_members cm ON c.id = cm.conversation_id
    WHERE c.id = ? AND cm.user_id = ?
");
$stmt->execute([$conversation_id, $user_id]);
$conv = $stmt->fetch();

if (!$conv) {
    set_flash_message('warning', 'Access denied to conversation.');
    header("Location: {$base_url}/buddies.php");
    exit;
}

// Fetch members of conversation
$members = $pdo->prepare("
    SELECT u.id, u.full_name, u.profile_image, u.location
    FROM conversation_members cm
    JOIN users u ON cm.user_id = u.id
    WHERE cm.conversation_id = ?
");
$members->execute([$conversation_id]);
$member_list = $members->fetchAll();

$other_user = null;
if ($conv['conversation_type'] === 'DIRECT') {
    foreach ($member_list as $m) {
        if ($m['id'] != $user_id) {
            $other_user = $m;
            break;
        }
    }
}
?>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Card -->
    <div class="glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-md mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
            <img src="<?= htmlspecialchars($conv['poster_image']) ?>" class="w-12 h-14 object-cover rounded-2xl border border-slate-200 shrink-0">
            <div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-700">
                    <i class="fas fa-handshake me-1"></i> <?= $conv['conversation_type'] === 'GROUP' ? 'Group Chat' : 'Direct Buddy Chat' ?>
                </span>
                <h1 class="text-lg font-black text-slate-900 mt-0.5">
                    <?= $conv['conversation_type'] === 'GROUP' ? htmlspecialchars($conv['group_name']) : htmlspecialchars($other_user['full_name'] ?? 'Event Buddy') ?>
                </h1>
                <p class="text-xs text-slate-500 font-medium"><i class="fas fa-ticket me-1 text-purple-500"></i> <?= htmlspecialchars($conv['event_name']) ?></p>
            </div>
        </div>

        <div class="flex items-center space-x-2 shrink-0">
            <?php if ($other_user): ?>
                <button onclick="openReportModal(<?= $other_user['id'] ?>, '<?= htmlspecialchars($other_user['full_name']) ?>')" class="px-3 py-2 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition">
                    <i class="fas fa-shield-cat me-1 text-rose-500"></i> Report User
                </button>
            <?php endif; ?>
            <a href="buddies.php?event_id=<?= $conv['event_id'] ?>" class="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition">
                Back to Directory
            </a>
        </div>
    </div>

    <!-- Live Chat Stream Box -->
    <div class="glass-card rounded-3xl border border-slate-200/80 bg-white shadow-lg overflow-hidden flex flex-col h-[520px]">
        <!-- Message Container -->
        <div id="buddyMessageStream" class="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            <div class="text-center text-xs text-slate-400 py-4 font-semibold">
                <i class="fas fa-lock me-1"></i> Messages are encrypted & restricted to this event.
            </div>
        </div>

        <!-- Input Box -->
        <div class="p-4 bg-white border-t border-slate-200/80">
            <form id="buddyMessageForm" onsubmit="sendBuddyMessage(event)" class="flex items-center space-x-3">
                <input type="text" id="buddy_message_input" autocomplete="off" placeholder="Type your message (e.g. 'Meet at entrance B at 4pm?')..." class="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none">
                <button type="submit" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs shadow-md hover:opacity-95 transition shrink-0 flex items-center">
                    <span>Send</span> <i class="fas fa-paper-plane ms-2"></i>
                </button>
            </form>
        </div>
    </div>
</div>

<!-- Modal: Safety Report User -->
<div id="reportUserModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
            <h3 class="text-base font-black text-rose-600 flex items-center">
                <i class="fas fa-triangle-exclamation me-2"></i> Report Safety Concern
            </h3>
            <button onclick="document.getElementById('reportUserModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600">
                <i class="fas fa-xmark text-lg"></i>
            </button>
        </div>
        <p class="text-xs text-slate-500">Submit a safety report regarding <strong id="reportTargetName" class="text-slate-900"></strong>. Admin will review the report.</p>
        <input type="hidden" id="reportTargetId">
        <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Reason</label>
            <select id="reportReason" class="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium">
                <option value="Spam / Commercial Ads">Spam / Commercial Ads</option>
                <option value="Harassment / Unwanted Messages">Harassment / Unwanted Messages</option>
                <option value="Scam / Fake Ticket Selling">Scam / Fake Ticket Selling</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Details (Optional)</label>
            <textarea id="reportDescription" rows="3" placeholder="Provide extra details for admin..." class="w-full px-4 py-2 rounded-2xl border border-slate-200 text-xs font-medium"></textarea>
        </div>
        <div class="flex justify-end space-x-2 pt-2">
            <button onclick="document.getElementById('reportUserModal').classList.add('hidden')" class="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold">Cancel</button>
            <button onclick="submitUserReport()" class="px-5 py-2 rounded-2xl bg-rose-600 text-white text-xs font-extrabold shadow-md">Submit Report</button>
        </div>
    </div>
</div>

<script>
const conversationId = <?= $conversation_id ?>;
const currentUserId = <?= $user_id ?>;

function fetchBuddyMessages() {
    fetch('ajax/buddy_actions.php?action=get_buddy_messages&conversation_id=' + conversationId)
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;
        const stream = document.getElementById('buddyMessageStream');
        let html = '';
        data.messages.forEach(m => {
            const isMe = m.sender_id == currentUserId;
            html += `
                <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1">
                    <span class="text-[10px] font-bold ${isMe ? 'text-pink-600' : 'text-slate-500'} px-1">${m.sender_name}</span>
                    <div class="max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-medium shadow-sm ${isMe ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'}">
                        ${escapeHtml(m.message_text)}
                    </div>
                </div>
            `;
        });
        stream.innerHTML = html;
        stream.scrollTop = stream.scrollHeight;
    });
}

function sendBuddyMessage(e) {
    e.preventDefault();
    const input = document.getElementById('buddy_message_input');
    const text = input.value.trim();
    if (!text) return;

    const formData = new FormData();
    formData.append('action', 'send_buddy_message');
    formData.append('conversation_id', conversationId);
    formData.append('message_text', text);

    fetch('ajax/buddy_actions.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            input.value = '';
            fetchBuddyMessages();
        } else {
            alert(data.message);
        }
    });
}

function openReportModal(userId, name) {
    document.getElementById('reportTargetId').value = userId;
    document.getElementById('reportTargetName').innerText = name;
    document.getElementById('reportUserModal').classList.remove('hidden');
}

function submitUserReport() {
    const targetId = document.getElementById('reportTargetId').value;
    const reason = document.getElementById('reportReason').value;
    const desc = document.getElementById('reportDescription').value;

    const formData = new FormData();
    formData.append('action', 'report_user');
    formData.append('reported_user_id', targetId);
    formData.append('event_id', <?= $conv['event_id'] ?>);
    formData.append('reason', reason);
    formData.append('description', desc);

    fetch('ajax/buddy_actions.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById('reportUserModal').classList.add('hidden');
    });
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

setInterval(fetchBuddyMessages, 4000);
fetchBuddyMessages();
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
