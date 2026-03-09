import { useState } from "react";
import Avatar from "../ui/Avatar";
import RoleBadge from "../ui/RoleBadge";
import { ROLES } from "../../constants/data";

export default function ParticipantsPanel({ participants, myRole, onAssignRole, onRemove, onTransferHost }) {
  const [openMenu, setOpenMenu] = useState(null);
  const isHost = myRole === ROLES.HOST;
  const canManage = myRole === ROLES.HOST || myRole === ROLES.MODERATOR;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-3 space-y-2">
        {participants.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group relative">
            <Avatar initials={p.avatar} size="sm" role={p.role} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.name}</span>
                {p.role === ROLES.HOST && <span className="text-yellow-500 text-xs">★</span>}
              </div>
              <div className="font-mono text-xs text-gray-400 mb-0.5">{p.id}</div>
              <RoleBadge role={p.role} />
            </div>

            {canManage && p.role !== ROLES.HOST && (
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold"
                >
                  ⋮
                </button>
                {openMenu === p.id && (
                  <div className="absolute right-0 top-8 z-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl w-44 py-1 overflow-hidden">
                    {isHost && p.role !== ROLES.MODERATOR && (
                      <button onClick={() => { onAssignRole(p.id, ROLES.MODERATOR); setOpenMenu(null); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 font-medium">
                        → Make Moderator
                      </button>
                    )}
                    {isHost && p.role === ROLES.MODERATOR && (
                      <button onClick={() => { onAssignRole(p.id, ROLES.PARTICIPANT); setOpenMenu(null); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 font-medium">
                        → Make Participant
                      </button>
                    )}
                    {isHost && (
                      <button onClick={() => { onTransferHost(p.id); setOpenMenu(null); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 hover:text-yellow-600 font-medium">
                        ⭐ Transfer Host
                      </button>
                    )}
                    <button onClick={() => { onRemove(p.id); setOpenMenu(null); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
