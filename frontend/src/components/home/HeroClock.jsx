export default function HeroClock({ onCreateRoom, onJoinRoom }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="relative mb-6 rounded-3xl overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-900 p-8 shadow-xl shadow-red-900/30">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="relative z-10">
        <div className="text-5xl font-black text-white tracking-tight mb-1">{timeStr}</div>
        <div className="text-red-200 text-sm font-medium">{dateStr}</div>
        <div className="mt-4 flex gap-3 flex-wrap">
          <button onClick={onCreateRoom} className="px-5 py-2.5 bg-white text-red-700 font-bold text-sm rounded-xl hover:bg-red-50 transition-all shadow-lg">
            + Create Room
          </button>
          <button onClick={onJoinRoom} className="px-5 py-2.5 bg-white/20 text-white font-bold text-sm rounded-xl hover:bg-white/30 transition-all border border-white/30">
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
