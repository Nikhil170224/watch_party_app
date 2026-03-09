import { useState } from "react";
import { HeroClock, JoinRoom, MiniCalendar, ScheduleList } from "../components/home";
import { ScheduleModal } from "../components/modals";
import { DEFAULT_SCHEDULES } from "../constants/data";

export default function HomeView({ onJoinRoom, onGoCreate }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedules, setSchedules] = useState(DEFAULT_SCHEDULES);

  const addSchedule = (s) => setSchedules((prev) => [...prev, s]);
  const removeSchedule = (i) => setSchedules((prev) => prev.filter((_, j) => j !== i));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {showSchedule && (
        <ScheduleModal onClose={() => setShowSchedule(false)} onAdd={addSchedule} />
      )}
      <HeroClock
        onCreateRoom={onGoCreate}
        onJoinRoom={() => document.getElementById("join-input")?.focus()}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <JoinRoom onJoin={onJoinRoom} />
        <MiniCalendar onAddSchedule={() => setShowSchedule(true)} />
      </div>
      <ScheduleList schedules={schedules} onRemove={removeSchedule} />
    </div>
  );
}
