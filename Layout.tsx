import React from 'react';
import { motion } from 'motion/react';
import { Terminal, LayoutDashboard, Calendar, Users, Timer, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { logout } from '../../firebase';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Buddy Matching', path: '/buddy', icon: Users },
    { name: 'Study Room', path: '/room', icon: Timer },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="crt-overlay" />
      <div className="scanline" />

      {/* Sidebar */}
      <aside className="w-full md:w-64 terminal-border bg-terminal-bg p-6 flex flex-col gap-8 z-10">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-terminal-green" />
          <h1 className="text-xl font-bold glitch-text" data-text="StudySync">StudySync</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-3 transition-all duration-200 uppercase text-sm",
                location.pathname === item.path
                  ? "bg-terminal-green text-terminal-bg"
                  : "hover:bg-terminal-green/10 text-terminal-green"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-terminal-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 w-full hover:bg-terminal-red/10 text-terminal-red transition-all duration-200 uppercase text-sm"
          >
            <LogOut className="w-5 h-5" />
            Abort Mission
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
