import { ChatPanel } from "../components/chat";
import { useChat } from "../hooks/useChat";
import { ROLES } from "../constants/data";

export default function GlobalChatView({ user }) {
  const { messages, send } = useChat([], user);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h2 className="text-lg font-black text-gray-900 dark:text-white">Global Chat</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Chat with all users across rooms</p>
      </div>
      <ChatPanel messages={messages} onSend={(text) => send(text, ROLES.PARTICIPANT)} />
    </div>
  );
}
