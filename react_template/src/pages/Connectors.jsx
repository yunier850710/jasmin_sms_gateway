import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HiOutlineServer, 
  HiOutlineRefresh, 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlinePlay,
  HiOutlineStop,
  HiOutlinePlus,
  HiOutlineDocumentDuplicate
} from 'react-icons/hi';
import { fetchConnectors, startConnector, stopConnector } from '../store/connectorSlice';
import { api } from '../services/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import { STATUS } from '../utils/constants';

const Connectors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connectors = useSelector(state => state.connectors.entities);
  const loading = useSelector(state => state.connectors.loading);
  const error = useSelector(state => state.connectors.error);
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchConnectors());
  }, [dispatch]);

  const handleStartConnector = (connectorId) => {
    dispatch(startConnector(connectorId));
  };

  const handleStopConnector = (connectorId) => {
    dispatch(stopConnector(connectorId));
  };

  const handleDeleteConnector = async (connectorId) => {
    try {
      // In a real implementation, this would call the API to delete the connector
      // For now, we'll just update the UI
      // await api.deleteConnector(connectorId);
      dispatch(fetchConnectors()); // Refetch the connectors list after deletion
      setShowDeleteConfirm(false);
      setSelectedConnector(null);
    } catch (err) {
      console.error('Failed to delete connector:', err);
    }
  };

  const confirmDelete = (connector) => {
    setSelectedConnector(connector);
    setShowDeleteConfirm(true);
  };

  const handleCloneConnector = (connector) => {
    navigate(`/connectors/create`, { state: { cloneFrom: connector } });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="pb-5 border-b border-gray-200 mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">SMPP Connectors</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => dispatch(fetchConnectors())} 
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlineRefresh className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <Link
            to="/connectors/create"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlinePlus className="mr-2 h-4 w-4" />
            Add Connector
          </Link>
        </div>
      </div>

      {loading && connectors.length === 0 ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
          <p>{error}</p>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Host
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    System ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages Today
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {connectors.length > 0 ? (
                  connectors.map(connector => (
                    <tr key={connector.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {connector.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {connector.host}:{connector.port}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {connector.systemId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={connector.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {connector.messagesToday?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {connector.deliveryRate ? `${connector.deliveryRate}%` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {connector.status === STATUS.CONNECTED ? (
                            <button
                              onClick={() => handleStopConnector(connector.id)}
                              className="bg-red-100 text-red-700 hover:bg-red-200 p-1 rounded-md"
                              title="Stop Connector"
                            >
                              <HiOutlineStop className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartConnector(connector.id)}
                              className="bg-green-100 text-green-700 hover:bg-green-200 p-1 rounded-md"
                              title="Start Connector"
                            >
                              <HiOutlinePlay className="h-5 w-5" />
                            </button>
                          )}
                          <Link
                            to={`/connectors/edit/${connector.id}`}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-1 rounded-md"
                            title="Edit Connector"
                          >
                            <HiOutlinePencilAlt className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleCloneConnector(connector)}
                            className="bg-purple-100 text-purple-700 hover:bg-purple-200 p-1 rounded-md"
                            title="Clone Connector"
                          >
                            <HiOutlineDocumentDuplicate className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => confirmDelete(connector)}
                            className="bg-red-100 text-red-700 hover:bg-red-200 p-1 rounded-md"
                            title="Delete Connector"
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No connectors found. Click "Add Connector" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedConnector && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Connector</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the connector "{selectedConnector.name}"? This action cannot be undone.
                </p>
                {selectedConnector.status === STATUS.CONNECTED && (
                  <p className="text-sm text-red-500 mt-2">
                    Warning: This connector is currently active. Deleting it will disconnect any ongoing sessions.
                  </p>
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteConnector(selectedConnector.id)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedConnector(null);
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

export default Connectors;