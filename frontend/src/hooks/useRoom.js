import { useState, useEffect, useCallback } from "react";
import { socket } from "../socket";
import { ROLES } from "../constants/data";
import { getInitials, formatTime, buildEmbedUrl } from "../utils/helpers";
import axios from "axios";
import { API_BASE } from "../api/config";

/**
 * Encapsulates all room-level state with real Socket.IO integration.
 * @param {object} user - { id, name, token }
 * @param {string} roomCode - the 6-char room code
 */
export function useRoom(user, roomCode) {
  const [participants, setParticipants] = useState([]);
  const [messages,     setMessages]     = useState([]);
  const [videoUrl,     setVideoUrl]     = useState(
    "https://www.youtube.com/embed/dQw4w9WgXcQ"
  );
  const [playing,  setPlaying]  = useState(false);
  const [myRole,   setMyRole]   = useState(ROLES.PARTICIPANT);
  const [error,    setError]    = useState(null);

  // ── Join room & set up listeners on mount ─────────────────────────────────
  useEffect(() => {
    if (!roomCode || !user) return;

    // Fetch chat history
    axios
      .get(`${API_BASE}/api/rooms/${roomCode}/messages`)
      .then((res) => {
        const history = res.data.map((m) => ({
          id:     m._id,
          sender: m.username,
          role:   ROLES.PARTICIPANT, // historical messages don't carry role
          text:   m.text,
          time:   formatTime(new Date(m.timestamp)),
          avatar: getInitials(m.username),
        }));
        setMessages(history);
      })
      .catch(() => {}); // silently ignore if no history

    // Emit join
    socket.emit("join_room", {
      roomCode,
      userId:   user.id,
      username: user.name,
    });

    // ── Listeners ──────────────────────────────────────────────────────────

    // Initial room state sent to the joiner
    const onRoomState = ({ videoId, currentTime, isPlaying }) => {
      if (videoId) setVideoUrl(buildEmbedUrl(videoId, false));
      setPlaying(isPlaying || false);
      // currentTime could be used to seek the player if using a controllable player API
    };

    // Another user joined
    const onUserJoined = ({ username, userId: joinedId }) => {
      setParticipants((prev) => {
        if (prev.find((p) => p.id === joinedId)) return prev;
        return [
          ...prev,
          {
            id:     joinedId,
            name:   username,
            role:   ROLES.PARTICIPANT,
            avatar: getInitials(username),
          },
        ];
      });
    };

    // Incoming chat message
    const onReceiveMessage = (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id:     msg._id || Date.now(),
          sender: msg.username,
          role:   ROLES.PARTICIPANT,
          text:   msg.text,
          time:   formatTime(new Date(msg.timestamp || Date.now())),
          avatar: getInitials(msg.username),
        },
      ]);
    };

    // Video state update from Host/Moderator
    const onVideoStateUpdate = ({ action, time }) => {
      setPlaying(action === "play");
      // time could be used for seek if using a controllable player API
    };

    // Role updated (promotion)
    const onRoleUpdated = ({ userId: targetId, newRole }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === targetId ? { ...p, role: newRole } : p))
      );
      if (targetId === user.id) {
        setMyRole(newRole);
      }
    };

    // Error from server (e.g. permission denied)
    const onErrorMessage = (msg) => {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    };

    socket.on("room_state",        onRoomState);
    socket.on("user_joined",       onUserJoined);
    socket.on("receive_message",   onReceiveMessage);
    socket.on("video_state_update", onVideoStateUpdate);
    socket.on("role_updated",      onRoleUpdated);
    socket.on("error_message",     onErrorMessage);

    return () => {
      socket.off("room_state",        onRoomState);
      socket.off("user_joined",       onUserJoined);
      socket.off("receive_message",   onReceiveMessage);
      socket.off("video_state_update", onVideoStateUpdate);
      socket.off("role_updated",      onRoleUpdated);
      socket.off("error_message",     onErrorMessage);
    };
  }, [roomCode, user]);

  // ── Derive myRole from room participant list (initial load from API) ──────
  const setInitialParticipants = useCallback(
    (roomParticipants) => {
      if (!roomParticipants) return;
      const mapped = roomParticipants.map((p) => ({
        id:     p.userId?.toString() || p._id,
        name:   p.username,
        role:   p.role,
        avatar: getInitials(p.username),
      }));
      setParticipants(mapped);
      const me = mapped.find((p) => p.id === user?.id);
      if (me) setMyRole(me.role);
    },
    [user]
  );

  // ── Actions ───────────────────────────────────────────────────────────────

  const sendMessage = (text) => {
    if (!user || !roomCode) return;
    socket.emit("send_message", {
      roomCode,
      userId:   user.id,
      username: user.name,
      text,
    });
  };

  const videoAction = (action, time = 0) => {
    if (!user || !roomCode) return;
    socket.emit("video_action", {
      roomCode,
      userId: user.id,
      action,
      time,
    });
    // Optimistic local update
    setPlaying(action === "play");
  };

  const togglePlaying = () => {
    videoAction(playing ? "pause" : "play", 0);
  };

  const changeVideo = (embedUrl) => {
    setVideoUrl(embedUrl);
  };

  const promoteUser = (targetUserId) => {
    if (!user || !roomCode) return;
    socket.emit("promote_user", {
      roomCode,
      adminId:      user.id,
      targetUserId,
    });
  };

  const assignRole = (id, role) => {
    if (role === ROLES.MODERATOR) {
      promoteUser(id);
    } else {
      // Demoting locally (backend doesn't have a demote event yet)
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, role } : p))
      );
    }
  };

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

  return {
    participants,
    messages,
    videoUrl,
    playing,
    myRole,
    error,
    setInitialParticipants,
    assignRole,
    removeParticipant,
    transferHost,
    sendMessage,
    changeVideo,
    togglePlaying,
  };
}
