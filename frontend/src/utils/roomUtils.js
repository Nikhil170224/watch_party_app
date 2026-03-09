// ─── ROOM UTILITIES ───────────────────────────────────────────────────────────

/**
 * Generate a random 6-character uppercase room code.
 * @returns {string}
 */
export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Extract a YouTube video ID from any standard YouTube URL format.
 * Handles: youtu.be, watch?v=, /embed/, /shorts/
 * @param {string} url
 * @returns {string|null}
 */
export function extractYouTubeId(url) {
  const patterns = [
    /youtu\.be\/([^&?]+)/,
    /[?&]v=([^&]+)/,
    /\/embed\/([^?]+)/,
    /\/shorts\/([^?]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Build a YouTube embed URL from a video ID.
 * @param {string} videoId
 * @param {boolean} autoplay
 * @returns {string}
 */
export function buildEmbedUrl(videoId, autoplay = true) {
  return `https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`;
}

/**
 * Build a shareable room invite link.
 * @param {string} roomCode
 * @returns {string}
 */
export function buildInviteLink(roomCode) {
  return `https://watchparty.app/room/${roomCode}`;
}
