import { useState, useRef } from "react";
import { getInitials, formatTime } from "../utils/helpers";
import { GLOBAL_CHAT_SEED, ROLES } from "../constants/data";

/**
 * Reusable chat state hook.
 * @param {Array}  seed   - initial messages
 * @param {Object} user   - current logged-in user (may be null)
 */
export function useChat(seed = GLOBAL_CHAT_SEED, user = null) {
  const [messages, setMessages] = useState(seed);
  const idRef = useRef(seed.length + 1);

  const send = (text, role = ROLES.PARTICIPANT) => {
    const u = user || { name: "You" };
    setMessages((prev) => [
      ...prev,
      {
        id:     idRef.current++,
        sender: u.name,
        role,
        text,
        time:   formatTime(),
        avatar: getInitials(u.name),
      },
    ]);
  };

  return { messages, send };
}
