import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Card from '../../components/ui/Card';
import SMPPConnectorForm from './SMPPConnectorForm';
import HTTPConnectorForm from './HTTPConnectorForm';

/**
 * ConnectorDetail Component - Displays and edits details of a specific connector
 */
function ConnectorDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [connector, setConnector] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Mock data for development (will be replaced with actual API calls)
  const mockSmppConnectors = {
    'smpp1': {
      id: 'smpp1',
      cid: 'carrier1',
      type: 'smpp',
      host: 'smpp.carrier1.com',
      port: 2775,
      username: 'jasmin1',
      password: 'password123',
      systemType: 'SMPP',
      bindOperation: 'transceiver',
      bindNpi: 'unknown',
      bindTon: 'unknown',
      addressRange: '',
      logLevel: 'INFO',
      logFile: '/var/log/jasmin/smpp-carrier1.log',
      logRotate: 'midnight',
      logDateFormat: '%Y-%m-%d %H:%M:%S',
      connectionTimeout: 30,
      reconnectOnConnectionFailure: true,
      reconnectOnConnectionLoss: true,
      reconnectInterval: 10.0,
      useSSL: false,
    },
    'smpp2': {
      id: 'smpp2',
      cid: 'carrier2',
      type: 'smpp',
      host: 'smpp.carrier2.com',
      port: 2775,
      username: 'jasmin2',
      password: 'password456',
      systemType: 'SMS',
      bindOperation: 'transmitter',
      bindNpi: 'isdn',
      bindTon: 'international',
      addressRange: '',
      logLevel: 'WARNING',
      logFile: '/var/log/jasmin/smpp-carrier2.log',
      logRotate: 'midnight',
      logDateFormat: '%Y-%m-%d %H:%M:%S',
      connectionTimeout: 30,
      reconnectOnConnectionFailure: true,
      reconnectOnConnectionLoss: true,
      reconnectInterval: 5.0,
      useSSL: true,
    }
  };

  const mockHttpConnectors = {
    'http1': {
      id: 'http1',
      cid: 'api1',
      type: 'http',
      baseUrl: 'https://api.provider1.com/send',
      method: 'POST',
      timeout: 30,
      auth: true,
      username: 'apiuser1',
      password: 'apisecret1',
      logLevel: 'INFO',
      logFile: '/var/log/jasmin/http-api1.log',
      logRotate: 'midnight',
      logDateFormat: '%Y-%m-%d %H:%M:%S',
      useSSL: true,
    },
    'http2': {
      id: 'http2',
      cid: 'api2',
      type: 'http',
      baseUrl: 'https://api.provider2.com/sms',
      method: 'GET',
      timeout: 15,
      auth: false,
      username: '',
      password: '',
      logLevel: 'WARNING',
      logFile: '/var/log/jasmin/http-api2.log',
      logRotate: 'midnight',
      logDateFormat: '%Y-%m-%d %H:%M:%S',
      useSSL: false,
    }
  };

  // Fetch connector data if not a new connector
  useEffect(() => {
    if (isNew) {
      setIsLoading(false);
      return;
    }

    const fetchConnector = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // Example: const response = await api.get(`/connectors/${type}/${id}`);
        
        // Using mock data for development
        setTimeout(() => {
          if (type === 'smpp') {
            if (mockSmppConnectors[id]) {
              setConnector(mockSmppConnectors[id]);
            } else {
              setError(`SMPP connector with ID ${id} not found.`);
            }
          } else if (type === 'http') {
            if (mockHttpConnectors[id]) {
              setConnector(mockHttpConnectors[id]);
            } else {
              setError(`HTTP connector with ID ${id} not found.`);
            }
          } else {
            setError(`Invalid connector type: ${type}`);
          }
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(`Failed to fetch connector: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchConnector();
  }, [type, id, isNew]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // Example for create: await api.post(`/connectors/${type}`, formData);
      // Example for update: await api.put(`/connectors/${type}/${id}`, formData);
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitting(false);
      
      if (isNew) {
        setSuccessMessage(`${type.toUpperCase()} connector "${formData.cid}" created successfully.`);
      } else {
        setSuccessMessage(`${type.toUpperCase()} connector "${formData.cid}" updated successfully.`);
      }
      
      // After a successful update, navigate back to the connectors list after a short delay
      setTimeout(() => {
        navigate('/connectors');
      }, 1500);
    } catch (err) {
      setError(`Failed to ${isNew ? 'create' : 'update'} connector: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate('/connectors');
  };

  // Show loading state
  if (isLoading && !isNew) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? `New ${type.toUpperCase()} Connector` : `Edit ${type.toUpperCase()} Connector`}
          </h1>
        </div>
        <Card className="p-8 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading connector data...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error && !isNew) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? `New ${type.toUpperCase()} Connector` : `Edit ${type.toUpperCase()} Connector`}
          </h1>
          <Button
            variant="secondary"
            onClick={() => navigate('/connectors')}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Connectors
          </Button>
        </div>
        <Alert
          type="error"
          message={error}
          dismissible
          onClose={() => setError(null)}
          className="mb-4"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isNew ? `New ${type.toUpperCase()} Connector` : `Edit ${type.toUpperCase()} Connector`}
        </h1>
        <Button
          variant="secondary"
          onClick={() => navigate('/connectors')}
          className="flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Connectors
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

      {type === 'smpp' ? (
        <SMPPConnectorForm 
          connector={isNew ? null : connector}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      ) : type === 'http' ? (
        <HTTPConnectorForm 
          connector={isNew ? null : connector}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      ) : (
        <Alert
          type="error"
          message={`Invalid connector type: ${type}`}
          className="mb-4"
        />
      )}
    </div>
  );
}

export default ConnectorDetail;