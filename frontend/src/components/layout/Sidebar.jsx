import { HomeIcon, PlusIcon, ChatIcon, MoonIcon, SunIcon, UserIcon, LogOutIcon, MenuIcon } from "../ui/Icons";
import Avatar from "../ui/Avatar";
import { getInitials } from "../../utils/helpers";
import { NAV_ITEMS } from "../../constants/data";

const ICON_MAP = { home: <HomeIcon />, plus: <PlusIcon />, chat: <ChatIcon /> };

export default function Sidebar({ active, setActive, dark, setDark, user, onAuthClick, onLogout, collapsed, setCollapsed }) {
  return (
    <div className={`${collapsed ? "w-16" : "w-56"} shrink-0 flex flex-col border-r border-gray-100 dark:border-gray-800 transition-all duration-300 bg-white dark:bg-gray-950 h-full`}>
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
          <span className="text-white text-sm font-black">W</span>
        </div>
        {!collapsed && <span className="font-black text-gray-900 dark:text-white text-base tracking-tight">WatchParty</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
          <MenuIcon />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button key={item.key} onClick={() => setActive(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${active === item.key ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400"}`}>
            <span className="shrink-0">{ICON_MAP[item.iconKey]}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
          {dark ? <SunIcon /> : <MoonIcon />}
          {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        {user ? (
          <div className="space-y-1">
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 py-2">
                <Avatar initials={getInitials(user.name)} size="sm" role="Participant" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-gray-900 dark:text-white truncate">{user.name}</div>
                  <div className="text-xs text-gray-400 truncate">{user.id}</div>
                </div>
              </div>
            )}
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
              <LogOutIcon />{!collapsed && "Log Out"}
            </button>
          </div>
        ) : (
          <button onClick={onAuthClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
            <UserIcon />{!collapsed && "Login / Sign Up"}
          </button>
        )}
      </div>
    </div>
  );
}
