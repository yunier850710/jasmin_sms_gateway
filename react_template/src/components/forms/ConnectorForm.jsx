import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  HiOutlineServer,
  HiOutlineLockClosed,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
  HiOutlineExclamation,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { api } from '../../services/api';

const ConnectorForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const cloneFrom = location.state?.cloneFrom;
  
  const [loading, setLoading] = useState(isEdit || cloneFrom);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: '2775',
    systemId: '',
    password: '',
    systemType: '',
    addressRange: '',
    bindTON: '0',
    bindNPI: '1',
    reconnectOnConnectionFailure: true,
    reconnectOnConnectionLoss: true,
    reconnectOnSubmitFailure: true,
    reconnectIntervalSecs: '30'
  });

  useEffect(() => {
    const fetchConnectorDetails = async () => {
      if (!isEdit && !cloneFrom) return;
      
      try {
        setLoading(true);
        let connectorData = null;
        
        if (isEdit) {
          // In a real implementation, this would call the API
          // For now, use mock data
          if (id === '1') {
            connectorData = {
              id: '1',
              name: 'Production SMPP',
              host: 'smpp.example.com',
              port: '2775',
              systemId: 'prod_user',
              password: '********', // Masked for security
              systemType: 'transceiver',
              addressRange: '',
              bindTON: '0',
              bindNPI: '1',
              reconnectOnConnectionFailure: true,
              reconnectOnConnectionLoss: true,
              reconnectOnSubmitFailure: true,
              reconnectIntervalSecs: '30',
              status: 'connected',
            };
          } else {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            throw new Error('Connector not found');
          }
        } else if (cloneFrom) {
          connectorData = {
            ...cloneFrom,
            name: `${cloneFrom.name} (Copy)`,
            password: '',
          };
        }
        
        if (connectorData) {
          setFormData(prev => ({
            ...prev,
            ...connectorData
          }));
        }
        
      } catch (err) {
        setError(`Failed to fetch connector details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchConnectorDetails();
  }, [id, isEdit, cloneFrom]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.host.trim()) errors.host = 'Host is required';
    if (!formData.port.trim()) errors.port = 'Port is required';
    if (!formData.systemId.trim()) errors.systemId = 'System ID is required';
    if (!isEdit && !formData.password.trim()) errors.password = 'Password is required';
    
    // Port should be a number between 1 and 65535
    const port = parseInt(formData.port, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.port = 'Port must be a number between 1 and 65535';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join('. ');
      setError(errorMessage);
      return;
    }
    
    setError(null);
    setSubmitting(true);
    
    try {
      if (isEdit) {
        // In a real implementation, this would call the API
        // await api.updateConnector(id, formData);
        console.log('Updating connector:', id, formData);
      } else {
        // In a real implementation, this would call the API
        // await api.createConnector(formData);
        console.log('Creating new connector:', formData);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/connectors');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} connector: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (label, name, type = 'text', icon, placeholder = '', tooltip = '') => {
    return (
      <div className="col-span-6 sm:col-span-3">
        <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {label}
          {tooltip && (
            <div className="group relative ml-2">
              <HiOutlineQuestionMarkCircle className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                {tooltip}
              </div>
            </div>
          )}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          {type === 'checkbox' ? (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={name}
                name={name}
                checked={formData[name]}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">{placeholder}</span>
            </div>
          ) : (
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`${icon ? 'pl-10' : 'pl-3'} block w-full pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
          )}
        </div>
      </div>
    );
  };

  const renderSelect = (label, name, options, icon, tooltip = '') => {
    return (
      <div className="col-span-6 sm:col-span-3">
        <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {label}
          {tooltip && (
            <div className="group relative ml-2">
              <HiOutlineQuestionMarkCircle className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                {tooltip}
              </div>
            </div>
          )}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <select
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`${icon ? 'pl-10' : 'pl-3'} block w-full pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="pb-5 border-b border-gray-200 mb-5">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit SMPP Connector' : 'Add New SMPP Connector'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <HiOutlineExclamation className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-6 gap-6">
            {/* Basic Information */}
            <div className="col-span-6">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Basic configuration for the SMPP connector.
              </p>
            </div>
            
            {renderField(
              'Name', 
              'name', 
              'text', 
              <HiOutlineIdentification className="h-5 w-5 text-gray-400" />, 
              'Enter a descriptive name'
            )}
            
            {renderField(
              'Host', 
              'host', 
              'text', 
              <HiOutlineGlobeAlt className="h-5 w-5 text-gray-400" />, 
              'SMSC host address'
            )}
            
            {renderField(
              'Port', 
              'port', 
              'number', 
              <HiOutlineServer className="h-5 w-5 text-gray-400" />, 
              'SMSC port (usually 2775)'
            )}
            
            {renderField(
              'System ID', 
              'systemId', 
              'text', 
              <HiOutlineIdentification className="h-5 w-5 text-gray-400" />, 
              'Login username'
            )}
            
            {renderField(
              'Password', 
              'password', 
              'password', 
              <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />, 
              isEdit ? 'Leave blank to keep current password' : 'Login password'
            )}
            
            {renderSelect(
              'System Type', 
              'systemType', 
              [
                { value: '', label: 'None (default)' },
                { value: 'transceiver', label: 'Transceiver' },
                { value: 'receiver', label: 'Receiver' },
                { value: 'transmitter', label: 'Transmitter' }
              ],
              <HiOutlineServer className="h-5 w-5 text-gray-400" />,
              'SMPP system type identifier. Leave blank if not required by your provider.'
            )}
            
            {/* Advanced Configuration */}
            <div className="col-span-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900">Advanced Configuration</h2>
              <p className="mt-1 text-sm text-gray-500">
                Optional advanced settings for the SMPP connection.
              </p>
            </div>
            
            {renderField(
              'Address Range', 
              'addressRange', 
              'text', 
              null, 
              'Optional range of addresses',
              'Address range filter for inbound sessions. Leave blank for no filtering.'
            )}
            
            {renderSelect(
              'Bind TON', 
              'bindTON', 
              [
                { value: '0', label: 'Unknown (0)' },
                { value: '1', label: 'International (1)' },
                { value: '2', label: 'National (2)' },
                { value: '3', label: 'Network specific (3)' },
                { value: '4', label: 'Subscriber number (4)' },
                { value: '5', label: 'Alphanumeric (5)' },
                { value: '6', label: 'Abbreviated (6)' }
              ],
              null,
              'Type of Number parameter for the ESME address'
            )}
            
            {renderSelect(
              'Bind NPI', 
              'bindNPI', 
              [
                { value: '0', label: 'Unknown (0)' },
                { value: '1', label: 'ISDN/E.164 (1)' },
                { value: '3', label: 'Data (3)' },
                { value: '4', label: 'Telex (4)' },
                { value: '6', label: 'Land mobile (6)' },
                { value: '8', label: 'National (8)' },
                { value: '9', label: 'Private (9)' },
                { value: '10', label: 'ERMES (10)' },
                { value: '14', label: 'Internet/IP (14)' },
                { value: '18', label: 'WAP Client Id (18)' }
              ],
              null,
              'Numbering Plan Indicator parameter for the ESME address'
            )}
            
            {/* Reconnection Settings */}
            <div className="col-span-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900">Reconnection Settings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure how the connector handles connection issues.
              </p>
            </div>
            
            {renderField(
              'Reconnect on Connection Failure', 
              'reconnectOnConnectionFailure', 
              'checkbox', 
              null, 
              'Automatically try to reconnect if initial connection fails'
            )}
            
            {renderField(
              'Reconnect on Connection Loss', 
              'reconnectOnConnectionLoss', 
              'checkbox', 
              null, 
              'Automatically try to reconnect if an established connection is lost'
            )}
            
            {renderField(
              'Reconnect on Submit Failure', 
              'reconnectOnSubmitFailure', 
              'checkbox', 
              null, 
              'Automatically try to reconnect if message submission fails'
            )}
            
            {renderField(
              'Reconnect Interval (seconds)', 
              'reconnectIntervalSecs', 
              'number', 
              null, 
              '30',
              'Time in seconds between reconnection attempts'
            )}
          </div>
          
          <div className="flex justify-end mt-8 space-x-3">
            <button
              type="button"
              onClick={() => navigate('/connectors')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {submitting ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
                </div>
              ) : (
                <span>{isEdit ? 'Save Changes' : 'Create Connector'}</span>
              )}
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ConnectorForm;