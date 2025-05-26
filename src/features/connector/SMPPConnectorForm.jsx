import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';

/**
 * SMPP Connector Form - Form for adding or editing SMPP connectors
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.connector] - Connector data for editing (null for new connector)
 * @param {Function} props.onSubmit - Function called when form is submitted
 * @param {Function} props.onCancel - Function called when form is cancelled
 * @param {boolean} [props.isSubmitting=false] - Whether form is currently submitting
 */
function SMPPConnectorForm({ connector, onSubmit, onCancel, isSubmitting = false }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      id: '',
      cid: '',
      host: '',
      port: 2775,
      username: '',
      password: '',
      systemType: '',
      bindOperation: 'transceiver',
      bindNpi: 'unknown',
      bindTon: 'unknown',
      addressRange: '',
      logLevel: 'INFO',
      logFile: '/var/log/jasmin/default-smpp-connector.log',
      logRotate: 'midnight',
      logDateFormat: '%Y-%m-%d %H:%M:%S',
      connectionTimeout: 30,
      reconnectOnConnectionFailure: true,
      reconnectOnConnectionLoss: true,
      reconnectInterval: 10.0,
      useSSL: false,
    }
  });
  
  const [error, setError] = useState(null);

  // Fill form with connector data when editing
  useEffect(() => {
    if (connector) {
      // Map connector object to form fields
      Object.keys(connector).forEach(key => {
        setValue(key, connector[key]);
      });
    }
  }, [connector, setValue]);

  const onFormSubmit = (data) => {
    try {
      // Convert numeric fields from strings
      const formattedData = {
        ...data,
        port: parseInt(data.port, 10),
        connectionTimeout: parseInt(data.connectionTimeout, 10),
        reconnectInterval: parseFloat(data.reconnectInterval),
        reconnectOnConnectionFailure: Boolean(data.reconnectOnConnectionFailure),
        reconnectOnConnectionLoss: Boolean(data.reconnectOnConnectionLoss),
        useSSL: Boolean(data.useSSL)
      };
      
      onSubmit(formattedData);
    } catch (err) {
      setError('Error processing form data: ' + err.message);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Card
      title={connector ? `Edit SMPP Connector: ${connector.cid}` : 'Add New SMPP Connector'}
      className="mb-6"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {error && (
          <Alert 
            type="error" 
            message={error} 
            dismissible 
            onClose={() => setError(null)} 
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Settings Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Basic Settings</h4>
            
            <div>
              <label htmlFor="cid" className="block text-sm font-medium text-gray-700">
                Connector ID*
              </label>
              <input
                id="cid"
                type="text"
                {...register('cid', { 
                  required: 'Connector ID is required',
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: 'Connector ID can only contain letters, numbers, underscores and hyphens'
                  }
                })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.cid ? 'border-red-500' : ''}`}
              />
              {errors.cid && <p className="mt-1 text-sm text-red-600">{errors.cid.message}</p>}
            </div>
            
            <div>
              <label htmlFor="host" className="block text-sm font-medium text-gray-700">
                Host*
              </label>
              <input
                id="host"
                type="text"
                {...register('host', { required: 'Host is required' })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.host ? 'border-red-500' : ''}`}
              />
              {errors.host && <p className="mt-1 text-sm text-red-600">{errors.host.message}</p>}
            </div>
            
            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                Port*
              </label>
              <input
                id="port"
                type="number"
                {...register('port', { 
                  required: 'Port is required',
                  min: { value: 1, message: 'Port must be at least 1' },
                  max: { value: 65535, message: 'Port must be at most 65535' }
                })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.port ? 'border-red-500' : ''}`}
              />
              {errors.port && <p className="mt-1 text-sm text-red-600">{errors.port.message}</p>}
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username*
              </label>
              <input
                id="username"
                type="text"
                {...register('username', { required: 'Username is required' })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.username ? 'border-red-500' : ''}`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password*
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            
            <div>
              <label htmlFor="bindOperation" className="block text-sm font-medium text-gray-700">
                Bind Operation
              </label>
              <select
                id="bindOperation"
                {...register('bindOperation')}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              >
                <option value="transceiver">Transceiver</option>
                <option value="transmitter">Transmitter</option>
                <option value="receiver">Receiver</option>
              </select>
            </div>
          </div>
          
          {/* Advanced Settings Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Advanced Settings</h4>
            
            <div>
              <label htmlFor="systemType" className="block text-sm font-medium text-gray-700">
                System Type
              </label>
              <input
                id="systemType"
                type="text"
                {...register('systemType')}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              />
            </div>
            
            <div>
              <label htmlFor="bindNpi" className="block text-sm font-medium text-gray-700">
                Bind NPI
              </label>
              <select
                id="bindNpi"
                {...register('bindNpi')}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              >
                <option value="unknown">Unknown</option>
                <option value="isdn">ISDN</option>
                <option value="data">Data</option>
                <option value="telex">Telex</option>
                <option value="land_mobile">Land Mobile</option>
                <option value="national">National</option>
                <option value="private">Private</option>
                <option value="ermes">ERMES</option>
                <option value="internet">Internet</option>
                <option value="wap_client_id">WAP Client ID</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="bindTon" className="block text-sm font-medium text-gray-700">
                Bind TON
              </label>
              <select
                id="bindTon"
                {...register('bindTon')}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              >
                <option value="unknown">Unknown</option>
                <option value="international">International</option>
                <option value="national">National</option>
                <option value="network_specific">Network Specific</option>
                <option value="subscriber_number">Subscriber Number</option>
                <option value="alphanumeric">Alphanumeric</option>
                <option value="abbreviated">Abbreviated</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="addressRange" className="block text-sm font-medium text-gray-700">
                Address Range
              </label>
              <input
                id="addressRange"
                type="text"
                {...register('addressRange')}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              />
              <p className="mt-1 text-xs text-gray-500">SMPP address range for routing</p>
            </div>
            
            <div>
              <label htmlFor="logLevel" className="block text-sm font-medium text-gray-700">
                Log Level
              </label>
              <select
                id="logLevel"
                {...register('logLevel')}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              >
                <option value="DEBUG">Debug</option>
                <option value="INFO">Info</option>
                <option value="WARNING">Warning</option>
                <option value="ERROR">Error</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="connectionTimeout" className="block text-sm font-medium text-gray-700">
                Connection Timeout (seconds)
              </label>
              <input
                id="connectionTimeout"
                type="number"
                {...register('connectionTimeout', { 
                  min: { value: 1, message: 'Timeout must be at least 1 second' }
                })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.connectionTimeout ? 'border-red-500' : ''}`}
              />
              {errors.connectionTimeout && <p className="mt-1 text-sm text-red-600">{errors.connectionTimeout.message}</p>}
            </div>
          </div>
        </div>
        
        {/* Connection Options */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-semibold text-gray-900 mb-4">Connection Options</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                id="reconnectOnConnectionFailure"
                type="checkbox"
                {...register('reconnectOnConnectionFailure')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="reconnectOnConnectionFailure" className="ml-2 block text-sm text-gray-700">
                Reconnect on Connection Failure
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="reconnectOnConnectionLoss"
                type="checkbox"
                {...register('reconnectOnConnectionLoss')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="reconnectOnConnectionLoss" className="ml-2 block text-sm text-gray-700">
                Reconnect on Connection Loss
              </label>
            </div>
            
            <div>
              <label htmlFor="reconnectInterval" className="block text-sm font-medium text-gray-700">
                Reconnect Interval (seconds)
              </label>
              <input
                id="reconnectInterval"
                type="number"
                step="0.1"
                {...register('reconnectInterval', {
                  min: { value: 0.1, message: 'Interval must be at least 0.1 seconds' }
                })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.reconnectInterval ? 'border-red-500' : ''}`}
              />
              {errors.reconnectInterval && <p className="mt-1 text-sm text-red-600">{errors.reconnectInterval.message}</p>}
            </div>
            
            <div className="flex items-center">
              <input
                id="useSSL"
                type="checkbox"
                {...register('useSSL')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="useSSL" className="ml-2 block text-sm text-gray-700">
                Use SSL
              </label>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
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
            {connector ? 'Update Connector' : 'Create Connector'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

SMPPConnectorForm.propTypes = {
  connector: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default SMPPConnectorForm;