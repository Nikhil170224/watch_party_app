import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../socket";
import { getRoomDetails, createRoom as apiCreateRoom } from "../api/roomApi";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [dark, setDark]               = useState(false);
  const [view, setView]               = useState("home");
  const [user, setUser]               = useState(null);
  const [showAuth, setShowAuth]       = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-login from localStorage on mount
  useEffect(() => {
    const token    = localStorage.getItem("token");
    const userId   = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    if (token && userId && username) {
      setUser({ name: username, id: userId, token });
      socket.connect();
    }
  }, []);

  const login = (userData) => {
    // userData comes from the AuthModal: { name, email, id, token }
    setUser(userData);
    // socket.connect() is already called in AuthModal after login
  };

  const logout = () => {
    socket.disconnect();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser(null);
    setCurrentRoom(null);
    setView("home");
  };

  const navigate = (key) => {
    if (key !== "room") setCurrentRoom(null);
    setView(key);
  };

  const createRoom = async (roomFormData) => {
    if (!user) { setShowAuth(true); return; }
    try {
      const room = await apiCreateRoom(user.name);
      // room has: _id, roomCode, host, participants, currentVideoId, etc.
      setCurrentRoom({
        code: room.roomCode,
        name: roomFormData.name || "Watch Party #" + room.roomCode,
        ...room,
      });
      setView("room");
    } catch (err) {
      alert(typeof err === "string" ? err : "Failed to create room");
    }
  };

  const joinRoom = async (code) => {
    if (!user) { setShowAuth(true); return; }
    try {
      const room = await getRoomDetails(code.toUpperCase());
      setCurrentRoom({
        code: room.roomCode,
        name: "Watch Party #" + room.roomCode,
        ...room,
      });
      setView("room");
    } catch (err) {
      alert(typeof err === "string" ? err : "Room not found");
    }
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
