// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/ThemeContext';
import { User2Icon, MenuIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { darkMode } = useDarkMode(); // Access dark mode state from context
  const { user } = useSelector((store) => store.auth); // Access user data from Redux store
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [hasScrolled, setHasScrolled] = useState(false); // State to track if the user has scrolled

  useEffect(() => {
    // Add scroll event listener to update `hasScrolled` state
    const handleScroll = () => setHasScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev); // Toggle sidebar visibility
  const closeSidebar = () => setSidebarOpen(false); // Close sidebar

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`w-full top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 transition-all duration-300 ${
          hasScrolled ? 'shadow-lg' : 'shadow-md'
        } ${
          darkMode
            ? 'bg-zinc-900 backdrop-blur-sm text-white'
            : 'bg-white/95 backdrop-blur-sm text-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Logo and branding */}
          <div className="flex items-center gap-4">
            <Link to={"/"} className="font-bold text-2xl tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FBTRIP
            </Link>
          </div>

          {/* User menu button */}
          <div className="flex items-center gap-4">
            <button
              aria-label="User menu"
              onClick={toggleSidebar}
              className={`flex items-center gap-2 p-1 rounded-full transition-all ${
                darkMode
                  ? 'hover:bg-zinc-700 focus:ring-2 focus:ring-blue-400'
                  : 'hover:bg-gray-100 focus:ring-2 focus:ring-blue-300'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {user?.name[0]} {/* Display the first letter of the user's name */}
              </div>
              <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                {user?.name ?? 'Hi, Guest'} {/* Display user's name or fallback to 'Hi, Guest' */}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default Navbar;