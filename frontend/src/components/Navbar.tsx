import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import { Menu, X, LogOut } from 'lucide-react'; // Ensure you have lucide-react installed

export const Navbar: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // CORRECTED: Jayden's RoleSetter uses unsafeMetadata
  const role = (user?.unsafeMetadata?.role as UserRole) || UserRole.VOLUNTEER;
  const avatar = user?.imageUrl;
  const name = user?.fullName;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // CSS Classes
  const navLinkClass = (path: string) => 
    `block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
      isActive(path) 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  const desktopLinkClass = (path: string) => 
    `px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'bg-primary-50 text-primary-700' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer group">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mr-2.5 shadow-lg shadow-primary-200/50 transition-transform group-hover:scale-105">
                 <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">UMission</span>
            </Link>
            
            {/* Desktop Nav */}
            {isSignedIn && (
              <div className="hidden md:flex space-x-2">
                <Link to="/feed" className={desktopLinkClass('/feed')}>
                  Campus Feed
                </Link>
                <Link to="/dashboard" className={desktopLinkClass('/dashboard')}>
                  {role === UserRole.ORGANIZER ? 'Dashboard' : 'My Impact'}
                </Link>
              </div>
            )}
          </div>

          {/* Desktop User Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn && user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900 leading-none mb-1">{name}</span>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{role}</span>
                </div>
                <img className="h-10 w-10 rounded-full bg-gray-100 ring-2 ring-white shadow-sm object-cover" src={avatar} alt="" />
                <button 
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2">Log in</Link>
                <Link to="/signup" className="bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-700 shadow-md shadow-primary-200 transition-all hover:shadow-lg hover:-translate-y-0.5">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
            >
               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg animate-fade-in-down">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {isSignedIn && user ? (
              <>
                <div className="flex items-center gap-3 p-3 mb-3 bg-gray-50 rounded-xl">
                  <img className="h-10 w-10 rounded-full object-cover" src={avatar} alt="" />
                  <div>
                    <p className="font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500 uppercase">{role}</p>
                  </div>
                </div>
                <Link to="/feed" onClick={() => setIsMenuOpen(false)} className={navLinkClass('/feed')}>Campus Feed</Link>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className={navLinkClass('/dashboard')}>
                   {role === UserRole.ORGANIZER ? 'Dashboard' : 'My Impact'}
                </Link>
                <div className="h-px bg-gray-100 my-2"></div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-3 text-center text-gray-700 font-medium bg-gray-50 rounded-xl">Log in</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full py-3 text-center text-white font-bold bg-primary-600 rounded-xl shadow-lg shadow-primary-200">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};