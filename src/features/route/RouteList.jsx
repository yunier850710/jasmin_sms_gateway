import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  TrashIcon, 
  PencilSquareIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  SignalIcon,
  SignalSlashIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import DataTable from '../../components/ui/DataTable';

/**
 * RouteList Component - Lists and manages SMS routes
 */
function RouteList() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessages, setStatusMessages] = useState({});
  const [activeTab, setActiveTab] = useState('mt'); // 'mt' or 'mo'

  // Mock data for development (will be replaced with actual API calls)
  const mockMtRoutes = [
    {
      id: 'mt1',
      order: 0,
      type: 'DefaultRoute',
      connectorId: 'carrier1',
      rate: 0.05,
      filters: ['filter1', 'filter2'],
      status: 'active',
      createdAt: '2023-08-15T10:30:00Z',
      updatedAt: '2023-09-10T15:45:22Z',
    },
    {
      id: 'mt2',
      order: 1,
      type: 'StaticMTRoute',
      connectorId: 'carrier2',
      rate: 0.03,
      filters: ['filter3'],
      status: 'disabled',
      createdAt: '2023-07-22T14:20:00Z',
      updatedAt: '2023-09-05T09:12:45Z',
    },
  ];

  const mockMoRoutes = [
    {
      id: 'mo1',
      order: 0,
      type: 'DefaultRoute',
      connectorId: 'api1',
      filters: [],
      status: 'active',
      createdAt: '2023-06-10T08:15:00Z',
      updatedAt: '2023-09-12T16:30:10Z',
    },
    {
      id: 'mo2',
      order: 1,
      type: 'StaticMORoute',
      connectorId: 'api2',
      filters: ['filter4', 'filter5'],
      status: 'disabled',
      createdAt: '2023-08-05T11:45:00Z',
      updatedAt: '2023-09-08T14:22:33Z',
    },
  ];

  // Fetch routes based on active tab
  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // Example: const response = await api.get(`/routes/${activeTab}`);
        
        // Using mock data for development
        setTimeout(() => {
          if (activeTab === 'mt') {
            setRoutes(mockMtRoutes);
          } else {
            setRoutes(mockMoRoutes);
          }
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(`Failed to fetch ${activeTab.toUpperCase()} routes: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, [activeTab]);

  // Handle route enable/disable
  const handleToggleRouteStatus = async (route) => {
    const newStatus = route.status === 'active' ? 'disabled' : 'active';
    const action = route.status === 'active' ? 'Disabling' : 'Enabling';
    
    setStatusMessages({ 
      ...statusMessages, 
      [route.id]: { 
        type: 'info', 
        message: `${action} ${route.type} (ID: ${route.id})...` 
      } 
    });
    
    try {
      // In a real app, this would be an API call
      // Example: await api.put(`/routes/${activeTab}/${route.id}/status`, { status: newStatus });
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update route status in UI
      const updatedRoutes = routes.map(r => 
        r.id === route.id 
          ? { ...r, status: newStatus } 
          : r
      );
      setRoutes(updatedRoutes);
      
      setStatusMessages({ 
        ...statusMessages, 
        [route.id]: { 
          type: 'success', 
          message: `Route ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully.`,
          autoClose: 3000
        } 
      });
    } catch (err) {
      setStatusMessages({ 
        ...statusMessages, 
        [route.id]: { 
          type: 'error', 
          message: `Failed to ${newStatus === 'active' ? 'enable' : 'disable'} route: ${err.message}`
        } 
      });
    }
  };

  // Handle route reordering
  const handleMoveRoute = async (route, direction) => {
    // Get current index
    const currentIndex = routes.findIndex(r => r.id === route.id);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === routes.length - 1)) {
      return; // Can't move further in this direction
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    setStatusMessages({ 
      ...statusMessages, 
      [route.id]: { 
        type: 'info', 
        message: `Moving route ${direction}...` 
      } 
    });
    
    try {
      // In a real app, this would be an API call
      // Example: await api.put(`/routes/${activeTab}/${route.id}/order`, { order: routes[newIndex].order });
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Swap orders
      const updatedRoutes = [...routes];
      [updatedRoutes[currentIndex], updatedRoutes[newIndex]] = [updatedRoutes[newIndex], updatedRoutes[currentIndex]];
      
      // Update order values
      updatedRoutes.forEach((route, index) => {
        route.order = index;
      });
      
      setRoutes(updatedRoutes);
      
      setStatusMessages({ 
        ...statusMessages, 
        [route.id]: { 
          type: 'success', 
          message: `Route order updated successfully.`,
          autoClose: 3000
        } 
      });
    } catch (err) {
      setStatusMessages({ 
        ...statusMessages, 
        [route.id]: { 
          type: 'error', 
          message: `Failed to change route order: ${err.message}`
        } 
      });
    }
  };

  // Handle route delete
  const handleDeleteRoute = async (route) => {
    if (!window.confirm(`Are you sure you want to delete the ${route.type} route with ID ${route.id}?`)) {
      return;
    }
    
    setStatusMessages({ 
      ...statusMessages, 
      [route.id]: { 
        type: 'info', 
        message: `Deleting route...` 
      } 
    });
    
    try {
      // In a real app, this would be an API call
      // Example: await api.delete(`/routes/${activeTab}/${route.id}`);
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove route from UI
      setRoutes(routes.filter(r => r.id !== route.id));
      
      // Remove status message for deleted route
      const newStatusMessages = { ...statusMessages };
      delete newStatusMessages[route.id];
      setStatusMessages(newStatusMessages);
      
      // Show temporary success message
      setError({ 
        type: 'success', 
        message: `Route deleted successfully.`, 
        autoClose: 3000 
      });
    } catch (err) {
      setStatusMessages({ 
        ...statusMessages, 
        [route.id]: { 
          type: 'error', 
          message: `Failed to delete route: ${err.message}`
        } 
      });
    }
  };

  // Handle adding new route
  const handleAddRoute = () => {
    navigate(`/routes/${activeTab}/new`);
  };

  // Handle editing route
  const handleEditRoute = (route) => {
    navigate(`/routes/${activeTab}/${route.id}`);
  };

  // Table columns for MT routes
  const mtColumns = [
    { key: 'order', header: 'Order', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'connectorId', header: 'Connector', sortable: true },
    { 
      key: 'filters', 
      header: 'Filters', 
      render: (filters) => filters.length ? `${filters.length} filters` : 'None' 
    },
    { 
      key: 'rate', 
      header: 'Rate', 
      sortable: true,
      render: (rate) => rate ? `$${rate.toFixed(2)}` : 'N/A'
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (status) => {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {status === 'active' ? (
              <SignalIcon className="mr-1 h-3 w-3" />
            ) : (
              <SignalSlashIcon className="mr-1 h-3 w-3" />
            )}
            {status === 'active' ? 'Active' : 'Disabled'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, route, index) => (
        <div className="flex space-x-2">
          {/* Order buttons only shown if more than one route */}
          {routes.length > 1 && (
            <>
              <button
                onClick={() => handleMoveRoute(route, 'up')}
                disabled={index === 0}
                className={`${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                title="Move up"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleMoveRoute(route, 'down')}
                disabled={index === routes.length - 1}
                className={`${index === routes.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                title="Move down"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={() => handleEditRoute(route)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit route"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          {route.status === 'active' ? (
            <button
              onClick={() => handleToggleRouteStatus(route)}
              className="text-amber-600 hover:text-amber-800"
              title="Disable route"
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => handleToggleRouteStatus(route)}
              className="text-green-600 hover:text-green-800"
              title="Enable route"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => handleDeleteRoute(route)}
            className="text-red-600 hover:text-red-800"
            title="Delete route"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  // Table columns for MO routes
  const moColumns = [
    { key: 'order', header: 'Order', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'connectorId', header: 'Connector', sortable: true },
    { 
      key: 'filters', 
      header: 'Filters', 
      render: (filters) => filters.length ? `${filters.length} filters` : 'None' 
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (status) => {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {status === 'active' ? (
              <SignalIcon className="mr-1 h-3 w-3" />
            ) : (
              <SignalSlashIcon className="mr-1 h-3 w-3" />
            )}
            {status === 'active' ? 'Active' : 'Disabled'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, route, index) => (
        <div className="flex space-x-2">
          {/* Order buttons only shown if more than one route */}
          {routes.length > 1 && (
            <>
              <button
                onClick={() => handleMoveRoute(route, 'up')}
                disabled={index === 0}
                className={`${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                title="Move up"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleMoveRoute(route, 'down')}
                disabled={index === routes.length - 1}
                className={`${index === routes.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                title="Move down"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={() => handleEditRoute(route)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit route"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          {route.status === 'active' ? (
            <button
              onClick={() => handleToggleRouteStatus(route)}
              className="text-amber-600 hover:text-amber-800"
              title="Disable route"
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => handleToggleRouteStatus(route)}
              className="text-green-600 hover:text-green-800"
              title="Enable route"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => handleDeleteRoute(route)}
            className="text-red-600 hover:text-red-800"
            title="Delete route"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Routes</h1>
        <Button 
          variant="primary" 
          onClick={handleAddRoute}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add {activeTab.toUpperCase()} Route
        </Button>
      </div>

      {error && (
        <Alert
          type={error.type || 'error'}
          message={error.message}
          dismissible
          autoClose={error.autoClose}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'mt'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('mt')}
            >
              <ArrowsRightLeftIcon className="h-5 w-5 inline mr-2" />
              MT Routes
            </button>
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'mo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('mo')}
            >
              <ArrowsRightLeftIcon className="h-5 w-5 inline mr-2" />
              MO Routes
            </button>
          </nav>
        </div>

        {/* Status Messages */}
        {Object.entries(statusMessages).map(([id, status]) => (
          <Alert
            key={id}
            type={status.type}
            message={status.message}
            dismissible
            autoClose={status.autoClose}
            onClose={() => {
              const newStatusMessages = { ...statusMessages };
              delete newStatusMessages[id];
              setStatusMessages(newStatusMessages);
            }}
            className="m-4"
          />
        ))}

        {/* Route Info */}
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Route Processing Order</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Routes are processed in order from top to bottom. The first matching route will be used.
                  {activeTab === 'mt' ? (
                    <span> For MT routes, ensure the most specific routes are at the top for optimal routing.</span>
                  ) : (
                    <span> For MO routes, configure how incoming messages are processed by your applications.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Routes Table */}
        <DataTable
          columns={activeTab === 'mt' ? mtColumns : moColumns}
          data={routes}
          isLoading={isLoading}
          emptyMessage={`No ${activeTab.toUpperCase()} routes found. Click "Add ${activeTab.toUpperCase()} Route" to create one.`}
          className="p-4"
        />
      </div>
    </div>
  );
}

export default RouteList;