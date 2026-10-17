<?php
// includes/navbar.php - Standardized Navigation Bar with Active Page Highlight
$user_role = strtolower($current_user['role_name'] ?? '');
$active_script = basename($_SERVER['SCRIPT_NAME'] ?? '');
?>
<nav class="sticky top-0 z-50 glass-nav shadow-sm border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <!-- Brand Logo -->
            <div class="flex items-center space-x-3">
                <a href="<?= $base_url ?>/index.php" class="flex items-center space-x-2.5 cursor-pointer">
                    <div class="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-base shadow-sm">
                        <i class="fas fa-bolt"></i>
                    </div>
                    <div class="flex items-center space-x-1.5">
                        <span class="text-xl font-bold tracking-tight text-slate-900">K-SYNC</span>
                        <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-900 text-white uppercase">MY</span>
                        <?php if ($user_role === 'organizer'): ?>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ms-1">ORGANIZER</span>
                        <?php endif; ?>
                    </div>
                </a>
            </div>

            <!-- Desktop Navigation Links with Active Tab Highlight -->
            <div class="hidden md:flex items-center space-x-1">
                <?php if ($user_role === 'organizer'): ?>
                    <!-- ORGANIZER NAVIGATION -->
                    <a href="<?= $base_url ?>/index.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer <?= $active_script === 'index.php' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100' ?>">
                        <span>Home</span>
                    </a>
                    <a href="<?= $base_url ?>/events.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer <?= ($active_script === 'events.php' && strpos($_SERVER['SCRIPT_NAME'], '/admin/') === false) ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100' ?>">
                        <i class="fas fa-compass text-xs"></i>
                        <span>Discover Events</span>
                    </a>
                    <a href="<?= $base_url ?>/organizer/dashboard.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer <?= ($active_script === 'dashboard.php' && strpos($_SERVER['SCRIPT_NAME'], '/organizer/') !== false) ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100' ?>">
                        <i class="fas fa-chart-line text-xs"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="<?= $base_url ?>/organizer/my-events.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer <?= $active_script === 'my-events.php' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100' ?>">
                        <i class="fas fa-list-check text-xs"></i>
                        <span>My Events</span>
                    </a>
                    <a href="<?= $base_url ?>/organizer/submit-event.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 cursor-pointer <?= $active_script === 'submit-event.php' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-800 hover:bg-slate-200' ?>">
                        <i class="fas fa-plus text-xs me-1"></i>
                        <span>Submit Event</span>
                    </a>

                <?php else: ?>
                    <!-- FAN & GUEST NAVIGATION -->
                    <a href="<?= $base_url ?>/index.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer <?= $active_script === 'index.php' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100' ?>">
                        <span>Home</span>
                    </a>
                    <a href="<?= $base_url ?>/events.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer <?= $active_script === 'events.php' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100' ?>">
                        <i class="fas fa-compass text-xs"></i>
                        <span>Discover Events</span>
                    </a>
                    <a href="<?= $base_url ?>/buddies.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer <?= $active_script === 'buddies.php' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100' ?>">
                        <i class="fas fa-handshake text-xs text-pink-500"></i>
                        <span>Event Buddy</span>
                    </a>
                    <a href="<?= $base_url ?>/submit-event.php" class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 cursor-pointer <?= $active_script === 'submit-event.php' ? 'bg-slate-900 text-white shadow-sm' : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200' ?>">
                        <i class="fas fa-paper-plane text-xs me-1"></i>
                        <span>Submit Event</span>
                    </a>

                    <?php if (is_logged_in()): ?>
                        <!-- Notification Bell with Interactive Popover -->
                        <div class="relative text-left" id="notification-popover-wrapper">
                            <button onclick="toggleNotificationPopover(event)" 
                                    class="relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer <?= $active_script === 'notifications.php' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100' ?>">
                                <i class="fas fa-bell text-xs"></i>
                                <span>Notifications</span>
                                <span id="nav-unread-badge" class="<?= $unread_count > 0 ? '' : 'hidden' ?> absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm">
                                    <?= $unread_count ?>
                                </span>
                            </button>

                            <!-- Floating Notification Dropdown Popover Panel -->
                            <div id="notification-popover" 
                                 class="hidden absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-fade-in text-slate-900">
                                
                                <!-- Popover Header -->
                                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div class="flex items-center space-x-2">
                                        <h3 class="text-base font-bold text-slate-900">Notifications</h3>
                                        <span id="popover-unread-count" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700">
                                            <?= $unread_count ?> unread
                                        </span>
                                    </div>
                                    <button onclick="toggleNotificationPopover(event)" class="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1">
                                        <i class="fas fa-xmark"></i>
                                    </button>
                                </div>

                                <!-- Popover Category Tabs -->
                                <div class="px-4 py-2 border-b border-slate-100 bg-white flex items-center space-x-2 text-xs font-semibold">
                                    <button onclick="filterPopoverNotifications('all')" id="tab-all" class="px-3 py-1 rounded-full bg-slate-900 text-white cursor-pointer transition-colors">
                                        View all
                                    </button>
                                    <button onclick="filterPopoverNotifications('announcements')" id="tab-announcements" class="px-3 py-1 rounded-full text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                                        Announcements
                                    </button>
                                    <button onclick="filterPopoverNotifications('system')" id="tab-system" class="px-3 py-1 rounded-full text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                                        System Alerts
                                    </button>
                                </div>

                                <!-- Popover Body (Notification List) -->
                                <div id="popover-notif-list" class="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                                    <div class="p-6 text-center text-slate-400 font-medium">
                                        <i class="fas fa-spinner fa-spin text-lg mb-2 text-pink-500 block"></i> Loading notifications...
                                    </div>
                                </div>

                                <!-- Popover Footer Actions -->
                                <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <div class="flex items-center space-x-2">
                                        <button onclick="markAllNotificationsReadPopover()" class="text-slate-700 hover:text-pink-600 font-bold flex items-center cursor-pointer">
                                            <i class="fas fa-check-double text-emerald-500 me-1"></i> Mark all as read
                                        </button>
                                        <span class="text-slate-300">|</span>
                                        <button onclick="clearAllNotificationsPopover()" class="text-rose-600 hover:text-rose-700 font-bold flex items-center cursor-pointer">
                                            <i class="fas fa-trash-can me-1"></i> Clear all
                                        </button>
                                    </div>
                                    <a href="<?= $base_url ?>/notifications.php" class="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold transition-colors cursor-pointer">
                                        Full Page
                                    </a>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endif; ?>
            </div>

            <!-- Right Profile / Auth Actions -->
            <div class="hidden md:flex items-center space-x-2">
                <?php if (is_logged_in()): ?>
                    <div class="relative" id="user-menu-wrapper">
                        <button onclick="toggleUserDropdown(event)" class="flex items-center space-x-2 p-1 pr-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
                            <div class="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white text-xs">
                                <?= strtoupper(substr($current_user['username'] ?? $current_user['full_name'], 0, 1)) ?>
                            </div>
                            <span class="text-xs font-semibold text-slate-900"><?= htmlspecialchars($current_user['full_name']) ?></span>
                            <i class="fas fa-chevron-down text-[10px] text-slate-400"></i>
                        </button>
                        <div id="user-menu-dropdown" class="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden z-50">
                            <div class="px-3 py-2 border-b border-slate-100">
                                <p class="text-[11px] font-medium text-slate-900 truncate"><?= htmlspecialchars($current_user['email']) ?></p>
                                <span class="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 uppercase"><?= htmlspecialchars($current_user['role_name'] ?? 'FAN') ?></span>
                            </div>
                            <a href="<?= $base_url ?>/profile.php" class="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"><i class="fas fa-user-gear w-4 me-1 text-slate-500"></i> Profile</a>
                            <a href="<?= $base_url ?>/saved-events.php" class="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"><i class="fas fa-bookmark w-4 me-1 text-pink-500"></i> Saved Wishlist</a>
                            <a href="<?= $base_url ?>/logout.php" class="block px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"><i class="fas fa-right-from-bracket w-4 me-1"></i> Logout</a>
                        </div>
                    </div>
                <?php else: ?>
                    <a href="<?= $base_url ?>/login.php" class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">Log In</a>
                    <a href="<?= $base_url ?>/register.php" class="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer">Register</a>
                <?php endif; ?>
            </div>

            <!-- Mobile Menu Toggle Button -->
            <div class="md:hidden flex items-center">
                <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer">
                    <i class="fas fa-bars text-lg"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu Container -->
        <div id="mobile-menu" class="hidden md:hidden pb-4 pt-2 border-t border-slate-100 space-y-1">
            <?php if ($user_role === 'admin'): ?>
                <a href="<?= $base_url ?>/admin/dashboard.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Dashboard</a>
                <a href="<?= $base_url ?>/admin/verifications.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Verifications</a>
                <a href="<?= $base_url ?>/admin/events.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Events</a>
                <a href="<?= $base_url ?>/admin/users.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Users</a>
                <a href="<?= $base_url ?>/admin/artists.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Artists</a>
            <?php elseif ($user_role === 'organizer'): ?>
                <a href="<?= $base_url ?>/index.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Home</a>
                <a href="<?= $base_url ?>/events.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Discover Events</a>
                <a href="<?= $base_url ?>/organizer/dashboard.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Dashboard</a>
                <a href="<?= $base_url ?>/organizer/my-events.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">My Events</a>
            <?php else: ?>
                <a href="<?= $base_url ?>/index.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Home</a>
                <a href="<?= $base_url ?>/events.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Discover Events</a>
                <?php if (is_logged_in()): ?>
                    <a href="<?= $base_url ?>/saved-events.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Saved Events</a>
                    <a href="<?= $base_url ?>/notifications.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Notifications (<?= $unread_count ?>)</a>
                <?php endif; ?>
            <?php endif; ?>

            <?php if (is_logged_in()): ?>
                <a href="<?= $base_url ?>/profile.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Profile</a>
                <a href="<?= $base_url ?>/logout.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 cursor-pointer">Logout</a>
            <?php else: ?>
                <a href="<?= $base_url ?>/login.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Log In</a>
                <a href="<?= $base_url ?>/register.php" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer">Register</a>
            <?php endif; ?>
        </div>
    </div>
</nav>
