## Project Overview

WatchParty is a real-time YouTube watch party app. Users create/join rooms, watch synced YouTube videos, chat, and manage participants with role-based permissions (Host, Moderator, Participant). Live deployment at https://ytwatchparty.vercel.app/.

## Monorepo Structure

This is a two-package monorepo with no workspace manager — `frontend/` and `backend/` are independent npm projects with separate `node_modules`. Always `npm install` in each directory independently.

## Build & Run Commands

### Backend (Node.js + Express)
```
cd backend
npm install
npm start                 # production (node server.js)
npm run dev               # dev with hot reload (nodemon)
```

### Frontend (React + Vite)
```
cd frontend
npm install
npm run dev               # local dev server (Vite)
npm run build             # production build to dist/
npm run preview           # preview production build
```

### Tests
No test framework is configured in either package. The backend `test` script is a placeholder that exits with code 1.

### Lint / Typecheck
No linter or type checker is configured. The project uses plain JavaScript (CommonJS in backend, ESM in frontend).

## Environment Variables

Backend `.env` (in `backend/`, gitignored):
- `PORT` — server port (default 4000)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWT tokens
- `CLIENT_URL` — comma-separated allowed origins for CORS (defaults to `*` if unset)

Frontend (set via Vite env or Vercel dashboard):
- `VITE_API_BASE` — backend URL (defaults to `http://localhost:4000`)

## Architecture

### Backend (`backend/`)

Single entry point: `server.js` — creates Express app, connects MongoDB, mounts REST routes, and initializes Socket.IO on the same HTTP server.

**Database:** MongoDB via Mongoose for all persistent data (users, rooms, chat messages). Connection in `src/config/mongo.js`. Note: `pg` (PostgreSQL) is listed as a dependency but is not wired up anywhere.

**REST API routes** (mounted under `app.use`):
- `/api/auth` → `src/routes/authRoutes.js` — register and login (JWT-based)
- `/api/rooms` → `src/routes/roomRoutes.js` — create room (auth-protected), get room by code

**Socket.IO events** (defined inline in `server.js`):
- `join_room` — joins a socket room, adds participant to DB, sends current video state to new joiner
- `video_action` — play/pause/seek; only Host or Moderator can control; persists state to Room document
- `send_message` — saves message to MongoDB, broadcasts to room
- `promote_user` — Host can promote a participant to Moderator
- `disconnect` — logs disconnection

**Mongoose models** (`src/models/`):
- `User` — username, email, bcrypt-hashed password, avatar
- `Room` — roomCode, host ref, currentVideoId, isPlaying, currentTime, participants array with roles (Host/Moderator/Participant)
- `Message` — roomCode, sender ref, username, text, timestamp

**Middleware** (`src/middleware/`):
- `auth.js` — `protect` middleware: extracts Bearer JWT from Authorization header, verifies with JWT_SECRET, attaches `req.user`
- `errorHandler.js` — global error handler; hides stack traces in production

**Empty scaffolding:** `src/services/` and `src/socket/` directories exist but contain no files yet.

### Frontend (`frontend/`)

React 18 SPA with Vite bundler and Tailwind CSS. No router library — navigation is state-driven via `AppContext`.

**State management:**
- `context/AppContext.jsx` — single React Context providing: dark mode, current view, user, auth modal state, current room, sidebar state, and navigation/room lifecycle functions
- `useApp()` hook consumed by `App.jsx` to wire everything together

**View system** (in `views/`):
- `HomeView` — landing with clock, calendar, schedule list, join-room input
- `CreateRoomView` — room creation form
- `RoomView` — main room view with video player, chat panel, participants panel (responsive layout with mobile tabs)
- `GlobalChatView` — standalone chat outside of rooms

**Custom hooks** (`hooks/`):
- `useRoom` — room-level state: participants, messages, video URL, playback; currently uses mock data from `constants/data.js`
- `useChat` — reusable chat state with send function; also uses mock seed data
- `useDarkMode` — dark mode toggle

**Socket.IO client** (`socket.js`):
- Singleton socket instance using `API_BASE` from `api/config.js` with `autoConnect: false`
- Socket connects on login (in `AppContext` auto-login and `AuthModal`), disconnects on logout
- Hooks/views have not yet fully wired real-time socket events — the frontend still relies on mock data for participants and messages

**API layer** (`api/roomApi.js`):
- `createRoom(username)` — POST to `/api/rooms/create` with JWT from localStorage
- `getRoomDetails(roomCode)` — GET room by code
- Base URL centralized in `api/config.js` (`API_BASE`); override via `VITE_API_BASE` for production

**Role system** (`constants/data.js`):
- Three roles: `Host`, `Moderator`, `Participant`
- Host/Moderator can control video playback; only Host can promote users or manage participants
- `RoomView` currently hardcodes `MY_ROLE = ROLES.HOST` for demo purposes

**Known duplication in utilities:**
- `utils/helpers.js`, `utils/roomUtils.js`, and `utils/userUtils.js` contain overlapping functions (`generateRoomCode`, `extractYouTubeId`, `getInitials`, `formatTime`, etc.). `userUtils.js` adds `canControl`/`canManage` role-check helpers.

## Deployment

Frontend is deployed on Vercel with SPA rewrites (`frontend/vercel.json`). Backend runs on a separate server (port 4000 by default).
