import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Card from '../../components/ui/Card';

/**
 * RouteForm Component - Form for adding or editing MT/MO routes
 */
function RouteForm() {
  const { type, id } = useParams(); // type = 'mt' or 'mo', id = route ID or 'new'
  const navigate = useNavigate();
  const isNew = id === 'new';
  const isMT = type === 'mt';
  const [route, setRoute] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const [filters, setFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const { register, handleSubmit, control, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      id: '',
      order: 0,
      type: isMT ? 'DefaultRoute' : 'DefaultRoute',
      connectorId: '',
      rate: '',
      filters: [],
      status: 'active',
    }
  });

  const routeType = watch('type');

  // Mock data for development (will be replaced with actual API calls)
  const mockMtRoutes = {
    'mt1': {
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
    'mt2': {
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
  };

  const mockMoRoutes = {
    'mo1': {
      id: 'mo1',
      order: 0,
      type: 'DefaultRoute',
      connectorId: 'api1',
      filters: [],
      status: 'active',
      createdAt: '2023-06-10T08:15:00Z',
      updatedAt: '2023-09-12T16:30:10Z',
    },
    'mo2': {
      id: 'mo2',
      order: 1,
      type: 'StaticMORoute',
      connectorId: 'api2',
      filters: ['filter4', 'filter5'],
      status: 'disabled',
      createdAt: '2023-08-05T11:45:00Z',
      updatedAt: '2023-09-08T14:22:33Z',
    },
  };

  // Mock connectors based on the route type
  const mockSMPPConnectors = [
    { id: 'carrier1', cid: 'carrier1', type: 'smpp' },
    { id: 'carrier2', cid: 'carrier2', type: 'smpp' }
  ];

  const mockHTTPConnectors = [
    { id: 'api1', cid: 'api1', type: 'http' },
    { id: 'api2', cid: 'api2', type: 'http' }
  ];

  // Mock filters
  const mockFilters = [
    { id: 'filter1', name: 'Country Filter (US)' },
    { id: 'filter2', name: 'Operator Filter (T-Mobile)' },
    { id: 'filter3', name: 'Time of Day Filter (Business Hours)' },
    { id: 'filter4', name: 'Content Filter (Marketing)' },
    { id: 'filter5', name: 'Sender Filter (Short Code 12345)' }
  ];

  // Fetch route data for editing
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, these would be parallel API calls
        
        // 1. Fetch route data if editing
        if (!isNew) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const mockRoutes = isMT ? mockMtRoutes : mockMoRoutes;
          
          if (mockRoutes[id]) {
            setRoute(mockRoutes[id]);
            
            // Populate form with route data
            Object.keys(mockRoutes[id]).forEach(key => {
              setValue(key, mockRoutes[id][key]);
            });
          } else {
            setError(`${type.toUpperCase()} route with ID ${id} not found.`);
          }
        }
        
        // 2. Fetch available connectors
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // MT routes use SMPP connectors, MO routes use HTTP connectors
        setConnectors(isMT ? mockSMPPConnectors : mockHTTPConnectors);
        
        // 3. Fetch available filters
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        setFilters(mockFilters);
        
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isNew, isMT, id, setValue, type]);
  
  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format numeric values
      if (data.rate) {
        data.rate = parseFloat(data.rate);
      }
      
      // In a real app, this would be an API call
      // Example for create: await api.post(`/routes/${type}`, data);
      // Example for update: await api.put(`/routes/${type}/${id}`, data);
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitting(false);
      
      if (isNew) {
        setSuccessMessage(`${type.toUpperCase()} route created successfully.`);
      } else {
        setSuccessMessage(`${type.toUpperCase()} route updated successfully.`);
      }
      
      // After a successful update, navigate back to the routes list after a short delay
      setTimeout(() => {
        navigate('/routes');
      }, 1500);
    } catch (err) {
      setError(`Failed to ${isNew ? 'create' : 'update'} route: ${err.message}`);
      setIsSubmitting(false);
    }
  };
  
  // Handle cancellation
  const handleCancel = () => {
    navigate('/routes');
  };
  
  // Show loading state
  if (isLoading && !isNew) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? `New ${type.toUpperCase()} Route` : `Edit ${type.toUpperCase()} Route`}
          </h1>
        </div>
        <Card className="p-8 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading route data...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isNew ? `New ${type.toUpperCase()} Route` : `Edit ${type.toUpperCase()} Route`}
        </h1>
        <Button
          variant="secondary"
          onClick={() => navigate('/routes')}
          className="flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Routes
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          dismissible
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          dismissible
          onClose={() => setSuccessMessage(null)}
          className="mb-4"
        />
      )}

      <Card
        title={isNew ? `Create ${type.toUpperCase()} Route` : `Edit ${type.toUpperCase()} Route ID: ${id}`}
        subtitle={
          isMT 
            ? "MT routes determine how outgoing messages are routed to SMPP providers."
            : "MO routes determine how incoming messages are processed by HTTP applications."
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Route Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Route Type*
            </label>
            <select
              id="type"
              {...register('type', { required: 'Route type is required' })}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.type ? 'border-red-500' : ''}`}
            >
              <option value="DefaultRoute">Default Route</option>
              {isMT ? (
                <>
                  <option value="StaticMTRoute">Static MT Route</option>
                  <option value="RandomMTRoute">Random MT Route</option>
                  <option value="RoundRobinMTRoute">Round-Robin MT Route</option>
                </>
              ) : (
                <>
                  <option value="StaticMORoute">Static MO Route</option>
                  <option value="RandomMORoute">Random MO Route</option>
                </>
              )}
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {routeType === 'DefaultRoute' && 'The default route will be used when no other routes match.'}
              {routeType === 'StaticMTRoute' && 'Static MT routes use a fixed connector for matching messages.'}
              {routeType === 'RandomMTRoute' && 'Random MT routes randomly select among multiple connectors.'}
              {routeType === 'RoundRobinMTRoute' && 'Round-robin MT routes distribute traffic evenly among connectors.'}
              {routeType === 'StaticMORoute' && 'Static MO routes forward matching messages to a specific HTTP connector.'}
              {routeType === 'RandomMORoute' && 'Random MO routes randomly select among multiple HTTP connectors.'}
            </p>
          </div>
          
          {/* Connector */}
          <div>
            <label htmlFor="connectorId" className="block text-sm font-medium text-gray-700">
              Connector*
            </label>
            <select
              id="connectorId"
              {...register('connectorId', { required: 'Connector is required' })}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.connectorId ? 'border-red-500' : ''}`}
            >
              <option value="">Select a connector</option>
              {connectors.map(connector => (
                <option key={connector.id} value={connector.id}>
                  {connector.cid} ({connector.type.toUpperCase()})
                </option>
              ))}
            </select>
            {errors.connectorId && <p className="mt-1 text-sm text-red-600">{errors.connectorId.message}</p>}
          </div>
          
          {/* Rate (MT routes only) */}
          {isMT && (
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                Rate (per message)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register('rate', {
                    pattern: {
                      value: /^\d*\.?\d{0,4}$/,
                      message: 'Please enter a valid rate (up to 4 decimal places)'
                    }
                  })}
                  className={`pl-7 mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.rate ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.rate && <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>}
              <p className="mt-1 text-xs text-gray-500">Optional. Used for billing and reporting.</p>
            </div>
          )}
          
          {/* Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filters
            </label>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              {filters.length > 0 ? (
                filters.map(filter => (
                  <div key={filter.id} className="flex items-center mb-2 last:mb-0">
                    <input
                      id={`filter-${filter.id}`}
                      type="checkbox"
                      value={filter.id}
                      {...register('filters')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`filter-${filter.id}`} className="ml-2 block text-sm text-gray-700">
                      {filter.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No filters available</p>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">Optional. Select filters that should apply to this route.</p>
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-2">
              <div className="flex items-center">
                <input
                  id="active"
                  type="radio"
                  value="active"
                  {...register('status')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex items-center mt-2">
                <input
                  id="disabled"
                  type="radio"
                  value="disabled"
                  {...register('status')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="disabled" className="ml-2 block text-sm text-gray-700">
                  Disabled
                </label>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button 
              variant="secondary" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={isSubmitting}
            >
              {isNew ? 'Create Route' : 'Update Route'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RouteForm;