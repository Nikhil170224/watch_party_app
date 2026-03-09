import { useState } from "react";
import { PlayIcon, PauseIcon, LinkIcon, XIcon } from "../ui/Icons";
import { extractYouTubeId, buildEmbedUrl } from "../../utils/helpers";
import { ROLES } from "../../constants/data";

export default function VideoPlayer({ videoUrl, playing, myRole, onTogglePlay, onChangeVideo }) {
  const [showInput, setShowInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const canControl = myRole === ROLES.HOST || myRole === ROLES.MODERATOR;

  const handleApply = () => {
    const id = extractYouTubeId(urlInput);
    if (id) { onChangeVideo(buildEmbedUrl(id, true)); setUrlInput(""); setShowInput(false); }
  };

  return (
    <div className="flex flex-col">
      {/* iframe */}
      <div className="relative bg-black" style={{ aspectRatio: "16/9", maxHeight: "55vh" }}>
        <iframe src={videoUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="YouTube player" />
        {canControl ? (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center gap-3">
            <button onClick={onTogglePlay} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-all">
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer">
              <div className="h-full w-1/3 bg-red-500 rounded-full" />
            </div>
            <button onClick={() => setShowInput(!showInput)} className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-1.5">
              <LinkIcon /> Change Video
            </button>
          </div>
        ) : (
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
            👁 Watch Only
          </div>
        )}
      </div>

      {/* URL input bar */}
      {showInput && canControl && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Paste YouTube URL..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500 font-mono"
          />
          <button onClick={handleApply} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all">Apply</button>
          <button onClick={() => setShowInput(false)} className="px-3 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"><XIcon /></button>
        </div>
      )}

      {/* Role status bar */}
      <div className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 ${myRole === ROLES.HOST ? "bg-red-600/10 text-red-600 dark:text-red-400" : myRole === ROLES.MODERATOR ? "bg-red-400/10 text-red-500 dark:text-red-300" : "bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400"}`}>
        <span>{myRole === ROLES.HOST ? "👑 Host" : myRole === ROLES.MODERATOR ? "🛡 Moderator" : "👁 Participant"}</span>
        <span>·</span>
        <span>{myRole === ROLES.PARTICIPANT ? "Watch only — playback controlled by Host/Moderator" : "You have playback & management controls"}</span>
      </div>
    </div>
  );
}
