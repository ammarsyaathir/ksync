<?php
// includes/footer.php - Shared Light Page Footer
?>
</main> <!-- End Main -->

<footer class="bg-white border-t border-slate-200 mt-20 text-slate-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <!-- Brand Column -->
            <div class="md:col-span-1 space-y-4">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                        <i class="fas fa-bolt"></i>
                    </div>
                    <span class="text-xl font-black text-slate-900 tracking-wider">K-SYNC MY</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                    Malaysia's premier centralized K-Pop event discovery platform. Helping fans find concerts, fan meetings, cupsleeve gatherings, and pop-up events without searching through scattered social media posts.
                </p>
                <div class="flex space-x-3 text-slate-500 pt-2">
                    <a href="#" class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:text-pink-600 hover:border-pink-300 transition-colors"><i class="fab fa-twitter text-xs"></i></a>
                    <a href="#" class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:text-pink-600 hover:border-pink-300 transition-colors"><i class="fab fa-instagram text-xs"></i></a>
                    <a href="#" class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:text-pink-600 hover:border-pink-300 transition-colors"><i class="fab fa-tiktok text-xs"></i></a>
                </div>
            </div>

            <!-- Quick Links -->
            <div>
                <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Quick Navigation</h4>
                <ul class="space-y-2 text-xs font-medium">
                    <li><a href="<?= $base_url ?>/index.php" class="hover:text-pink-600 transition-colors">Home Page</a></li>
                    <li><a href="<?= $base_url ?>/events.php" class="hover:text-pink-600 transition-colors">Discover Events</a></li>
                    <li><a href="<?= $base_url ?>/events.php?category=concert" class="hover:text-pink-600 transition-colors">K-Pop Concerts</a></li>
                    <li><a href="<?= $base_url ?>/events.php?category=fan-meeting" class="hover:text-pink-600 transition-colors">Fan Meetings</a></li>
                    <li><a href="<?= $base_url ?>/events.php?category=cupsleeve-event" class="hover:text-pink-600 transition-colors">Cupsleeve Events</a></li>
                </ul>
            </div>

            <!-- Event Organizers -->
            <div>
                <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Organizers & Hosts</h4>
                <ul class="space-y-2 text-xs font-medium">
                    <li><a href="<?= $base_url ?>/organizer/submit-event.php" class="hover:text-pink-600 transition-colors">Submit K-Pop Event</a></li>
                    <li><a href="<?= $base_url ?>/organizer/dashboard.php" class="hover:text-pink-600 transition-colors">Organizer Dashboard</a></li>
                    <li><a href="<?= $base_url ?>/organizer/my-events.php" class="hover:text-pink-600 transition-colors">Event Verification Status</a></li>
                    <li><a href="<?= $base_url ?>/register.php?role=organizer" class="hover:text-pink-600 transition-colors">Register as Organizer</a></li>
                </ul>
            </div>

            <!-- Strict Scope Notice -->
            <div>
                <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">System Purpose</h4>
                <div class="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-xs text-slate-600 space-y-2">
                    <p class="font-bold text-pink-700 flex items-center"><i class="fas fa-shield-halved text-pink-500 me-1.5"></i> Information Platform Only</p>
                    <p>K-Sync Malaysia is strictly an Event Information and Event Discovery platform. We do not process tickets, payments, online shopping, or merchandise orders.</p>
                </div>
            </div>
        </div>

        <div class="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; <?= date('Y') ?> K-Sync Malaysia. All rights reserved.</p>
            <p class="mt-2 sm:mt-0 flex items-center font-medium">
                <span>Made with <i class="fas fa-heart text-rose-500 mx-1"></i> for Malaysian K-Pop Fans</span>
            </p>
        </div>
    </div>
</footer>

<!-- Global Social Share Modal -->
<div id="share-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center hidden p-4 animate-fade-in">
    <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-900 flex items-center">
                <i class="fas fa-share-nodes text-pink-500 me-2"></i> Share Event
            </h3>
            <button onclick="closeShareModal()" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer text-lg">
                <i class="fas fa-xmark"></i>
            </button>
        </div>
        <p id="share-modal-title" class="text-xs font-semibold text-slate-700 mb-4 line-clamp-2 bg-slate-50 p-3 rounded-2xl border border-slate-100"></p>
        
        <div class="grid grid-cols-2 gap-3 mb-4">
            <button onclick="shareToPlatform('whatsapp')" class="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-200 cursor-pointer transition-colors">
                <i class="fab fa-whatsapp text-lg text-emerald-600"></i>
                <span>WhatsApp</span>
            </button>
            <button onclick="shareToPlatform('twitter')" class="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-200 cursor-pointer transition-colors">
                <i class="fab fa-x-twitter text-lg text-slate-900"></i>
                <span>X (Twitter)</span>
            </button>
            <button onclick="shareToPlatform('facebook')" class="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center space-x-2 border border-indigo-200 cursor-pointer transition-colors">
                <i class="fab fa-facebook text-lg text-indigo-600"></i>
                <span>Facebook</span>
            </button>
            <button onclick="shareToPlatform('telegram')" class="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center space-x-2 border border-blue-200 cursor-pointer transition-colors">
                <i class="fab fa-telegram text-lg text-blue-500"></i>
                <span>Telegram</span>
            </button>
        </div>

        <div class="pt-2 border-t border-slate-100">
            <button onclick="copyShareLink()" class="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm cursor-pointer transition-all">
                <i class="fas fa-link text-pink-400"></i>
                <span id="copy-link-btn-text">Copy Event Link</span>
            </button>
        </div>
    </div>
</div>

<script>
let currentShareTitle = '';
let currentShareUrl = '';

function openShareModal(eventTitle, eventUrl) {
    currentShareTitle = eventTitle;
    currentShareUrl = eventUrl || window.location.href;
    document.getElementById('share-modal-title').textContent = eventTitle;
    document.getElementById('share-modal').classList.remove('hidden');
}

function closeShareModal() {
    document.getElementById('share-modal').classList.add('hidden');
}

function shareToPlatform(platform) {
    const encodedUrl = encodeURIComponent(currentShareUrl);
    const encodedText = encodeURIComponent('Check out this K-Pop event in Malaysia: ' + currentShareTitle);
    let target = '';

    switch(platform) {
        case 'whatsapp': target = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`; break;
        case 'twitter': target = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`; break;
        case 'facebook': target = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break;
        case 'telegram': target = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`; break;
    }
    if (target) window.open(target, '_blank');
}

function copyShareLink() {
    navigator.clipboard.writeText(currentShareUrl).then(() => {
        const btnText = document.getElementById('copy-link-btn-text');
        btnText.textContent = 'Link Copied!';
        setTimeout(() => { btnText.textContent = 'Copy Event Link'; }, 2000);
    });
}

// Add to Google Calendar Helper
function addToCalendar(title, dateStr, startTime, endTime, venue, address) {
    const startIso = (dateStr + 'T' + (startTime || '10:00:00')).replace(/[-:]/g, '');
    const endIso = (dateStr + 'T' + (endTime || startTime || '13:00:00')).replace(/[-:]/g, '');
    const details = encodeURIComponent('K-Pop Event discovered on K-Sync Malaysia: ' + window.location.href);
    const location = encodeURIComponent(venue + ', ' + address);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(calendarUrl, '_blank');
}

// Save / Unsave Event via AJAX
function toggleSaveEvent(eventId, buttonElement) {
    fetch('<?= $base_url ?>/ajax/save_event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'event_id=' + encodeURIComponent(eventId)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'unauthorized') {
            window.location.href = '<?= $base_url ?>/login.php';
            return;
        }
        if (data.status === 'saved') {
            buttonElement.classList.remove('bg-white/90', 'text-slate-600');
            buttonElement.classList.add('bg-rose-500', 'text-white', 'border-rose-500');
        } else if (data.status === 'removed') {
            buttonElement.classList.remove('bg-rose-500', 'text-white', 'border-rose-500');
            buttonElement.classList.add('bg-white/90', 'text-slate-600');
        }
    })
    .catch(err => console.error('Error saving event:', err));
}

// User Menu Profile Popover Toggle
function toggleUserDropdown(event) {
    if (event) event.stopPropagation();
    const userDropdown = document.getElementById('user-menu-dropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('hidden');
    }
}

// Notification Popover JavaScript Engine
let cachedNotifications = [];
let activePopoverCategory = 'all';

function toggleNotificationPopover(event) {
    if (event) event.stopPropagation();
    const popover = document.getElementById('notification-popover');
    if (!popover) return;

    if (popover.classList.contains('hidden')) {
        popover.classList.remove('hidden');
        loadNotificationsPopover();
    } else {
        popover.classList.add('hidden');
    }
}

// Close popovers when clicking outside
document.addEventListener('click', function(e) {
    const popover = document.getElementById('notification-popover');
    const wrapper = document.getElementById('notification-popover-wrapper');
    if (popover && !popover.classList.contains('hidden') && wrapper && !wrapper.contains(e.target)) {
        popover.classList.add('hidden');
    }

    const userDropdown = document.getElementById('user-menu-dropdown');
    const userWrapper = document.getElementById('user-menu-wrapper');
    if (userDropdown && !userDropdown.classList.contains('hidden') && userWrapper && !userWrapper.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
});

function loadNotificationsPopover() {
    const listContainer = document.getElementById('popover-notif-list');
    if (!listContainer) return;

    fetch('<?= $base_url ?>/ajax/get_notifications.php')
    .then(r => r.json())
    .then(data => {
        if (data.status === 'success') {
            cachedNotifications = data.notifications;
            updateUnreadBadge(data.unread_count);
            renderPopoverNotifications();
        }
    });
}

function updateUnreadBadge(count) {
    const badge = document.getElementById('nav-unread-badge');
    const popoverCount = document.getElementById('popover-unread-count');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
    if (popoverCount) popoverCount.textContent = count + ' unread';
}

function filterPopoverNotifications(category) {
    activePopoverCategory = category;
    ['all', 'announcements', 'system'].forEach(c => {
        const btn = document.getElementById('tab-' + c);
        if (btn) {
            if (c === category) {
                btn.className = 'px-3 py-1 rounded-full bg-slate-900 text-white cursor-pointer transition-colors';
            } else {
                btn.className = 'px-3 py-1 rounded-full text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors';
            }
        }
    });
    renderPopoverNotifications();
}

function renderPopoverNotifications() {
    const listContainer = document.getElementById('popover-notif-list');
    if (!listContainer) return;

    let filtered = cachedNotifications;
    if (activePopoverCategory !== 'all') {
        filtered = cachedNotifications.filter(n => n.category === activePopoverCategory);
    }

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="p-8 text-center text-slate-400">
                <i class="far fa-bell-slash text-2xl mb-2 text-slate-300 block"></i>
                <p class="font-medium text-xs">No notifications in this tab</p>
            </div>`;
        return;
    }

    listContainer.innerHTML = filtered.map(n => `
        <div onclick="clickNotificationItem(${n.id}, ${n.event_id})" 
             class="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-start space-x-3 relative ${!n.is_read ? 'bg-pink-50/40' : ''}">
            <img src="${n.poster_image}" class="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200">
            <div class="flex-grow min-w-0">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 truncate">${n.event_name}</span>
                    <span class="text-[10px] text-slate-400 font-medium shrink-0 ml-1">${n.time_ago}</span>
                </div>
                <p class="text-xs text-slate-600 line-clamp-2 mt-0.5">${n.message}</p>
            </div>
            ${!n.is_read ? '<span class="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0 self-center"></span>' : ''}
        </div>
    `).join('');
}

function clickNotificationItem(notifId, eventId) {
    fetch('<?= $base_url ?>/ajax/mark_notification.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'notification_id=' + notifId
    }).then(() => {
        if (eventId) {
            window.location.href = '<?= $base_url ?>/event-details.php?id=' + eventId;
        } else {
            loadNotificationsPopover();
        }
    });
}

function markAllNotificationsReadPopover() {
    fetch('<?= $base_url ?>/ajax/mark_notification.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'mark_all=1'
    }).then(() => loadNotificationsPopover());
}

function clearAllNotificationsPopover() {
    fetch('<?= $base_url ?>/ajax/clear_notifications.php', {
        method: 'POST'
    }).then(() => loadNotificationsPopover());
}
</script>
</body>
</html>
