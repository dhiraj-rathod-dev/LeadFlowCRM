import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, UserPlus, GitBranch, Settings, LogOut, X, Zap } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/leads', label: 'Leads', icon: UserPlus },
    { to: '/dashboard/pipeline', label: 'Pipeline', icon: GitBranch },
  ];

  const adminLinks = [
    { to: '/dashboard/users', label: 'Users', icon: Users },
  ];

  const settingsLinks = [
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col dark:bg-dark-900 dark:border-dark-800`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">LeadFlow</h1>
              <p className="text-[10px] text-gray-400 -mt-0.5 font-medium">CRM SYSTEM</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
          {links.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'} onClick={onClose}>
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <>
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pt-4">Administration</p>
              {adminLinks.map(link => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'} onClick={onClose}>
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </>
          )}
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pt-4">Account</p>
          {settingsLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'} onClick={onClose}>
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100 dark:border-dark-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
