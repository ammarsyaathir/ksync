<?php
// includes/functions.php - System Utility Functions (Enhanced Light Design & Badges)

require_once __DIR__ . '/../config/database.php';

/**
 * Dynamically computes event status based on current date/time if not postponed or cancelled.
 */
function get_calculated_event_status($event) {
    if (in_array($event['event_status'], ['POSTPONED', 'CANCELLED'])) {
        return $event['event_status'];
    }
    
    $eventDate = $event['event_date'];
    $startTime = $event['start_time'] ?? '00:00:00';
    $endTime = $event['end_time'] ?? '23:59:59';
    
    $startDateTime = strtotime("$eventDate $startTime");
    $endDateTime = strtotime("$eventDate $endTime");
    $now = time();
    
    if ($now < $startDateTime) {
        return 'UPCOMING';
    } elseif ($now >= $startDateTime && $now <= $endDateTime) {
        return 'ONGOING';
    } else {
        return 'COMPLETED';
    }
}

/**
 * Returns formatted graphic badge HTML for Event Verification Status
 */
function get_verification_badge($status) {
    switch (strtoupper($status)) {
        case 'VERIFIED':
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"><i class="fas fa-circle-check me-1.5 text-emerald-500"></i> Published Event</span>';
        case 'PENDING':
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm"><i class="fas fa-clock me-1.5 text-amber-500"></i> Auto-Published</span>';
        case 'REJECTED':
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm"><i class="fas fa-circle-xmark me-1.5 text-rose-500"></i> Flagged / Hidden</span>';
        default:
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200"><i class="fas fa-circle-info me-1.5"></i> ' . htmlspecialchars($status) . '</span>';
    }
}

/**
 * Returns formatted graphic badge HTML for Fanclub / Organizer Verification Status
 */
function get_organizer_badge($user) {
    if (empty($user)) return '';
    $isVerified = intval($user['is_verified_organizer'] ?? 0);
    $orgType = !empty($user['organization_type']) ? $user['organization_type'] : 'Organizer';
    $handle = !empty($user['social_handle']) ? $user['social_handle'] : '';

    if ($isVerified === 1) {
        return '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm" title="Verified Authentic K-Pop Fanclub / Organizer"><i class="fas fa-certificate text-emerald-500 me-1.5"></i> Verified ' . htmlspecialchars($orgType) . ($handle ? ' (' . htmlspecialchars($handle) . ')' : '') . '</span>';
    } elseif ($isVerified === 2) {
        return '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200" title="Verification Credentials Pending Admin Review"><i class="fas fa-clock text-amber-500 me-1.5 animate-pulse"></i> Verification Pending</span>';
    } else {
        return '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200" title="Community Event Organizer"><i class="fas fa-users text-slate-400 me-1.5"></i> Community Organizer</span>';
    }
}

/**
 * Returns formatted graphic badge HTML for Event Status
 */
function get_status_badge($status) {
    switch (strtoupper($status)) {
        case 'UPCOMING':
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200 shadow-sm"><i class="fas fa-calendar-check me-1.5 text-purple-500"></i> Upcoming</span>';
        case 'ONGOING':
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping me-1.5"></span> Live Now</span>';
        case 'COMPLETED':
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"><i class="fas fa-flag-checkered me-1.5 text-slate-400"></i> Completed</span>';
        case 'POSTPONED':
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-sm"><i class="fas fa-clock-rotate-left me-1.5 text-amber-600"></i> Postponed</span>';
        case 'CANCELLED':
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm"><i class="fas fa-ban me-1.5 text-rose-600"></i> Cancelled</span>';
        default:
            return '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">' . htmlspecialchars($status) . '</span>';
    }
}

/**
 * Records system activity log for audit trail.
 */
function log_activity($userId, $action, $entityType = null, $entityId = null, $description = null) {
    global $pdo;
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $action, $entityType, $entityId, $description, $ip]);
    } catch (Exception $e) {
        // Silently handle log write error if any
    }
}

/**
 * Generates notifications for all users who saved a specific event when an update is posted.
 */
function trigger_event_update_notifications($eventId, $updateId, $updateTitle) {
    global $pdo;
    
    $stmt = $pdo->prepare("SELECT event_name FROM events WHERE id = ?");
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();
    if (!$event) return;
    
    $eventName = $event['event_name'];
    $message = "Event Update for \"{$eventName}\": {$updateTitle}";
    
    $stmt = $pdo->prepare("SELECT user_id FROM saved_events WHERE event_id = ?");
    $stmt->execute([$eventId]);
    $savedUsers = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($savedUsers)) return;
    
    $insertStmt = $pdo->prepare("INSERT INTO notifications (user_id, event_id, update_id, message) VALUES (?, ?, ?, ?)");
    foreach ($savedUsers as $userId) {
        $insertStmt->execute([$userId, $eventId, $updateId, $message]);
    }
}

/**
 * Get unread notification count for current user
 */
function get_unread_notification_count($userId) {
    global $pdo;
    if (!$userId) return 0;
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = 0");
    $stmt->execute([$userId]);
    return $stmt->fetchColumn();
}

/**
 * Check if event is saved by user
 */
function is_event_saved($userId, $eventId) {
    global $pdo;
    if (!$userId) return false;
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM saved_events WHERE user_id = ? AND event_id = ?");
    $stmt->execute([$userId, $eventId]);
    return $stmt->fetchColumn() > 0;
}

/**
 * Records an immutable row in event_changes table whenever key fields are updated.
 */
function record_event_change($eventId, $changedBy, $fieldName, $oldValue, $newValue) {
    global $pdo;
    if (trim((string)$oldValue) === trim((string)$newValue)) return;
    try {
        $stmt = $pdo->prepare("INSERT INTO event_changes (event_id, changed_by, field_name, old_value, new_value) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$eventId, $changedBy, $fieldName, $oldValue, $newValue]);
    } catch (Exception $e) {}
}

/**
 * Fetches event change audit log history.
 */
function get_event_change_history($eventId) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("
            SELECT ec.*, u.full_name as changed_by_name
            FROM event_changes ec
            JOIN users u ON ec.changed_by = u.id
            WHERE ec.event_id = ?
            ORDER BY ec.changed_at DESC
        ");
        $stmt->execute([$eventId]);
        return $stmt->fetchAll();
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Checks Community Disputed Threshold (3 unique reports from accounts >7 days old).
 */
function check_event_disputed_status($eventId) {
    global $pdo;
    try {
        // Count unique reports from accounts created > 7 days ago
        $stmt = $pdo->prepare("
            SELECT COUNT(DISTINCT er.user_id)
            FROM event_reports er
            JOIN users u ON er.user_id = u.id
            WHERE er.event_id = ? 
              AND u.created_at <= datetime('now', '-7 days')
        ");
        $stmt->execute([$eventId]);
        $reportCount = intval($stmt->fetchColumn());

        // Fetch organizer replies if any
        $stmtRep = $pdo->prepare("SELECT report_reason, report_details, organizer_reply, created_at FROM event_reports WHERE event_id = ? AND organizer_reply IS NOT NULL");
        $stmtRep->execute([$eventId]);
        $replies = $stmtRep->fetchAll();

        return [
            'is_disputed' => ($reportCount >= 3),
            'report_count' => $reportCount,
            'replies' => $replies
        ];
    } catch (Exception $e) {
        return ['is_disputed' => false, 'report_count' => 0, 'replies' => []];
    }
}

/**
 * Computes Organiser Level (New Organiser vs Established Organiser after 3 clean events).
 */
function get_organizer_level_info($organizerId) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("
            SELECT COUNT(DISTINCT e.id) 
            FROM events e
            LEFT JOIN event_reports er ON e.id = er.event_id
            WHERE e.organizer_id = ? 
              AND e.verification_status = 'VERIFIED'
              AND er.id IS NULL
        ");
        $stmt->execute([$organizerId]);
        $cleanCount = intval($stmt->fetchColumn());

        if ($cleanCount >= 3) {
            return [
                'level' => 'Established Organiser',
                'badge' => '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300"><i class="fas fa-crown me-1 text-amber-600"></i> Established Organiser</span>'
            ];
        } else {
            return [
                'level' => 'New Organiser',
                'badge' => '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"><i class="fas fa-seedling me-1 text-emerald-600"></i> New Organiser</span>'
            ];
        }
    } catch (Exception $e) {
        return ['level' => 'New Organiser', 'badge' => ''];
    }
}

/**
 * Performs check-in for a fan scanning event QR token.
 */
function record_event_checkin($eventId, $userId) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("INSERT INTO checkins (event_id, user_id) VALUES (?, ?)");
        $stmt->execute([$eventId, $userId]);
        return true;
    } catch (Exception $e) {
        return false; // Already checked in
    }
}

/**
 * Gets check-in stats for organizer dashboard.
 */
function get_event_checkin_stats($eventId) {
    global $pdo;
    try {
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM checkins WHERE event_id = ?");
        $countStmt->execute([$eventId]);
        $total = intval($countStmt->fetchColumn());

        $listStmt = $pdo->prepare("
            SELECT c.checked_in_at, u.full_name, u.email, u.profile_image
            FROM checkins c
            JOIN users u ON c.user_id = u.id
            WHERE c.event_id = ?
            ORDER BY c.checked_in_at DESC
        ");
        $listStmt->execute([$eventId]);
        $attendees = $listStmt->fetchAll();

        return ['total' => $total, 'attendees' => $attendees];
    } catch (Exception $e) {
        return ['total' => 0, 'attendees' => []];
    }
}
