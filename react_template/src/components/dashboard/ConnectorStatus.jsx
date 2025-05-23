import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConnectors, startConnector, stopConnector } from '../../store/connectorSlice';
import StatusBadge from '../common/StatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import { HiOutlinePlay, HiOutlineStop } from 'react-icons/hi';

const ConnectorStatus = () => {
  const dispatch = useDispatch();
  const connectors = useSelector(state => state.connectors.entities);
  const loading = useSelector(state => state.connectors.loading);
  const error = useSelector(state => state.connectors.error);

  useEffect(() => {
    dispatch(fetchConnectors());
  }, [dispatch]);

  const handleStartConnector = (connectorId) => {
    dispatch(startConnector(connectorId));
  };

  const handleStopConnector = (connectorId) => {
    dispatch(stopConnector(connectorId));
  };

  if (loading && connectors.length === 0) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (connectors.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No SMPP connectors found. Please add a connector to start.
      </div>
    );
  }

  return (
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
          {connectors.map((connector) => (
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
                  {connector.status === 'disconnected' ? (
                    <button
                      onClick={() => handleStartConnector(connector.id)}
                      className="bg-green-100 text-green-700 hover:bg-green-200 p-1 rounded-md"
                      title="Start Connector"
                    >
                      <HiOutlinePlay className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStopConnector(connector.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 p-1 rounded-md"
                      title="Stop Connector"
                    >
                      <HiOutlineStop className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConnectorStatus;