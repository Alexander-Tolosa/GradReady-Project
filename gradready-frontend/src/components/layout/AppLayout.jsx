import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap,
  ClipboardList,
  Bell,
  UserCircle
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function AppLayout({ children, userRole, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authService.signOut();
    navigate('/');
  };

  const menuItems = {
    student: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Student Profile', icon: UserCircle, path: '/profile' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ],
    faculty: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/faculty/dashboard' },
      { name: 'Clearance Requests', icon: ClipboardList, path: '/faculty/requests' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ],
    admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { name: 'Accounts', icon: Users, path: '/admin/accounts' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ],
  };

  const navItems = menuItems[userRole] || menuItems.student;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-maroon rounded flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold">GradReady</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 p-2">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-maroon rounded-xl flex items-center justify-center shadow-maroon">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">GradReady</h1>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">USA Iloilo</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 flex flex-col gap-2 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-maroon-dark/20 text-maroon-light border border-maroon/20 shadow-sm shadow-maroon/5' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
                `}
              >
                <item.icon className="w-5 h-5 transition-colors" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Section / Bottom Navigation */}
          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Section */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hidden md:flex items-center justify-between px-10 z-20">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
             {/* Dynamic Breadcrumbs or secondary info could go here */}
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-maroon rounded-full border-2 border-zinc-900" />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-zinc-800">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-[11px] text-zinc-500 capitalize">{userRole}</p>
              </div>
              <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-zinc-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
          <div className="animate-fade-in max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
