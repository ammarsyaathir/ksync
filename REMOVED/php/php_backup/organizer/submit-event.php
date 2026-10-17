<?php
// organizer/submit-event.php - Submit K-Pop Event Form (Enhanced Design)

$page_title = "Submit K-Pop Event | K-Sync Malaysia";
require_once __DIR__ . '/../includes/header.php';
require_role('organizer');

$error = '';
$artists = $pdo->query("SELECT * FROM artists ORDER BY name ASC")->fetchAll();
$categories = $pdo->query("SELECT * FROM event_categories ORDER BY name ASC")->fetchAll();
$venues = $pdo->query("SELECT * FROM venues ORDER BY name ASC")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_name = trim($_POST['event_name'] ?? '');
    $artist_id = intval($_POST['artist_id'] ?? 0);
    $category_id = intval($_POST['category_id'] ?? 0);
    $venue_id = intval($_POST['venue_id'] ?? 0);
    
    $event_date = trim($_POST['event_date'] ?? '');
    $start_time = trim($_POST['start_time'] ?? '');
    $end_time = trim($_POST['end_time'] ?? '');
    
    $venue_name = trim($_POST['venue_name'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $state = trim($_POST['state'] ?? '');
    
    $description = trim($_POST['description'] ?? '');
    $ticket_info = trim($_POST['ticket_info'] ?? '');
    $event_rules = trim($_POST['event_rules'] ?? '');
    $official_url = trim($_POST['official_url'] ?? '');
    $poster_image = trim($_POST['poster_image'] ?? '');

    if (empty($poster_image)) {
        $poster_image = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop';
    }

    if (empty($event_name) || empty($category_id) || empty($event_date) || empty($start_time) || empty($venue_name) || empty($city)) {
        $error = "Please fill in all mandatory fields (Event Name, Category, Date, Start Time, Venue Name, City).";
    } else {
        $stmt = $pdo->prepare("INSERT INTO events (
            organizer_id, artist_id, category_id, venue_id,
            event_name, description, event_date, start_time, end_time,
            venue_name, address, city, state, ticket_info, event_rules, official_url,
            poster_image, event_status, verification_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UPCOMING', 'VERIFIED')");

        $stmt->execute([
            $current_user['id'],
            $artist_id ?: null,
            $category_id,
            $venue_id ?: null,
            $event_name,
            $description,
            $event_date,
            $start_time,
            $end_time ?: null,
            $venue_name,
            $address,
            $city,
            $state,
            $ticket_info,
            $event_rules,
            $official_url,
            $poster_image
        ]);

        $new_event_id = $pdo->lastInsertId();
        log_activity($current_user['id'], 'SUBMIT_EVENT', 'events', $new_event_id, "Organizer published event '{$event_name}' live");

        set_flash_message('success', "Event '{$event_name}' submitted and published live immediately! Fans can now discover your event.");
        header("Location: {$base_url}/organizer/my-events.php");
        exit;
    }
}
?>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80">
        <div class="flex items-center space-x-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                <i class="fas fa-paper-plane me-1.5 text-pink-500"></i> Event Submission Form
            </span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            Submit K-Pop Event
        </h1>
        <p class="text-slate-600 text-sm mt-1 font-medium">Publish your concert, fan meeting, cupsleeve gathering, or pop-up event directly to the platform.</p>
    </div>

    <!-- Clear Workflow Helper Notice -->
    <div class="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3 shadow-sm">
        <i class="fas fa-circle-check text-emerald-600 text-base mt-0.5 shrink-0"></i>
        <div class="font-semibold leading-relaxed">
            <strong>Instant Publishing:</strong> Your event will be published live immediately! Verified Fanclubs automatically display the <span class="text-emerald-700 font-extrabold"><i class="fas fa-certificate text-emerald-500"></i> Verified Fanclub</span> badge on event listings.
        </div>
    </div>

    <!-- Gemini AI Auto-Fill Assistant Card -->
    <div class="mb-8 p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-purple-500/30">
        <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
        <div class="relative z-10 space-y-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="w-8 h-8 rounded-xl bg-purple-500/30 text-purple-300 border border-purple-400/30 flex items-center justify-center text-sm shadow-inner">
                        <i class="fas fa-wand-magic-sparkles text-pink-400"></i>
                    </span>
                    <div>
                        <h3 class="text-base font-bold text-white flex items-center">
                            Gemini AI Form Auto-Fill
                        </h3>
                        <p class="text-xs text-slate-300 font-medium">Paste event poster image URL or announcement caption text to extract event details.</p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                    Gemini 1.5 Flash Active
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" id="ai-poster-url" placeholder="Paste Poster Image URL (e.g. https://.../poster.jpg)" 
                       class="w-full bg-white/10 text-white placeholder-slate-400 px-4 py-2.5 rounded-2xl border border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium">
                <textarea id="ai-caption-text" rows="1" placeholder="Or paste event announcement caption text..." 
                          class="w-full bg-white/10 text-white placeholder-slate-400 px-4 py-2.5 rounded-2xl border border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"></textarea>
            </div>

            <div class="flex items-center justify-between pt-1">
                <div id="ai-status-msg" class="text-xs font-semibold text-purple-200 hidden flex items-center">
                    <i class="fas fa-spinner fa-spin me-2 text-pink-400"></i> AI scanning details & populating form...
                </div>
                <button type="button" onclick="runGeminiAiAutofill()" id="btn-ai-autofill"
                        class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center shrink-0 cursor-pointer ml-auto">
                    <i class="fas fa-wand-magic-sparkles me-2 text-pink-200"></i> Auto-Fill Form with Gemini AI
                </button>
            </div>
        </div>
    </div>

    <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <?php if ($error): ?>
            <div class="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <i class="fas fa-triangle-exclamation me-1.5"></i> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="" class="space-y-6">
            <!-- Event Basic Info -->
            <div class="space-y-4">
                <h3 class="text-sm font-black text-pink-600 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center">
                    <i class="fas fa-id-card me-2"></i> 1. Basic Information
                </h3>
                
                <div>
                    <label class="block text-xs font-extrabold text-slate-700 mb-1">Event Name *</label>
                    <input type="text" name="event_name" required placeholder="e.g. SEVENTEEN World Tour in KL"
                           class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <p class="text-[11px] text-slate-400 font-semibold mt-1"><i class="fas fa-circle-question me-1"></i> Enter the official title of the event.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-microphone-lines text-pink-500 me-1"></i> Featured K-Pop Artist / Group</label>
                        <select name="artist_id" class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            <option value="">Select Artist / Group (Optional)</option>
                            <?php foreach ($artists as $a): ?>
                                <option value="<?= $a['id'] ?>"><?= htmlspecialchars($a['name']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-layer-group text-purple-500 me-1"></i> Event Category *</label>
                        <select name="category_id" required class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                            <option value="">Select Event Category</option>
                            <?php foreach ($categories as $c): ?>
                                <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['name']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Schedule -->
            <div class="space-y-4">
                <h3 class="text-sm font-black text-purple-600 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center">
                    <i class="far fa-calendar-alt me-2"></i> 2. Schedule & Date
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="far fa-calendar me-1 text-pink-500"></i> Event Date *</label>
                        <input type="date" name="event_date" required
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="far fa-clock me-1 text-purple-500"></i> Start Time *</label>
                        <input type="time" name="start_time" required
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="far fa-hourglass me-1 text-slate-400"></i> End Time (Optional)</label>
                        <input type="time" name="end_time"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                    </div>
                </div>
            </div>

            <!-- Venue & Location -->
            <div class="space-y-4">
                <h3 class="text-sm font-black text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center">
                    <i class="fas fa-location-dot me-2"></i> 3. Venue & Location
                </h3>

                <div>
                    <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-bolt text-amber-500 me-1"></i> Quick Select Saved Venue (Optional)</label>
                    <select onchange="populateVenue(this)" class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                        <option value="">-- Or enter custom venue below --</option>
                        <?php foreach ($venues as $v): ?>
                            <option value='<?= json_encode($v) ?>'><?= htmlspecialchars($v['name']) ?> (<?= htmlspecialchars($v['city']) ?>)</option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1">Venue Name *</label>
                        <input type="text" id="v_name" name="venue_name" required placeholder="e.g. Axiata Arena Bukit Jalil"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1">Full Address</label>
                        <input type="text" id="v_addr" name="address" placeholder="e.g. Loke Yew St, Bukit Jalil"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1">City *</label>
                        <input type="text" id="v_city" name="city" required placeholder="e.g. Kuala Lumpur"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1">State</label>
                        <input type="text" id="v_state" name="state" placeholder="e.g. W.P. Kuala Lumpur"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold">
                    </div>
                </div>
            </div>

            <!-- Description, Ticket Info & Rules -->
            <div class="space-y-4">
                <h3 class="text-sm font-black text-rose-600 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center">
                    <i class="fas fa-align-left me-2"></i> 4. Event Details & Guidelines
                </h3>

                <div>
                    <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-file-lines text-pink-500 me-1"></i> Description</label>
                    <textarea name="description" rows="4" placeholder="Provide full details about this event..."
                              class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-ticket text-amber-500 me-1"></i> Ticket Information</label>
                    <textarea name="ticket_info" rows="2" placeholder="e.g. VIP: RM888 | CAT 1: RM688 | Tickets via GoLive Asia"
                              class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-clipboard-list text-rose-500 me-1"></i> Event Rules & Safety Guidelines</label>
                    <textarea name="event_rules" rows="2" placeholder="e.g. Lightsticks allowed. No DSLR cameras allowed."
                              class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-link text-indigo-500 me-1"></i> Official Event Source URL</label>
                        <input type="url" name="official_url" placeholder="https://official-announcement.com"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1"><i class="fas fa-image text-emerald-500 me-1"></i> Event Poster Image URL</label>
                        <input type="url" name="poster_image" placeholder="https://image-url.com/poster.jpg"
                               class="w-full bg-slate-50 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium">
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <a href="<?= $base_url ?>/organizer/my-events.php" class="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs">Cancel</a>
                <button type="submit" class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm shadow-md shadow-pink-500/25 transition-all transform hover:-translate-y-0.5">
                    Submit Event for Review
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function populateVenue(selectElement) {
    if (!selectElement.value) return;
    const v = JSON.parse(selectElement.value);
    document.getElementById('v_name').value = v.name || '';
    document.getElementById('v_addr').value = v.address || '';
    document.getElementById('v_city').value = v.city || '';
    document.getElementById('v_state').value = v.state || '';
}

function runGeminiAiAutofill() {
    const posterUrl = document.getElementById('ai-poster-url').value.trim();
    const captionText = document.getElementById('ai-caption-text').value.trim();
    const statusMsg = document.getElementById('ai-status-msg');
    const btn = document.getElementById('btn-ai-autofill');

    if (!posterUrl && !captionText) {
        alert('Please paste a poster image URL or announcement text caption to run AI Auto-Fill.');
        return;
    }

    statusMsg.classList.remove('hidden');
    statusMsg.innerHTML = '<i class="fas fa-spinner fa-spin me-2 text-pink-400"></i> AI scanning details & populating form...';
    btn.disabled = true;
    btn.classList.add('opacity-50');

    fetch('<?= $base_url ?>/ajax/ai_extract_poster.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'poster_url=' + encodeURIComponent(posterUrl) + '&caption_text=' + encodeURIComponent(captionText)
    })
    .then(r => r.json())
    .then(data => {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        
        if (data.status === 'success' && data.extracted) {
            const ex = data.extracted;
            
            if (ex.event_name) document.querySelector('input[name="event_name"]').value = ex.event_name;
            if (ex.artist_id) document.querySelector('select[name="artist_id"]').value = ex.artist_id;
            if (ex.category_id) document.querySelector('select[name="category_id"]').value = ex.category_id;
            if (ex.event_date) document.querySelector('input[name="event_date"]').value = ex.event_date;
            if (ex.start_time) document.querySelector('input[name="start_time"]').value = ex.start_time;
            if (ex.end_time) document.querySelector('input[name="end_time"]').value = ex.end_time;
            
            if (ex.venue_name) document.getElementById('v_name').value = ex.venue_name;
            if (ex.address) document.getElementById('v_addr').value = ex.address;
            if (ex.city) document.getElementById('v_city').value = ex.city;
            if (ex.state) document.getElementById('v_state').value = ex.state;
            
            if (ex.ticket_info) document.querySelector('textarea[name="ticket_info"]').value = ex.ticket_info;
            if (ex.event_rules) document.querySelector('textarea[name="event_rules"]').value = ex.event_rules;
            if (ex.description) document.querySelector('textarea[name="description"]').value = ex.description;
            if (posterUrl) document.querySelector('input[name="poster_image"]').value = posterUrl;

            statusMsg.innerHTML = '<i class="fas fa-circle-check text-emerald-400 me-2"></i> Form auto-filled by Gemini AI!';
        } else {
            statusMsg.innerHTML = '<i class="fas fa-triangle-exclamation text-rose-400 me-2"></i> ' + (data.message || 'AI extraction failed.');
        }
    })
    .catch(err => {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        statusMsg.innerHTML = '<i class="fas fa-triangle-exclamation text-rose-400 me-2"></i> Connection error.';
    });
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
