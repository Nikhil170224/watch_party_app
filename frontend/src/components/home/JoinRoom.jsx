import { useState } from "react";
import { LinkIcon } from "../ui/Icons";

export default function JoinRoom({ onJoin }) {
  const [code, setCode] = useState("");
  const [link, setLink] = useState("");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
      <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <LinkIcon /> Join a Room
      </h3>
      <input
        id="join-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter room code (e.g. ABC123)"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm mb-3 focus:outline-none focus:border-red-500 tracking-widest font-mono"
      />
      <button
        onClick={() => code && onJoin(code)}
        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all"
      >
        Join as Participant →
      </button>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wide">Or paste invite link</p>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://watchparty.app/room/..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
        />
      </div>
    </div>
  );
}
