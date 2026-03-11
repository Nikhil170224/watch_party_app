import { useState, useEffect } from "react";
import { RoomHeader, VideoPlayer, ParticipantsPanel } from "../components/room";
import { ChatPanel } from "../components/chat";
import { useRoom } from "../hooks/useRoom";

export default function RoomView({ room, user, onLeave }) {
  const [activeTab, setActiveTab] = useState("chat");

  const {
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
  } = useRoom(user, room?.code || room?.roomCode);

  // Seed participants from the room data fetched by AppContext
  useEffect(() => {
    if (room?.participants) {
      setInitialParticipants(room.participants);
    }
  }, [room?.participants, setInitialParticipants]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <RoomHeader room={room} myRole={myRole} onLeave={onLeave} />

      {/* Error toast */}
      {error && (
        <div className="mx-4 mt-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/50">
          ⚠️ {error}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Player + mobile tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <VideoPlayer
            videoUrl={videoUrl}
            playing={playing}
            myRole={myRole}
            onTogglePlay={togglePlaying}
            onChangeVideo={changeVideo}
          />

          {/* Mobile tab bar */}
          <div className="xl:hidden flex border-b border-gray-100 dark:border-gray-800 shrink-0">
            {["chat", "participants"].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-1 py-2.5 text-xs font-bold capitalize transition-all ${activeTab === t ? "border-b-2 border-red-600 text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                {t === "chat" ? `💬 Chat (${messages.length})` : `👥 People (${participants.length})`}
              </button>
            ))}
          </div>

          {/* Mobile panel */}
          <div className="xl:hidden flex-1 overflow-hidden">
            {activeTab === "chat"
              ? <ChatPanel messages={messages} onSend={(text) => sendMessage(text)} />
              : <ParticipantsPanel participants={participants} myRole={myRole} onAssignRole={assignRole} onRemove={removeParticipant} onTransferHost={transferHost} />
            }
          </div>
        </div>

        {/* Desktop side panel */}
        <div className="hidden xl:flex flex-col w-72 shrink-0 border-l border-gray-100 dark:border-gray-800">
          <div className="flex border-b border-gray-100 dark:border-gray-800 shrink-0">
            {["chat", "participants"].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-1 py-3 text-xs font-bold capitalize transition-all ${activeTab === t ? "border-b-2 border-red-600 text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                {t === "chat" ? "💬 Chat" : `👥 People (${participants.length})`}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat"
              ? <ChatPanel messages={messages} onSend={(text) => sendMessage(text)} />
              : <ParticipantsPanel participants={participants} myRole={myRole} onAssignRole={assignRole} onRemove={removeParticipant} onTransferHost={transferHost} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
