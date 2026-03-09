/**
 * Generate a random 6-char uppercase alphanumeric room code.
 */
export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Extract a YouTube video ID from any common YouTube URL format.
 * Returns null if no ID found.
 */
export function extractYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([^&?]+)/);
  return match ? match[1] : null;
}

/**
 * Build a YouTube embed URL from a video ID.
 */
export function buildEmbedUrl(videoId, autoplay = true) {
  return `https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`;
}

/**
 * Build the shareable invite link for a room code.
 */
export function buildInviteLink(roomCode) {
  return `https://watchparty.app/room/${roomCode}`;
}

/**
 * Derive initials (up to 2 chars) from a full name string.
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
 */
export function generateUserId() {
  return "USR-" + Math.floor(Math.random() * 900 + 100);
}

/**
 * Format a Date object to a short time string (e.g. "7:02 PM").
 */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Copy text to clipboard (graceful no-op if API unavailable).
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard?.writeText(text);
    return true;
  } catch {
    return false;
  }
}
