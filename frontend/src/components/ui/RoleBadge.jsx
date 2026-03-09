import { CrownIcon, ShieldIcon, UserIcon } from "./Icons";

const ROLE_CONFIG = {
  Host: {
    bg:   "bg-red-600",
    text: "text-white",
    Icon: CrownIcon,
  },
  Moderator: {
    bg:   "bg-red-400/30 border border-red-400",
    text: "text-red-400",
    Icon: ShieldIcon,
  },
  Participant: {
    bg:   "bg-gray-200 dark:bg-gray-700",
    text: "text-gray-600 dark:text-gray-300",
    Icon: UserIcon,
  },
};

/**
 * Compact pill badge showing a user's role with a matching icon.
 */
export default function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.Participant;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className="w-3 h-3">
        <cfg.Icon />
      </span>
      {role}
    </span>
  );
}
