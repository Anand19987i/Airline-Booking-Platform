// Sidebar.jsx
import React, { useEffect } from 'react';
import { XIcon, MoonIcon, SunIcon, SettingsIcon, UserIcon, LogOutIcon, BookIcon, BookCheckIcon, Airplay } from 'lucide-react';
import { useDarkMode } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../redux/authSlice';
import { AirplaneIcon } from './Icons';

const Sidebar = ({ isOpen, onClose }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, token } = useSelector(store => store.auth);
  const navigate = useNavigate();

  // Add event listener for 'Escape' key to close the sidebar when it is open
  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Logout function to clear user data and navigate to login page
  const logout = () => {
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay to close the sidebar when clicking outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar container */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            aria-modal="true"
            role="dialog"
            className={`fixed top-0 right-0 w-80 h-full shadow-2xl p-6 ${
              darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header section with title and close button */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">User Menu</h2>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg ${
                    darkMode
                      ? 'hover:bg-zinc-700 focus:ring-2 focus:ring-blue-400'
                      : 'hover:bg-gray-100 focus:ring-2 focus:ring-blue-300'
                  }`}
                  aria-label="Close menu"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex-1">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to={`/users/profile/${user?.name}/v1/details/${user?.id}/summary`}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        darkMode
                          ? 'hover:bg-zinc-800 focus:bg-zinc-800'
                          : 'hover:bg-gray-100 focus:bg-gray-100'
                      }`}
                    >
                      <UserIcon className="w-5 h-5" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/users/${user.name}/bookings/${user.id}`}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        darkMode
                          ? 'hover:bg-zinc-800 focus:bg-zinc-800'
                          : 'hover:bg-gray-100 focus:bg-gray-100'
                      }`}
                    >
                      <Airplay className="w-5 h-5" />
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    {/* Logout button */}
                    <button
                      onClick={logout}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        darkMode
                          ? 'hover:bg-zinc-800 focus:bg-zinc-800'
                          : 'hover:bg-gray-100 focus:bg-gray-100'
                      }`}
                    >
                      <LogOutIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Theme toggle button */}
              <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
                <button
                  onClick={toggleDarkMode}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-zinc-800 hover:bg-zinc-700 focus:bg-zinc-700'
                      : 'bg-gray-100 hover:bg-gray-200 focus:bg-gray-200'
                  }`}
                >
                  {darkMode ? (
                    <>
                      <SunIcon className="w-5 h-5" />
                      Light Theme
                    </>
                  ) : (
                    <>
                      <MoonIcon className="w-5 h-5" />
                      Dark Theme
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;