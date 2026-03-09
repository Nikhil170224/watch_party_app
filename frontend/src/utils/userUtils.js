// ─── USER UTILITIES ───────────────────────────────────────────────────────────

/**
 * Derive 1-2 uppercase initials from a display name.
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Generate a random user ID string.
 * @returns {string}
 */
export function generateUserId() {
  return "USR-" + Math.floor(Math.random() * 900 + 100);
}

/**
 * Format a Date object as a short time string (e.g. "7:04 PM").
 * @param {Date} date
 * @returns {string}
 */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Determine if a role has playback control permissions.
 * @param {"Host"|"Moderator"|"Participant"} role
 * @returns {boolean}
 */
export function canControl(role) {
  return role === "Host" || role === "Moderator";
}

/**
 * Determine if a role has management permissions (remove/assign).
 * @param {"Host"|"Moderator"|"Participant"} role
 * @returns {boolean}
 */
export function canManage(role) {
  return role === "Host";
}
