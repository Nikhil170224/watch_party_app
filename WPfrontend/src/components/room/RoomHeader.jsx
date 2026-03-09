import RoleBadge from "../ui/RoleBadge";
import { LinkIcon, LogOutIcon } from "../ui/Icons";
import { copyToClipboard } from "../../utils/helpers";

export default function RoomHeader({ room, myRole, onLeave }) {
  return (
    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
        <div className="min-w-0">
          <div className="font-black text-gray-900 dark:text-white text-sm truncate">{room?.name || "Watch Party"}</div>
          <div className="font-mono text-xs text-red-500 font-bold">{room?.code || "------"}</div>
        </div>
        <RoleBadge role={myRole} />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => copyToClipboard(room?.code)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
          <LinkIcon /> Invite
        </button>
        <button onClick={onLeave} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
          <LogOutIcon /> Leave
        </button>
      </div>
    </div>
  );
}
