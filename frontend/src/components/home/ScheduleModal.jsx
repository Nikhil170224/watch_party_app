// ─── SCHEDULE MODAL ───────────────────────────────────────────────────────────

import { useState } from "react";
import { XIcon } from "../ui/Icons";

/**
 * Modal for creating a new watch-party schedule entry.
 *
 * @param {{
 *   onClose: () => void,
 *   onAdd: (schedule: { title: string, date: string, time: string }) => void
 * }} props
 */
function ScheduleModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [date,  setDate]  = useState("");
  const [time,  setTime]  = useState("");

  const isValid = title.trim() && date && time;

  const handleAdd = () => {
    if (!isValid) return;
    onAdd({ title: title.trim(), date, time });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-600 to-red-400" />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              Schedule Watch Party
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
              <XIcon />
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title (e.g. Movie Night)"
              className={inputCls}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputCls}
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!isValid}
            className="mt-5 w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40
              text-white font-bold rounded-xl transition-all text-sm"
          >
            Schedule →
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 " +
  "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm " +
  "focus:outline-none focus:border-red-500 transition-colors";

export default ScheduleModal;
