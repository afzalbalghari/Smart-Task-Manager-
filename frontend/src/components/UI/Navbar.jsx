import { Link, useNavigate } from "react-router-dom";
import { Bell, BarChart2, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useState } from "react";
import NotificationPanel from "../Notifications/NotificationPanel";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unread, markRead } = useNotifications();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm">S</span>
          <span className="text-slate-100">SmartTask</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="btn-ghost flex items-center gap-2 text-sm">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/analytics" className="btn-ghost flex items-center gap-2 text-sm">
            <BarChart2 size={16} /> Analytics
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotif(!showNotif); markRead(); }}
              className="btn-ghost p-2 relative"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/40
                            flex items-center justify-center text-sm font-semibold text-primary-400">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden md:block text-sm text-slate-300">{user?.name}</span>
          </div>

          <button onClick={handleLogout} className="btn-ghost p-2 text-slate-400 hover:text-red-400">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
