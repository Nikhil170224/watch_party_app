export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const ROLES = {
  HOST: "Host",
  MODERATOR: "Moderator",
  PARTICIPANT: "Participant",
};

export const MOCK_PARTICIPANTS = [
  { id: "USR-001", name: "Alex Morgan",  role: ROLES.HOST,        avatar: "AM" },
  { id: "USR-002", name: "Jordan Lee",   role: ROLES.MODERATOR,   avatar: "JL" },
  { id: "USR-003", name: "Sam Rivera",   role: ROLES.PARTICIPANT, avatar: "SR" },
  { id: "USR-004", name: "Casey Kim",    role: ROLES.PARTICIPANT, avatar: "CK" },
];

export const MOCK_MESSAGES = [
  { id: 1, sender: "Alex Morgan",  role: ROLES.HOST,        text: "Welcome everyone! Let's watch together 🎬", time: "7:02 PM", avatar: "AM" },
  { id: 2, sender: "Jordan Lee",   role: ROLES.MODERATOR,   text: "Excited for this!",                          time: "7:03 PM", avatar: "JL" },
  { id: 3, sender: "Sam Rivera",   role: ROLES.PARTICIPANT, text: "Ready when you are 🍿",                      time: "7:04 PM", avatar: "SR" },
];

export const GLOBAL_CHAT_SEED = [
  { id: 1, sender: "Alex Morgan",  role: ROLES.HOST,        text: "Anyone up for a watch party tonight? 🎬", time: "6:45 PM", avatar: "AM" },
  { id: 2, sender: "Sam Rivera",   role: ROLES.PARTICIPANT, text: "Yes! What are we watching?",               time: "6:46 PM", avatar: "SR" },
  { id: 3, sender: "Jordan Lee",   role: ROLES.MODERATOR,   text: "How about a Marvel marathon? 🦸",           time: "6:47 PM", avatar: "JL" },
];

export const DEFAULT_SCHEDULES = [
  { title: "Marvel Movie Night", date: "2025-07-20", time: "20:00" },
];

export const NAV_ITEMS = [
  { key: "home",   label: "Home",        iconKey: "home"  },
  { key: "create", label: "Create Room", iconKey: "plus"  },
  { key: "chats",  label: "Chats",       iconKey: "chat"  },
];
