# WatchParty — Source Structure

```
src/
├── main.jsx                         # Vite entry point
├── App.jsx                          # Root component — routing + global state
│
├── context/
│   └── AppContext.jsx               # Global state (user, dark mode, room, view)
│
├── hooks/
│   ├── useRoom.js                   # Room create/join/leave logic
│   ├── useChat.js                   # Chat message state + send logic
│   └── useDarkMode.js               # Dark mode toggle + persist
│
├── utils/
│   ├── roomUtils.js                 # generateRoomCode, extractYouTubeId, etc.
│   └── userUtils.js                 # getInitials, generateUserId
│
├── data/
│   └── mockData.js                  # MOCK_PARTICIPANTS, MOCK_MESSAGES, DAYS, MONTHS
│
├── components/
│   ├── ui/                          # Pure, reusable primitives
│   │   ├── Icon.jsx                 # Base SVG icon wrapper
│   │   ├── Icons.jsx                # All named icon exports
│   │   ├── Avatar.jsx               # User avatar with role ring
│   │   └── RoleBadge.jsx            # Host / Moderator / Participant badge
│   │
│   ├── layout/
│   │   └── Sidebar.jsx              # Collapsible nav sidebar
│   │
│   ├── auth/
│   │   └── AuthModal.jsx            # Login / Signup modal
│   │
│   ├── home/
│   │   ├── MiniCalendar.jsx         # Interactive calendar widget
│   │   └── ScheduleModal.jsx        # Add-a-schedule modal
│   │
│   ├── chat/
│   │   └── ChatPanel.jsx            # Reusable chat UI (room + global)
│   │
│   └── room/
│       ├── VideoPlayer.jsx          # YouTube iframe + playback controls
│       ├── ParticipantsPanel.jsx    # Participant list + host actions
│       └── RoomHeader.jsx           # Room name, code, leave button
│
└── views/                           # Full-page view components
    ├── HomeView.jsx                 # Home: join, schedule, calendar
    ├── CreateRoomView.jsx           # Create room form
    ├── RoomView.jsx                 # Active room (player + chat + participants)
    └── GlobalChatView.jsx           # Global chat page
```
