import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  Calendar, 
  UserCheck, 
  FlaskConical, 
  Bell, 
  LogOut,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(true);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'E-Library', icon: Library, path: '/library' },
    { name: 'Resources', icon: BookOpen, path: '/resources' },
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'Face Attendance', icon: UserCheck, path: '/attendance' },
    { name: 'AI Research', icon: FlaskConical, path: '/research' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display font-bold text-2xl tracking-tighter text-slate-900"
          >
            Edu<span className="text-indigo-600">Sync</span>
          </motion.div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all group",
              isActive 
                ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform group-hover:scale-110",
              isOpen ? "" : "mx-auto"
            )} />
            {isOpen && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className={cn(
          "flex items-center gap-3 mb-4",
          isOpen ? "px-2" : "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            {profile?.displayName?.[0] || 'U'}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate">{profile?.displayName}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">{profile?.role}</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => signOut()}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors",
            isOpen ? "" : "justify-center"
          )}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
