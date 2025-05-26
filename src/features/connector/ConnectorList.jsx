import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ServerIcon, 
  PlusIcon,
  TrashIcon, 
  PencilSquareIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  SignalIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import DataTable from '../../components/ui/DataTable';

/**
 * ConnectorList Component - Lists and manages SMPP and HTTP connectors
 */
function ConnectorList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('smpp'); // 'smpp' or 'http'
  const [connectors, setConnectors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessages, setStatusMessages] = useState({});

  // Mock data for development (will be replaced with actual API calls)
  const mockSmppConnectors = [
    {
      id: 'smpp1',
      cid: 'carrier1',
      type: 'smpp',
      host: 'smpp.carrier1.com',
      port: 2775,
      username: 'jasmin1',
      status: 'connected',
      bindOperation: 'transceiver',
      createdAt: '2023-06-15T10:30:00Z',
      lastActivity: '2023-09-18T15:45:22Z',
    },
    {
      id: 'smpp2',
      cid: 'carrier2',
      type: 'smpp',
      host: 'smpp.carrier2.com',
      port: 2775,
      username: 'jasmin2',
      status: 'disconnected',
      bindOperation: 'transmitter',
      createdAt: '2023-07-22T14:20:00Z',
      lastActivity: '2023-09-17T09:12:45Z',
    },
  ];

  const mockHttpConnectors = [
    {
      id: 'http1',
      cid: 'api1',
      type: 'http',
      baseUrl: 'https://api.provider1.com/send',
      method: 'POST',
      status: 'active',
      createdAt: '2023-05-10T08:15:00Z',
      lastActivity: '2023-09-18T16:30:10Z',
    },
    {
      id: 'http2',
      cid: 'api2',
      type: 'http',
      baseUrl: 'https://api.provider2.com/sms',
      method: 'GET',
      status: 'inactive',
      createdAt: '2023-08-05T11:45:00Z',
      lastActivity: '2023-09-15T14:22:33Z',
    },
  ];

  // Fetch connectors based on active tab
  useEffect(() => {
    const fetchConnectors = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // Example: const response = await api.get(`/connectors/${activeTab}`);
        
        // Using mock data for development
        setTimeout(() => {
          if (activeTab === 'smpp') {
            setConnectors(mockSmppConnectors);
          } else {
            setConnectors(mockHttpConnectors);
          }
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(`Failed to fetch ${activeTab.toUpperCase()} connectors: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchConnectors();
  }, [activeTab]);

  // Handle connector restart
  const handleRestartConnector = async (connector) => {
    setStatusMessages({ ...statusMessages, [connector.id]: { type: 'info', message: `Restarting ${connector.type.toUpperCase()} connector: ${connector.cid}...` } });
    
    try {
      // In a real app, this would be an API call
      // Example: await api.post(`/connectors/${connector.type}/${connector.id}/restart`);
      
      // Mock restart with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update connector status in UI
      const updatedConnectors = connectors.map(c => 
        c.id === connector.id 
          ? { ...c, status: c.type === 'smpp' ? 'connected' : 'active' } 
          : c
      );
      setConnectors(updatedConnectors);
      
      setStatusMessages({ 
        ...statusMessages, 
        [connector.id]: { 
          type: 'success', 
          message: `${connector.type.toUpperCase()} connector ${connector.cid} restarted successfully.`,
          autoClose: 3000
        } 
      });
    } catch (err) {
      setStatusMessages({ 
        ...statusMessages, 
        [connector.id]: { 
          type: 'error', 
          message: `Failed to restart ${connector.type.toUpperCase()} connector: ${err.message}`
        } 
      });
    }
  };

  // Handle connector stop
  const handleStopConnector = async (connector) => {
    setStatusMessages({ ...statusMessages, [connector.id]: { type: 'info', message: `Stopping ${connector.type.toUpperCase()} connector: ${connector.cid}...` } });
    
    try {
      // In a real app, this would be an API call
      // Example: await api.post(`/connectors/${connector.type}/${connector.id}/stop`);
      
      // Mock stop with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update connector status in UI
      const updatedConnectors = connectors.map(c => 
        c.id === connector.id 
          ? { ...c, status: c.type === 'smpp' ? 'disconnected' : 'inactive' } 
          : c
      );
      setConnectors(updatedConnectors);
      
      setStatusMessages({ 
        ...statusMessages, 
        [connector.id]: { 
          type: 'success', 
          message: `${connector.type.toUpperCase()} connector ${connector.cid} stopped successfully.`,
          autoClose: 3000
        } 
      });
    } catch (err) {
      setStatusMessages({ 
        ...statusMessages, 
        [connector.id]: { 
          type: 'error', 
          message: `Failed to stop ${connector.type.toUpperCase()} connector: ${err.message}`
        } 
      });
    }
  };

  // Handle connector delete
  const handleDeleteConnector = async (connector) => {
    if (!window.confirm(`Are you sure you want to delete the ${connector.type.toUpperCase()} connector "${connector.cid}"?`)) {
      return;
    }
    
    setStatusMessages({ ...statusMessages, [connector.id]: { type: 'info', message: `Deleting ${connector.type.toUpperCase()} connector: ${connector.cid}...` } });
    
    try {
      // In a real app, this would be an API call
      // Example: await api.delete(`/connectors/${connector.type}/${connector.id}`);
      
      // Mock delete with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove connector from UI
      setConnectors(connectors.filter(c => c.id !== connector.id));
      
      // Remove status message for deleted connector
      const newStatusMessages = { ...statusMessages };
      delete newStatusMessages[connector.id];
      setStatusMessages(newStatusMessages);
      
      // Show temporary success message
      setError({ type: 'success', message: `${connector.type.toUpperCase()} connector ${connector.cid} deleted successfully.`, autoClose: 3000 });
    } catch (err) {
      setStatusMessages({ 
        ...statusMessages, 
        [connector.id]: { 
          type: 'error', 
          message: `Failed to delete ${connector.type.toUpperCase()} connector: ${err.message}`
        } 
      });
    }
  };

  // Handle adding new connector
  const handleAddConnector = () => {
    navigate(`/connectors/${activeTab}/new`);
  };

  // Handle editing connector
  const handleEditConnector = (connector) => {
    navigate(`/connectors/${connector.type}/${connector.id}`);
  };

  // Table columns for SMPP connectors
  const smppColumns = [
    { key: 'cid', header: 'Connector ID', sortable: true },
    { key: 'host', header: 'Host', sortable: true },
    { key: 'port', header: 'Port', sortable: true },
    { key: 'bindOperation', header: 'Bind Operation', sortable: true },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (status) => {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status === 'connected' ? (
              <SignalIcon className="mr-1 h-3 w-3" />
            ) : (
              <SignalSlashIcon className="mr-1 h-3 w-3" />
            )}
            {status === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, connector) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditConnector(connector)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit connector"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          {connector.status === 'connected' ? (
            <button
              onClick={() => handleStopConnector(connector)}
              className="text-amber-600 hover:text-amber-800"
              title="Stop connector"
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => handleRestartConnector(connector)}
              className="text-green-600 hover:text-green-800"
              title="Restart connector"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => handleDeleteConnector(connector)}
            className="text-red-600 hover:text-red-800"
            title="Delete connector"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  // Table columns for HTTP connectors
  const httpColumns = [
    { key: 'cid', header: 'Connector ID', sortable: true },
    { key: 'baseUrl', header: 'URL', sortable: true },
    { key: 'method', header: 'Method', sortable: true },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (status) => {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status === 'active' ? (
              <SignalIcon className="mr-1 h-3 w-3" />
            ) : (
              <SignalSlashIcon className="mr-1 h-3 w-3" />
            )}
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, connector) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditConnector(connector)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit connector"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          {connector.status === 'active' ? (
            <button
              onClick={() => handleStopConnector(connector)}
              className="text-amber-600 hover:text-amber-800"
              title="Disable connector"
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => handleRestartConnector(connector)}
              className="text-green-600 hover:text-green-800"
              title="Enable connector"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => handleDeleteConnector(connector)}
            className="text-red-600 hover:text-red-800"
            title="Delete connector"
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
        <h1 className="text-2xl font-bold text-gray-800">Connectors</h1>
        <Button 
          variant="primary" 
          onClick={handleAddConnector}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add {activeTab.toUpperCase()} Connector
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
                activeTab === 'smpp'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('smpp')}
            >
              <ServerIcon className="h-5 w-5 inline mr-2" />
              SMPP Connectors
            </button>
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'http'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('http')}
            >
              <ServerIcon className="h-5 w-5 inline mr-2" />
              HTTP Connectors
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

        {/* Connectors Table */}
        <DataTable
          columns={activeTab === 'smpp' ? smppColumns : httpColumns}
          data={connectors}
          isLoading={isLoading}
          emptyMessage={`No ${activeTab.toUpperCase()} connectors found. Click "Add ${activeTab.toUpperCase()} Connector" to create one.`}
          className="p-4"
        />
      </div>
    </div>
  );
}

export default ConnectorList;