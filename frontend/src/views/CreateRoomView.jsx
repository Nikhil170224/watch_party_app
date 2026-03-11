import { useState } from "react";
import { getInitials, copyToClipboard } from "../utils/helpers";
import Avatar from "../components/ui/Avatar";
import RoleBadge from "../components/ui/RoleBadge";
import { ROLES } from "../constants/data";

export default function CreateRoomView({ user, onCreateRoom }) {
  const [roomName, setRoomName] = useState("");
  const [privacy, setPrivacy]   = useState("public");
  const [maxUsers, setMaxUsers] = useState(10);
  const [loading, setLoading]   = useState(false);
  const userId   = user?.id || "USR-???";
  const initials = user ? getInitials(user.name) : "??";

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Create a Room</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Set up your watch party and invite friends</p>

      {/* Host card */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-5 border border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <Avatar initials={initials} size="lg" role={ROLES.HOST} />
          <div>
            <div className="font-black text-white text-base">{user?.name || "Guest User"}</div>
            <div className="text-gray-400 text-xs">{user?.email || "Not logged in"}</div>
          </div>
          <RoleBadge role={ROLES.HOST} />
        </div>
        <div className="bg-gray-700/50 rounded-xl p-3">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-1 font-semibold">Your Unique ID</div>
          <div className="font-mono text-red-400 font-bold text-sm tracking-widest">{userId}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
        {/* Room name */}
        <div>
          <label className={labelCls}>Room Name</label>
          <input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="Friday Night Movies" className={inputCls} />
        </div>


        {/* Privacy */}
        <div>
          <label className={labelCls}>Privacy</label>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {["public", "private"].map((p) => (
              <button key={p} onClick={() => setPrivacy(p)}
                className={`flex-1 py-2.5 text-sm font-bold capitalize transition-all ${privacy === p ? "bg-red-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                {p === "public" ? "🌐 Public" : "🔒 Private"}
              </button>
            ))}
          </div>
        </div>

        {/* Max users */}
        <div>
          <label className={labelCls}>Max Participants: {maxUsers}</label>
          <input type="range" min={2} max={50} value={maxUsers} onChange={(e) => setMaxUsers(+e.target.value)} className="w-full accent-red-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2</span><span>50</span></div>
        </div>

        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await onCreateRoom({ name: roomName || "My Watch Party" });
            setLoading(false);
          }}
          className={`w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-red-600/25 tracking-wide ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Creating..." : "🎬 Create Room & Become Host"}
        </button>
      </div>
    </div>
  );
}

const labelCls = "block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide";
const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500";
