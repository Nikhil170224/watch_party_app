import { useState, useRef, useEffect } from "react";
import { SendIcon } from "../ui/Icons";
import Avatar from "../ui/Avatar";

const roleColor = {
  Host: "text-red-600 dark:text-red-400",
  Moderator: "text-red-400 dark:text-red-300",
  Participant: "text-gray-500 dark:text-gray-400",
};

export default function ChatPanel({ messages, onSend }) {
  const [msg, setMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!msg.trim()) return;
    onSend(msg.trim());
    setMsg("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-2.5">
            <Avatar initials={m.avatar} size="sm" role={m.role} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-xs font-black ${roleColor[m.role] ?? roleColor.Participant}`}>{m.sender}</span>
                <span className="text-xs text-gray-400">{m.time}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
          />
          <button onClick={send} className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shrink-0">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
