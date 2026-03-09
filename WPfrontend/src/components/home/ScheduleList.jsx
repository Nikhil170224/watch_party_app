import { XIcon, ClockIcon } from "../ui/Icons";

export default function ScheduleList({ schedules, onRemove }) {
  if (!schedules.length) return null;
  return (
    <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
      <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <ClockIcon /> Upcoming Schedules
      </h3>
      <div className="space-y-3">
        {schedules.map((s, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg">
              {new Date(s.date).getDate()}
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">{s.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.date} at {s.time}</div>
            </div>
            <button onClick={() => onRemove(i)} className="ml-auto text-gray-300 hover:text-red-500 transition-colors">
              <XIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
