import { useApp } from "./context/AppContext";
import { Sidebar } from "./components/layout";
import { AuthModal } from "./components/modals";
import { HomeView, CreateRoomView, RoomView, GlobalChatView } from "./views";

export default function App() {
  const {
    dark, setDark,
    view,
    user,
    showAuth, setShowAuth,
    currentRoom,
    sidebarCollapsed, setSidebarCollapsed,
    login,
    logout,
    navigate,
    createRoom,
    joinRoom,
    leaveRoom,
  } = useApp();

  return (
    <div className={dark ? "dark" : ""}>
      <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-950 font-sans">
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onLogin={(u) => { login(u); setShowAuth(false); }}
          />
        )}

        <Sidebar
          active={view}
          setActive={navigate}
          dark={dark}
          setDark={setDark}
          user={user}
          onAuthClick={() => setShowAuth(true)}
          onLogout={logout}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {view === "home"   && <HomeView onJoinRoom={joinRoom} onGoCreate={() => navigate("create")} />}
          {view === "create" && <CreateRoomView user={user} onCreateRoom={createRoom} />}
          {view === "chats"  && <GlobalChatView user={user} />}
          {view === "room" && currentRoom && (
            <RoomView room={currentRoom} user={user} onLeave={leaveRoom} />
          )}
        </main>
      </div>
    </div>
  );
}
