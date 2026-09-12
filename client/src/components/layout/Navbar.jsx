import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AmbientSound } from './AmbientSound';
import {
  Compass,
  ScrollText,
  Store,
  User,
  LogOut,
  Flame,
  Coins,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'My Study Room', path: '/dashboard', icon: Compass },
    { name: 'Quest Log', path: '/quests', icon: ScrollText },
    { name: 'Cozy Shop', path: '/shop', icon: Store },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF3E8]/90 backdrop-blur-md border-b border-[#E4D3BE]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#E3A08A]/20 border border-[#E3A08A]/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <span className="text-xl">☕</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#3A2E27] font-sans">
              Life RPG
            </span>
            <span className="text-[10px] block text-[#78665B] font-handwritten -mt-1 text-xs">
              study room edition 🌿
            </span>
          </div>
        </Link>

        {/* Authenticated Navigation Links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 bg-[#F0E4D3]/70 p-1 rounded-2xl border border-[#E4D3BE]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FAF3E8] text-[#3A2E27] shadow-sm font-semibold'
                      : 'text-[#78665B] hover:text-[#3A2E27] hover:bg-[#FAF3E8]/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side widgets (Sound, Coins, Streak, Level, User) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AmbientSound />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Streak Badge */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#9CAF88]/15 border border-[#9CAF88]/40 rounded-full text-xs font-semibold text-[#4D6339]"
                title="Current Study Streak"
              >
                <Flame className="w-3.5 h-3.5 text-[#E3A08A] fill-[#E3A08A]" />
                <span>{user?.streak?.count || 0}d</span>
              </div>

              {/* Cozy Coins */}
              <div
                className="flex items-center gap-1.5 px-3 py-1 bg-[#F4C572]/20 border border-[#F4C572]/50 rounded-full text-xs font-bold text-[#855D16]"
                title="Cozy Coins"
              >
                <Coins className="w-3.5 h-3.5 text-[#855D16]" />
                <span>{user?.cozyCoins || 0}</span>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-1 px-2.5 py-1 bg-[#E3A08A]/20 border border-[#E3A08A]/40 rounded-full text-xs font-bold text-[#3A2E27]">
                <Sparkles className="w-3 h-3 text-[#E3A08A]" />
                <span>Lv. {user?.level || 1}</span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 text-[#78665B] hover:text-[#3A2E27] hover:bg-[#F0E4D3] rounded-xl transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-[#78665B] hover:text-[#3A2E27] transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-sm font-semibold rounded-2xl bg-[#E3A08A] hover:bg-[#D9907A] text-[#3A2E27] shadow-[0_4px_12px_rgba(227,160,138,0.25)] transition-all"
              >
                Begin Quest ✍️
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF3E8]/95 backdrop-blur-md border-t border-[#E4D3BE] px-4 py-2 flex justify-around items-center">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-colors ${
                  isActive ? 'text-[#3A2E27] font-bold' : 'text-[#78665B]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#E3A08A]' : ''}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
