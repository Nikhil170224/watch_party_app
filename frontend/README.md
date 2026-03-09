# WatchParty — Frontend

A full-featured Watch Party frontend built with **React + Vite + Tailwind CSS**.

## Quick Start

```bash
npm install
npm run dev
```

---

## Project Structure

```
watchparty/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Root component (thin orchestrator)
    ├── index.css                 # Tailwind directives
    │
    ├── constants/
    │   └── data.js               # Mock data, ROLES enum, NAV_ITEMS
    │
    ├── utils/
    │   └── helpers.js            # Pure utility functions (no React)
    │
    ├── context/
    │   └── AppContext.jsx        # Global state (dark mode, auth, room, nav)
    │
    ├── hooks/
    │   ├── useRoom.js            # Room-level state (participants, messages, video)
    │   └── useChat.js            # Reusable chat state
    │
    ├── components/
    │   ├── ui/                   # Primitive, reusable UI atoms
    │   │   ├── Icon.jsx          # Base SVG icon wrapper
    │   │   ├── Icons.jsx         # All named icon exports
    │   │   ├── Avatar.jsx        # Circular avatar with role ring
    │   │   ├── RoleBadge.jsx     # Role pill (Host / Moderator / Participant)
    │   │   └── index.js          # Barrel export
    │   │
    │   ├── modals/               # Modal dialogs
    │   │   ├── AuthModal.jsx     # Login / Sign-up
    │   │   ├── ScheduleModal.jsx # Schedule a watch party
    │   │   └── index.js
    │   │
    │   ├── home/                 # Home view sub-components
    │   │   ├── HeroClock.jsx     # Live clock + quick action buttons
    │   │   ├── JoinRoom.jsx      # Join by code or link
    │   │   ├── MiniCalendar.jsx  # Interactive monthly calendar
    │   │   ├── ScheduleList.jsx  # Upcoming schedules list
    │   │   └── index.js
    │   │
    │   ├── chat/                 # Chat components
    │   │   ├── ChatPanel.jsx     # Message list + input (room & global)
    │   │   └── index.js
    │   │
    │   ├── room/                 # Room components
    │   │   ├── RoomHeader.jsx    # Room name, code, role badge, leave button
    │   │   ├── VideoPlayer.jsx   # YouTube iframe + playback controls
    │   │   ├── ParticipantsPanel.jsx  # List with role management menu
    │   │   └── index.js
    │   │
    │   └── layout/               # App shell
    │       ├── Sidebar.jsx       # Collapsible navigation sidebar
    │       └── index.js
    │
    └── views/                    # Full-page views (compose components)
        ├── HomeView.jsx
        ├── CreateRoomView.jsx
        ├── RoomView.jsx
        ├── GlobalChatView.jsx
        └── index.js
```

---

## Architecture

```
AppContext (global state)
    └── App.jsx (routing shell)
            ├── Sidebar (layout)
            ├── HomeView        → HeroClock, JoinRoom, MiniCalendar, ScheduleList
            ├── CreateRoomView  → Avatar, RoleBadge, form fields
            ├── RoomView        → useRoom hook → RoomHeader, VideoPlayer,
            │                                    ParticipantsPanel, ChatPanel
            └── GlobalChatView → useChat hook → ChatPanel
```

## Role Permissions

| Action                  | Host | Moderator | Participant |
|-------------------------|------|-----------|-------------|
| Play / Pause            | ✅   | ✅        | ❌          |
| Seek                    | ✅   | ✅        | ❌          |
| Change video            | ✅   | ✅        | ❌          |
| Assign roles            | ✅   | ❌        | ❌          |
| Remove participants     | ✅   | ❌        | ❌          |
| Transfer host           | ✅   | ❌        | ❌          |

## Backend Integration Points

- Replace `AppContext` auth methods with real API calls / JWT
- Replace `useRoom` mock data with Socket.io event listeners
- Emit `play`, `pause`, `seek`, `changeVideo` socket events from `VideoPlayer`
- Replace `useChat` local state with socket message handler
