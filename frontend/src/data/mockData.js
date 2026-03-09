// ─── MOCK DATA ────────────────────────────────────────────────────────────────

export const MOCK_PARTICIPANTS = [
  { id: "USR-001", name: "Alex Morgan",  role: "Host",        avatar: "AM" },
  { id: "USR-002", name: "Jordan Lee",   role: "Moderator",   avatar: "JL" },
  { id: "USR-003", name: "Sam Rivera",   role: "Participant", avatar: "SR" },
  { id: "USR-004", name: "Casey Kim",    role: "Participant", avatar: "CK" },
];

export const MOCK_MESSAGES = [
  { id: 1, sender: "Alex Morgan",  role: "Host",        text: "Welcome everyone! Let's watch together 🎬", time: "7:02 PM", avatar: "AM" },
  { id: 2, sender: "Jordan Lee",   role: "Moderator",   text: "Excited for this!",                         time: "7:03 PM", avatar: "JL" },
  { id: 3, sender: "Sam Rivera",   role: "Participant", text: "Ready when you are 🍿",                     time: "7:04 PM", avatar: "SR" },
];

export const GLOBAL_MOCK_MESSAGES = [
  { id: 1, sender: "Alex Morgan",  role: "Host",        text: "Anyone up for a watch party tonight? 🎬",  time: "6:45 PM", avatar: "AM" },
  { id: 2, sender: "Sam Rivera",   role: "Participant", text: "Yes! What are we watching?",               time: "6:46 PM", avatar: "SR" },
  { id: 3, sender: "Jordan Lee",   role: "Moderator",   text: "How about a Marvel marathon? 🦸",          time: "6:47 PM", avatar: "JL" },
];

export const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DEFAULT_SCHEDULES = [
  { title: "Marvel Movie Night", date: "2025-07-20", time: "20:00" },
];
