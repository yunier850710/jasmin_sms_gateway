import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';

/**
 * HTTP Connector Form - Form for adding or editing HTTP connectors
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.connector] - Connector data for editing (null for new connector)
 * @param {Function} props.onSubmit - Function called when form is submitted
 * @param {Function} props.onCancel - Function called when form is cancelled
 * @param {boolean} [props.isSubmitting=false] - Whether form is currently submitting
 */
function HTTPConnectorForm({ connector, onSubmit, onCancel, isSubmitting = false }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      id: '',
      cid: '',
      baseUrl: 'http://localhost:13013/send',
      method: 'POST',
      timeout: 30,
      auth: false,
      username: '',
      password: '',
      logLevel: 'INFO',
      logFile: '/var/log/jasmin/default-http-connector.log',
      logRotate: 'midnight',
      logDateFormat: '%Y-%m-%d %H:%M:%S',
      useSSL: false,
    }
  });
  
  const [error, setError] = useState(null);
  const [useAuthentication, setUseAuthentication] = useState(false);

  // Fill form with connector data when editing
  useEffect(() => {
    if (connector) {
      // Map connector object to form fields
      Object.keys(connector).forEach(key => {
        setValue(key, connector[key]);
      });
      
      // Set authentication state
      setUseAuthentication(connector.auth || false);
    }
  }, [connector, setValue]);

  const onFormSubmit = (data) => {
    try {
      // Convert numeric fields from strings
      const formattedData = {
        ...data,
        timeout: parseInt(data.timeout, 10),
        auth: Boolean(data.auth),
        useSSL: Boolean(data.useSSL)
      };
      
      // If auth is disabled, clear credentials
      if (!formattedData.auth) {
        formattedData.username = '';
        formattedData.password = '';
      }
      
      onSubmit(formattedData);
    } catch (err) {
      setError('Error processing form data: ' + err.message);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleAuthToggle = () => {
    setUseAuthentication(!useAuthentication);
  };

  return (
    <Card
      title={connector ? `Edit HTTP Connector: ${connector.cid}` : 'Add New HTTP Connector'}
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
              <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700">
                Base URL*
              </label>
              <input
                id="baseUrl"
                type="text"
                {...register('baseUrl', { 
                  required: 'Base URL is required',
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message: 'Must be a valid URL starting with http:// or https://'
                  }
                })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.baseUrl ? 'border-red-500' : ''}`}
              />
              {errors.baseUrl && <p className="mt-1 text-sm text-red-600">{errors.baseUrl.message}</p>}
              <p className="mt-1 text-xs text-gray-500">The HTTP endpoint URL (e.g., http://example.com/api/send)</p>
            </div>
            
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                HTTP Method
              </label>
              <select
                id="method"
                {...register('method')}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timeout" className="block text-sm font-medium text-gray-700">
                Timeout (seconds)*
              </label>
              <input
                id="timeout"
                type="number"
                {...register('timeout', { 
                  required: 'Timeout is required',
                  min: { value: 1, message: 'Timeout must be at least 1 second' }
                })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.timeout ? 'border-red-500' : ''}`}
              />
              {errors.timeout && <p className="mt-1 text-sm text-red-600">{errors.timeout.message}</p>}
            </div>
          </div>
          
          {/* Authentication Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Authentication & Logging</h4>
            
            <div className="flex items-center">
              <input
                id="auth"
                type="checkbox"
                {...register('auth')}
                checked={useAuthentication}
                onChange={handleAuthToggle}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="auth" className="ml-2 block text-sm text-gray-700">
                Use Authentication
              </label>
            </div>
            
            {useAuthentication && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username*
                  </label>
                  <input
                    id="username"
                    type="text"
                    {...register('username', { 
                      required: useAuthentication ? 'Username is required when authentication is enabled' : false
                    })}
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
                    {...register('password', {
                      required: useAuthentication ? 'Password is required when authentication is enabled' : false
                    })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </>
            )}
            
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
              <label htmlFor="logFile" className="block text-sm font-medium text-gray-700">
                Log File Path
              </label>
              <input
                id="logFile"
                type="text"
                {...register('logFile')}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="useSSL"
                type="checkbox"
                {...register('useSSL')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="useSSL" className="ml-2 block text-sm text-gray-700">
                Verify SSL Certificate
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

HTTPConnectorForm.propTypes = {
  connector: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default HTTPConnectorForm;