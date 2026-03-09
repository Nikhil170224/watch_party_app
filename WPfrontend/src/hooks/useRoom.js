import { useState, useRef } from "react";
import { MOCK_PARTICIPANTS, MOCK_MESSAGES, ROLES } from "../constants/data";
import { getInitials, formatTime } from "../utils/helpers";

/**
 * Encapsulates all room-level state: participants, messages, video, playback.
 */
export function useRoom(user) {
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [messages,     setMessages]     = useState(MOCK_MESSAGES);
  const [videoUrl,     setVideoUrl]     = useState(
    "https://www.youtube.com/embed/dQw4w9WgXcQ"
  );
  const [playing,          setPlaying]          = useState(false);
  const [showVideoInput,   setShowVideoInput]    = useState(false);
  const msgId = useRef(MOCK_MESSAGES.length + 1);

  // ── Participant management ────────────────────────────────────────────────
  const assignRole = (id, role) =>
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, role } : p)));

  const removeParticipant = (id) =>
    setParticipants((prev) => prev.filter((p) => p.id !== id));

  const transferHost = (id) =>
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, role: ROLES.HOST }
          : p.role === ROLES.HOST
          ? { ...p, role: ROLES.PARTICIPANT }
          : p
      )
    );

  // ── Chat ─────────────────────────────────────────────────────────────────
  const sendMessage = (text, role = ROLES.PARTICIPANT) => {
    const u = user || { name: "You" };
    setMessages((prev) => [
      ...prev,
      {
        id:     msgId.current++,
        sender: u.name,
        role,
        text,
        time:   formatTime(),
        avatar: getInitials(u.name),
      },
    ]);
  };

  // ── Video ─────────────────────────────────────────────────────────────────
  const changeVideo = (embedUrl) => {
    setVideoUrl(embedUrl);
    setShowVideoInput(false);
  };

  const togglePlaying = () => setPlaying((p) => !p);

  return {
    participants,
    messages,
    videoUrl,
    playing,
    showVideoInput,
    setShowVideoInput,
    assignRole,
    removeParticipant,
    transferHost,
    sendMessage,
    changeVideo,
    togglePlaying,
  };
}
