import React from 'react';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import { UserIcon } from '@heroicons/react/24/outline'; // Optional icon

const Profile = () => {
  // Get the user data from the Redux store
  const { user } = useSelector((state) => state.auth);

  // Get the current theme mode (dark or light) from the ThemeContext
  const { darkMode } = useDarkMode();

  return (
    <>
      {/* Navbar component */}
      <Navbar />
      <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-6`}>
        <div className="max-w-3xl mx-auto">
          {/* Profile card */}
          <div className={`rounded-2xl shadow-xl overflow-hidden transition-all ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
            {/* User information section */}
            <div className="flex items-center gap-6 p-6 border-b border-gray-200 dark:border-zinc-700">
              {/* User avatar with the first letter of the user's name */}
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.name[0]}
              </div>
              <div>
                {/* User name and email */}
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <div className="ml-auto">
                {/* User wallet balance */}
                <span className="inline-block bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-4 py-1 rounded-full text-sm font-medium shadow">
                  ₹ {user.wallet.toLocaleString()} Wallet
                </span>
              </div>
            </div>

            {/* Additional user details */}
            <div className="p-6 space-y-4">
              {/* Membership information */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Membership</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Standard User</p>
              </div>

              {/* Email notifications status */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enabled</p>
              </div>

              {/* Current theme mode */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Theme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
