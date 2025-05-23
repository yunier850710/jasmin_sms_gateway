import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineMenu, HiOutlineBell, HiOutlineUserCircle } from 'react-icons/hi';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Mock notifications
    setNotifications([
      { id: 1, message: 'SMPP Connector 1 disconnected', time: '5 min ago', read: false },
      { id: 2, message: 'User stats report generated', time: '1 hour ago', read: false },
      { id: 3, message: 'System backup completed', time: '3 hours ago', read: true },
    ]);

    // Update current time
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button 
              onClick={toggleSidebar}
              className="px-4 border-r text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            >
              <HiOutlineMenu className="h-6 w-6" />
            </button>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <h2 className="text-xl font-semibold text-gray-800">Jasmin SMPP SMS Gateway</h2>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-gray-600 hidden md:block">
              {currentTime}
            </div>
            <div className="relative mx-4">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 relative"
              >
                <HiOutlineBell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Notifications
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-2 hover:bg-gray-100 ${notification.read ? 'opacity-75' : 'border-l-2 border-blue-500'}`}
                      >
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
                  )}
                  <div className="px-4 py-2 text-xs text-center border-t">
                    <button className="text-blue-600 hover:text-blue-800">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative ml-3">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <HiOutlineUserCircle className="h-8 w-8" />
                <span className="ml-1 text-sm font-medium hidden md:block">
                  {user?.username || 'Admin'}
                </span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <a 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a 
                    href="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <button 
                    onClick={() => {}}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;