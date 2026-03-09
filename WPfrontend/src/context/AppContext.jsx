import { createContext, useContext, useState } from "react";
import { generateUserId } from "../utils/helpers";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [dark, setDark]               = useState(false);
  const [view, setView]               = useState("home");
  const [user, setUser]               = useState(null);
  const [showAuth, setShowAuth]       = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const login = (userData) => {
    setUser({ ...userData, id: userData.id || generateUserId() });
  };

  const logout = () => setUser(null);

  const navigate = (key) => {
    if (key !== "room") setCurrentRoom(null);
    setView(key);
  };

  const createRoom = (room) => {
    setCurrentRoom(room);
    setView("room");
  };

  const joinRoom = (code) => {
    setCurrentRoom({ code, name: "Watch Party #" + code });
    setView("room");
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    setView("home");
  };

  return (
    <AppContext.Provider value={{
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
