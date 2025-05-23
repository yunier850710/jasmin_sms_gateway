import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineSwitchHorizontal, 
  HiOutlineRefresh, 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlinePlus, 
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCog
} from 'react-icons/hi';
import { api } from '../services/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTE_TYPES } from '../utils/constants';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [routeType, setRouteType] = useState(ROUTE_TYPES.MO);
  const [expandedFilters, setExpandedFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, [routeType]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the API
      // For now, we'll use mock data
      setTimeout(() => {
        const mockMORoutes = [
          {
            id: '1',
            type: 'mo',
            connectorId: '1',
            connectorName: 'Production SMPP',
            priority: 100,
            filters: [
              { id: '1', type: 'source_address', operator: 'startswith', value: '+1' },
              { id: '2', type: 'destination_address', operator: 'equal', value: '12345' }
            ],
            createdAt: '2023-01-15T10:30:00Z',
            updatedAt: '2023-01-16T08:45:00Z'
          },
          {
            id: '2',
            type: 'mo',
            connectorId: '3',
            connectorName: 'Test SMPP',
            priority: 50,
            filters: [
              { id: '3', type: 'source_address', operator: 'startswith', value: '+44' }
            ],
            createdAt: '2023-01-16T14:20:00Z',
            updatedAt: '2023-01-16T14:20:00Z'
          },
        ];

        const mockMTRoutes = [
          {
            id: '3',
            type: 'mt',
            connectorId: '1',
            connectorName: 'Production SMPP',
            priority: 100,
            filters: [
              { id: '4', type: 'destination_address', operator: 'startswith', value: '+1' }
            ],
            createdAt: '2023-01-15T10:35:00Z',
            updatedAt: '2023-01-16T08:50:00Z'
          },
          {
            id: '4',
            type: 'mt',
            connectorId: '3',
            connectorName: 'Test SMPP',
            priority: 50,
            filters: [
              { id: '5', type: 'destination_address', operator: 'startswith', value: '+44' },
              { id: '6', type: 'short_message', operator: 'contains', value: 'URGENT' }
            ],
            createdAt: '2023-01-16T14:25:00Z',
            updatedAt: '2023-01-16T14:25:00Z'
          },
        ];
        
        setRoutes(routeType === ROUTE_TYPES.MO ? mockMORoutes : mockMTRoutes);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to fetch routes');
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      // In a real implementation, this would call the API
      // For now, we'll just update the UI
      setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== routeId));
      setShowDeleteConfirm(false);
      setSelectedRoute(null);
    } catch (err) {
      setError('Failed to delete route');
    }
  };

  const confirmDelete = (route) => {
    setSelectedRoute(route);
    setShowDeleteConfirm(true);
  };

  const toggleFilterExpansion = (routeId) => {
    setExpandedFilters(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  const getFilterDescription = (filter) => {
    const operatorText = {
      'equal': 'equals',
      'not_equal': 'does not equal',
      'startswith': 'starts with',
      'endswith': 'ends with',
      'contains': 'contains',
      'regex': 'matches regex'
    };

    const typeText = {
      'source_address': 'Source',
      'destination_address': 'Destination',
      'short_message': 'Message',
      'priority': 'Priority'
    };

    return `${typeText[filter.type] || filter.type} ${operatorText[filter.operator] || filter.operator} "${filter.value}"`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="pb-5 border-b border-gray-200 mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Routes</h1>
        <div className="flex items-center space-x-2">
          <div className="mr-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setRouteType(ROUTE_TYPES.MO)}
                className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg ${
                  routeType === ROUTE_TYPES.MO 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                MO Routes
              </button>
              <button
                onClick={() => setRouteType(ROUTE_TYPES.MT)}
                className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg ${
                  routeType === ROUTE_TYPES.MT 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                MT Routes
              </button>
            </div>
          </div>
          <button 
            onClick={fetchRoutes} 
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlineRefresh className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <Link
            to={`/routes/create?type=${routeType}`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlinePlus className="mr-2 h-4 w-4" />
            Add {routeType.toUpperCase()} Route
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
          <p>{error}</p>
        </div>
      ) : (
        <Card>
          {routes.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {routes.map(route => (
                <div key={route.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-blue-100 rounded-md">
                        <HiOutlineSwitchHorizontal className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {route.type.toUpperCase()} Route to {route.connectorName}
                        </h3>
                        <div className="text-sm text-gray-500">
                          Priority: {route.priority} • Created: {new Date(route.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFilterExpansion(route.id)}
                        className="p-1 rounded-md hover:bg-gray-100"
                        title="Show Filters"
                      >
                        {expandedFilters[route.id] ? (
                          <HiOutlineChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      <Link
                        to={`/routes/edit/${route.id}`}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-1 rounded-md"
                        title="Edit Route"
                      >
                        <HiOutlinePencilAlt className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/routes/config/${route.id}`}
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 p-1 rounded-md"
                        title="Configure Route"
                      >
                        <HiOutlineCog className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(route)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 p-1 rounded-md"
                        title="Delete Route"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {expandedFilters[route.id] && (
                    <div className="mt-4 pl-16 pr-4 py-3 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Filters:</h4>
                      {route.filters.length > 0 ? (
                        <div className="space-y-2">
                          {route.filters.map(filter => (
                            <div key={filter.id} className="bg-white p-2 rounded border border-gray-200">
                              <span className="text-sm">{getFilterDescription(filter)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No filters defined (matches all messages)</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No {routeType.toUpperCase()} routes found. Click "Add Route" to create one.</p>
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedRoute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Route</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this {selectedRoute.type.toUpperCase()} route to {selectedRoute.connectorName}? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteRoute(selectedRoute.id)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedRoute(null);
                  }}
                  className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;