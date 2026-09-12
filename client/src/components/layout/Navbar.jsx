import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  ScrollText,
  Shield,
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'HQ', path: '/dashboard', icon: Compass },
    { name: 'QUEST LOG', path: '/quests', icon: ScrollText },
    { name: 'THE VAULT', path: '/shop', icon: Shield },
    { name: 'DOSSIER', path: '/profile', icon: User },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b-3 border-[#141414] transition-shadow duration-150 bg-[#F5F3EF] ${isScrolled ? 'shadow-brutal-sm' : 'shadow-none'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Bauhaus Wordmark Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group shrink-0">
          <div className="bg-[#141414] text-[#F5F3EF] px-2.5 sm:px-3 py-1 sm:py-1.5 font-heading font-black text-base sm:text-xl tracking-tighter border-2 border-[#141414] shadow-brutal-sm group-hover:bg-[#E8402C] transition-colors">
            MANZIL
          </div>
        </Link>

        {/* Authenticated Navigation Links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-0 border-2 border-[#141414] bg-white">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider transition-all border-r-2 border-[#141414] last:border-r-0 ${isActive
                      ? 'bg-[#141414] text-[#F5F3EF]'
                      : 'text-[#141414] hover:bg-[#E8402C] hover:text-[#F5F3EF]'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side widgets (Level, Streak, Gold, User) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Streak Badge */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] text-[10px] sm:text-xs font-heading font-extrabold uppercase shadow-brutal-sm shrink-0"
                title="Current Streak"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{user?.streak?.count || 0}D STREAK</span>
              </div>

              {/* Gold Counter */}
              <div
                className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-[#F2B705] text-[#141414] border-2 border-[#141414] text-[10px] sm:text-xs font-heading font-black uppercase shadow-brutal-sm shrink-0"
                title="Gold Balance"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{user?.cozyCoins || 0} G</span>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-[#2B4AE8] text-[#F5F3EF] border-2 border-[#141414] text-[10px] sm:text-xs font-heading font-black uppercase shadow-brutal-sm shrink-0">
                <Sparkles className="w-3 h-3" />
                <span>LV.{user?.level || 1}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-1 sm:p-1.5 text-[#141414] hover:bg-[#E8402C] hover:text-[#F5F3EF] border-2 border-[#141414] transition-colors cursor-pointer shadow-brutal-sm"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 sm:px-4 py-1.5 font-heading font-extrabold text-xs uppercase text-[#141414] hover:bg-[#141414] hover:text-[#F5F3EF] border-2 border-[#141414] transition-all"
              >
                LOG IN
              </Link>
              <Link
                to="/register"
                className="px-3 sm:px-4 py-1.5 font-heading font-extrabold text-xs uppercase bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all whitespace-nowrap"
              >
                BEGIN QUEST →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Constructivist Tactile Dock) */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F3EF] border-t-3 border-[#141414] flex justify-around items-stretch shadow-brutal safe-area-bottom">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex-1 py-2 px-1 flex flex-col items-center justify-center gap-1 font-heading font-black text-[10px] uppercase border-r-2 border-[#141414] last:border-r-0 transition-colors ${
                  isActive ? 'bg-[#141414] text-[#F5F3EF]' : 'text-[#141414] hover:bg-[#E8402C] hover:text-[#F5F3EF]'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
                <span className="tracking-wider text-[9px]">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};
