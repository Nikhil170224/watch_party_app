/**
 * Circular avatar with gradient background, initials, and an optional
 * role-based ring color.
 *
 * Props:
 *   initials  string   – up to 2 letters shown inside
 *   size      "sm" | "md" | "lg"
 *   role      "Host" | "Moderator" | "Participant" | undefined
 */
export default function Avatar({ initials, size = "md", role }) {
  const sizeClass = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  }[size] ?? "w-9 h-9 text-sm";

  const ringClass =
    role === "Host"      ? "ring-2 ring-red-500"
    : role === "Moderator" ? "ring-2 ring-red-300"
    : "";

  return (
    <div
      className={`${sizeClass} ${ringClass} rounded-full bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center font-bold text-white shrink-0`}
    >
      {initials}
    </div>
  );
}
