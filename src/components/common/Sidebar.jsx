import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ServerIcon, 
  ArrowsRightLeftIcon, 
  EnvelopeIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  Cog6ToothIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Connectors', href: '/connectors', icon: ServerIcon },
    { name: 'Routes', href: '/routes', icon: ArrowsRightLeftIcon },
    { name: 'Messaging', href: '/messages', icon: EnvelopeIcon },
    { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Templates', href: '/templates', icon: DocumentTextIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className={`bg-gray-800 text-white ${expanded ? 'w-64' : 'w-20'} transition-width duration-300 ease-in-out`}>
      <div className="h-full flex flex-col">
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          {expanded ? (
            <div className="text-lg font-bold">Jasmin Panel</div>
          ) : (
            <div className="text-lg font-bold mx-auto">JP</div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-full hover:bg-gray-700 focus:outline-none"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={expanded ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
              />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`
                }
              >
                <item.icon
                  className={`${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  } mr-3 flex-shrink-0 h-6 w-6`}
                  aria-hidden="true"
                />
                {expanded && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
        
        {/* User info at bottom */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium">
              UA
            </div>
            {expanded && (
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">admin@jasmin.local</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;