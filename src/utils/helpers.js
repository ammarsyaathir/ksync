// src/utils/helpers.js - Utility Functions & Status Badges
import db from '../../config/database.js';

/**
 * Calculates event status (UPCOMING, ONGOING, COMPLETED) dynamically based on date & time
 */
export function getCalculatedEventStatus(event) {
  if (['POSTPONED', 'CANCELLED'].includes(event.event_status)) {
    return event.event_status;
  }

  const eventDate = event.event_date;
  const startTime = event.start_time || '00:00:00';
  const endTime = event.end_time || '23:59:59';

  try {
    const startDateTime = new Date(`${eventDate}T${startTime}`);
    const endDateTime = new Date(`${eventDate}T${endTime}`);
    const now = new Date();

    if (now < startDateTime) {
      return 'UPCOMING';
    } else if (now >= startDateTime && now <= endDateTime) {
      return 'ONGOING';
    } else {
      return 'COMPLETED';
    }
  } catch (e) {
    return event.event_status || 'UPCOMING';
  }
}

/**
 * Returns HTML badge for Event Verification Status
 */
export function getVerificationBadge(status) {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'VERIFIED':
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"><i class="fas fa-circle-check me-1.5 text-emerald-500"></i> Published Event</span>`;
    case 'PENDING':
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm"><i class="fas fa-clock me-1.5 text-amber-500"></i> Under Review</span>`;
    case 'REJECTED':
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm"><i class="fas fa-circle-xmark me-1.5 text-rose-500"></i> Rejected / Hidden</span>`;
    default:
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">${escapeHtml(s)}</span>`;
  }
}

/**
 * Returns HTML badge for Organizer / Fanclub Verification
 */
export function getOrganizerBadge(user) {
  if (!user) return '';
  const isVerified = Number(user.is_verified_organizer || 0);
  const orgType = user.organization_type || 'Organizer';
  const handle = user.social_handle || '';

  if (isVerified === 1) {
    return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm" title="Verified Authentic K-Pop Fanclub / Organizer"><i class="fas fa-certificate text-emerald-500 me-1.5"></i> Verified ${escapeHtml(orgType)} ${handle ? '(' + escapeHtml(handle) + ')' : ''}</span>`;
  } else if (isVerified === 2) {
    return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200" title="Verification Credentials Pending Admin Review"><i class="fas fa-clock text-amber-500 me-1.5 animate-pulse"></i> Verification Pending</span>`;
  } else {
    return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200" title="Community Event Organizer"><i class="fas fa-users text-slate-400 me-1.5"></i> Community Organizer</span>`;
  }
}

/**
 * Returns HTML badge for Event Status
 */
export function getStatusBadge(status) {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'UPCOMING':
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200 shadow-sm"><i class="fas fa-calendar-check me-1.5 text-purple-500"></i> Upcoming</span>`;
    case 'ONGOING':
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping me-1.5"></span> Live Now</span>`;
    case 'COMPLETED':
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"><i class="fas fa-flag-checkered me-1.5 text-slate-400"></i> Completed</span>`;
    case 'POSTPONED':
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-sm"><i class="fas fa-clock-rotate-left me-1.5 text-amber-600"></i> Postponed</span>`;
    case 'CANCELLED':
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm"><i class="fas fa-ban me-1.5 text-rose-600"></i> Cancelled</span>`;
    default:
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">${escapeHtml(s)}</span>`;
  }
}

/**
 * Format date string e.g. "2026-11-14" to "14 Nov 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Format time string e.g. "18:00:00" to "6:00 PM"
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  try {
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return timeStr;
  }
}

/**
 * Escape HTML special chars to prevent XSS
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * System audit activity logger
 */
export async function logActivity(userId, action, entityType = null, entityId = null, description = null, ip = '127.0.0.1') {
  try {
    await db.execute(
      "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address) VALUES (?, ?, ?, ?, ?, ?)",
      [userId || null, action, entityType, entityId, description, ip]
    );
  } catch (e) {
    console.error('Audit log write error:', e.message);
  }
}

export default {
  getCalculatedEventStatus,
  getVerificationBadge,
  getOrganizerBadge,
  getStatusBadge,
  formatDate,
  formatTime,
  escapeHtml,
  logActivity
};
