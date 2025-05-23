import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  HiOutlineChartPie, 
  HiOutlineUsers, 
  HiOutlineUserGroup,
  HiOutlineServer,
  HiOutlineSwitchHorizontal,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineLogout,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const [subMenuOpen, setSubMenuOpen] = useState({});

  const toggleSubMenu = (menu) => {
    setSubMenuOpen(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <HiOutlineChartPie className="w-6 h-6" /> },
    { name: 'Users', path: '/users', icon: <HiOutlineUsers className="w-6 h-6" />, 
      subItems: [
        { name: 'User List', path: '/users' },
        { name: 'Create User', path: '/users/create' },
      ] 
    },
    { name: 'Groups', path: '/groups', icon: <HiOutlineUserGroup className="w-6 h-6" />,
      subItems: [
        { name: 'Group List', path: '/groups' },
        { name: 'Create Group', path: '/groups/create' },
      ]
    },
    { name: 'SMPP Connectors', path: '/connectors', icon: <HiOutlineServer className="w-6 h-6" />,
      subItems: [
        { name: 'Connector List', path: '/connectors' },
        { name: 'Create Connector', path: '/connectors/create' },
      ]
    },
    { name: 'Routes', path: '/routes', icon: <HiOutlineSwitchHorizontal className="w-6 h-6" />,
      subItems: [
        { name: 'MO Routes', path: '/routes/mo' },
        { name: 'MT Routes', path: '/routes/mt' },
        { name: 'Create Route', path: '/routes/create' },
      ]
    },
    { name: 'Statistics', path: '/statistics', icon: <HiOutlineChartBar className="w-6 h-6" />,
      subItems: [
        { name: 'User Statistics', path: '/statistics/users' },
        { name: 'System Statistics', path: '/statistics/system' },
        { name: 'Reports', path: '/statistics/reports' },
      ]
    },
    { name: 'Settings', path: '/settings', icon: <HiOutlineCog className="w-6 h-6" /> },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out h-full relative`}>
      <div className="h-16 flex items-center justify-center p-4 bg-gray-900">
        {isOpen ? (
          <h1 className="text-xl font-bold">Jasmin SMPP</h1>
        ) : (
          <h1 className="text-xl font-bold">J</h1>
        )}
      </div>

      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md text-gray-800"
      >
        {isOpen ? <HiChevronLeft /> : <HiChevronRight />}
      </button>

      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.subItems ? (
                <div>
                  <button 
                    onClick={() => toggleSubMenu(item.name)} 
                    className={`${
                      isOpen ? 'w-full justify-between' : 'justify-center'
                    } flex items-center p-2 rounded-lg text-sm hover:bg-gray-700`}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      {isOpen && <span className="ml-3">{item.name}</span>}
                    </div>
                    {isOpen && (
                      <span>
                        {subMenuOpen[item.name] ? (
                          <HiChevronRight className="w-4 h-4 transform rotate-90" />
                        ) : (
                          <HiChevronRight className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </button>
                  {isOpen && subMenuOpen[item.name] && (
                    <ul className="pl-4 mt-1 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) => 
                              `${isActive ? 'bg-gray-700' : ''} block p-2 rounded-lg text-sm hover:bg-gray-700`
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `${isActive ? 'bg-gray-700' : ''} ${
                      isOpen ? 'justify-start' : 'justify-center'
                    } flex items-center p-2 rounded-lg text-sm hover:bg-gray-700`
                  }
                >
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
          <li>
            <button
              onClick={logout}
              className={`${
                isOpen ? 'justify-start' : 'justify-center'
              } flex items-center p-2 rounded-lg text-sm hover:bg-gray-700 w-full text-left mt-8 text-red-400`}
            >
              <HiOutlineLogout className="w-6 h-6" />
              {isOpen && <span className="ml-3">Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;