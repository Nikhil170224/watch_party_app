import { useState } from "react";
import { DAYS, MONTHS } from "../../constants/data";

export default function MiniCalendar({ onAddSchedule }) {
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const isToday = (d) => d === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 text-sm font-bold">{"<"}</button>
        <span className="text-sm font-bold text-gray-800 dark:text-white">{MONTHS[month]} {year}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 text-sm font-bold">{">"}</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-xs text-gray-400 dark:text-gray-500 font-semibold py-1">{d[0]}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => (
          <div key={i} className={`flex items-center justify-center h-7 w-7 mx-auto rounded-full text-xs cursor-pointer transition-all ${!d ? "" : isToday(d) ? "bg-red-600 text-white font-bold shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"}`}>{d}</div>
        ))}
      </div>
      <button onClick={onAddSchedule} className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
        <span className="text-lg leading-none">+</span> Add Schedule
      </button>
    </div>
  );
}
