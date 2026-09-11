
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Trophy,
  Ticket,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/draws',
      icon: Trophy,
      label: 'Lucky Draws',
    },
    {
      to: '/my-entries',
      icon: Ticket,
      label: 'My Entries',
    },
  ];

  if (isAdmin) {
    navItems.push({
      to: '/draws/create',
      icon: PlusCircle,
      label: 'Create Draw',
    });
  }

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64
          bg-white
          border-r border-slate-200
          shadow-xl shadow-slate-900/5
          transform transition-transform duration-300
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="flex items-center gap-3">

              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br from-violet-600 to-indigo-600
                  shadow-lg shadow-violet-500/20
                "
              >
                <Sparkles className="h-6 w-6 text-white" />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-bold tracking-tight text-slate-900">
                  Lucky Draw
                </h1>

                <p className="text-[11px] text-slate-400">
                  Win Amazing Prizes
                </p>
              </div>

              {/* Mobile Close */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="
                  rounded-xl p-2
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  lg:hidden
                "
              >
                <X className="h-5 w-5" />
              </button>

            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 px-3 py-6">

            <p
              className="
                px-3 pb-3
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-slate-400
              "
            >
              Menu
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    group relative
                    flex items-center gap-3
                    rounded-xl
                    px-3 py-3
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      {isActive && (
                        <span
                          className="
                            absolute left-0 top-1/2
                            h-7 w-1
                            -translate-y-1/2
                            rounded-r-full
                            bg-gradient-to-b
                            from-violet-500 to-indigo-600
                          "
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`
                          flex h-9 w-9 items-center justify-center
                          rounded-lg
                          transition-all
                          ${
                            isActive
                              ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/20'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-violet-600'
                          }
                        `}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </div>

                      {/* Label */}
                      <span className="flex-1">
                        {item.label}
                      </span>

                      {/* Arrow */}
                      <ChevronRight
                        className={`
                          h-4 w-4 transition-all
                          ${
                            isActive
                              ? 'text-violet-500'
                              : 'translate-x-[-4px] text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom User Section */}
          <div className="border-t border-slate-100 p-4">

            {/* User */}
            <div
              className="
                mb-2 flex items-center gap-3
                rounded-xl
                border border-slate-100
                bg-slate-50
                px-3 py-3
              "
            >
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br from-violet-500 to-indigo-600
                  shadow-md shadow-violet-500/20
                "
              >
                <span className="text-sm font-bold text-white">
                  {userInitial}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user?.name || 'User'}
                </p>

                <p className="mt-0.5 text-[11px] capitalize text-slate-400">
                  {user?.role || 'User'}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                group flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm font-medium
                text-slate-500
                transition-all
                hover:bg-red-50
                hover:text-red-600
              "
            >
              <div
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg
                  bg-slate-100
                  transition
                  group-hover:bg-red-100
                "
              >
                <LogOut className="h-4 w-4" />
              </div>

              <span>Logout</span>
            </button>

          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header
          className="
            sticky top-0 z-30
            border-b border-slate-200
            bg-white/90
            px-4 py-3.5
            backdrop-blur-xl
            lg:px-8
          "
        >
          <div className="flex items-center gap-4">

            {/* Mobile Menu */}
            <button
              type="button"
              className="
                rounded-xl
                bg-slate-100
                p-2.5
                text-slate-600
                transition
                hover:bg-violet-50
                hover:text-violet-600
                lg:hidden
              "
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Header Icon */}
            <div
              className="
                hidden h-9 w-9 items-center justify-center
                rounded-xl
                bg-gradient-to-br from-violet-100 to-indigo-100
                sm:flex
              "
            >
              <Sparkles className="h-4 w-4 text-violet-600" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Lucky Draw Application
              </h2>

              <p className="mt-0.5 hidden text-[11px] text-slate-400 sm:block">
                Manage your lucky draws and entries
              </p>
            </div>

            {/* Right Side */}
            <div className="ml-auto flex items-center gap-3">

              {/* Online */}
              <div
                className="
                  hidden items-center gap-2
                  rounded-full
                  border border-emerald-100
                  bg-emerald-50
                  px-3 py-1.5
                  md:flex
                "
              >
                <span
                  className="
                    h-2 w-2
                    animate-pulse
                    rounded-full
                    bg-emerald-500
                  "
                />

                <span className="text-[11px] font-semibold text-emerald-700">
                  Online
                </span>
              </div>

              {/* User Avatar */}
              <div
                className="
                  hidden h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br from-violet-500 to-indigo-600
                  text-xs font-bold text-white
                  shadow-md shadow-violet-500/20
                  sm:flex
                "
              >
                {userInitial}
              </div>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="
            flex-1
            overflow-auto
            bg-gradient-to-br
            from-slate-50
            via-white
            to-violet-50/30
            p-4
            lg:p-8
          "
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;

