import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, BarChart3, Target, User } from 'lucide-react';
import type { User as UserType } from '../../types';

interface LayoutProps {
  user: UserType;
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tracking', icon: CalendarDays, label: 'Registro' },
  { path: '/reports', icon: BarChart3, label: 'Relatórios' },
  { path: '/goals', icon: Target, label: 'Objetivos' },
  { path: '/profile', icon: User, label: 'Perfil' },
];

export default function Layout({ user, children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-emerald-50 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-emerald-100 fixed h-full z-10">
        <div className="p-6 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🌿</span>
            </div>
            <div>
              <h1 className="font-bold text-emerald-800 text-lg">LifeTrack</h1>
              <p className="text-xs text-emerald-500">Evolução Pessoal</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-700 font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
              {user.disc_profile && (
                <span className="text-xs text-emerald-600 font-medium">DISC: {user.disc_profile}</span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  active
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-100">
          <p className="text-xs text-gray-400 text-center">LifeTrack v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </div>
      </main>

      {/* Bottom nav - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 z-20">
        <div className="flex">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${
                  active ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                <Icon size={20} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                <span className="mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
