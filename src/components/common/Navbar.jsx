import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, MagnifyingGlassIcon, ServerIcon, EnvelopeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm z-10">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800 hidden lg:block">
                Jasmin SMS Gateway
              </h1>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Notifications dropdown */}
            <div className="relative">
              <button
                type="button"
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Notifications</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {/* Notification items */}
                    <a href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center">
                          <ServerIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">Connector Status Change</p>
                          <p className="text-xs text-gray-500 mt-0.5">SMPP Connector 'provider1' is now active</p>
                          <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-green-500 h-8 w-8 rounded-full flex items-center justify-center">
                          <EnvelopeIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">Campaign Completed</p>
                          <p className="text-xs text-gray-500 mt-0.5">Marketing campaign 'June Promo' completed successfully</p>
                          <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-red-500 h-8 w-8 rounded-full flex items-center justify-center">
                          <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">System Alert</p>
                          <p className="text-xs text-gray-500 mt-0.5">High message queue detected. Check system status.</p>
                          <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                        </div>
                      </div>
                    </a>
                  </div>
                  <a href="#" className="block text-center text-sm font-medium text-blue-600 hover:bg-gray-50 py-2">
                    View all notifications
                  </a>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu-button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                    {user?.first_name?.charAt(0) || 'A'}
                  </div>
                </button>
              </div>
              
              {isProfileMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;