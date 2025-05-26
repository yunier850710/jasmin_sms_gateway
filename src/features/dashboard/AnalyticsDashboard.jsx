import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  ServerIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';

// Mock data for the charts - in a real application, this would come from an API
const generateMockData = () => {
  // Generate last 7 days
  const dates = Array(7).fill().map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  // Mock message count data per day
  const messageData = dates.map(date => ({
    date,
    delivered: Math.floor(Math.random() * 5000 + 15000),
    failed: Math.floor(Math.random() * 500 + 100),
    pending: Math.floor(Math.random() * 200 + 50),
  }));

  // Mock revenue data
  const revenueData = dates.map(date => ({
    date,
    amount: Math.floor(Math.random() * 2000 + 8000),
  }));

  // Mock connector status data
  const connectorData = [
    { id: 'carrier1', name: 'Primary Carrier', status: 'connected', type: 'smpp', messagesProcessed: 45872 },
    { id: 'carrier2', name: 'Secondary Carrier', status: 'connected', type: 'smpp', messagesProcessed: 12583 },
    { id: 'api1', name: 'Partner API', status: 'active', type: 'http', messagesProcessed: 8921 },
    { id: 'api2', name: 'Local App', status: 'inactive', type: 'http', messagesProcessed: 3421 },
  ];

  // Mock delivery performance by route
  const routePerformance = [
    { route: 'Default MT', deliveryRate: 98.4, averageLatency: 0.8, messagesSent: 32541 },
    { route: 'Premium MT', deliveryRate: 99.7, averageLatency: 0.4, messagesSent: 18245 },
    { route: 'Bulk MT', deliveryRate: 97.1, averageLatency: 1.2, messagesSent: 7683 },
  ];

  // Return the mock data objects
  return {
    messageData,
    revenueData,
    connectorData,
    routePerformance,
    summary: {
      totalMessages: messageData.reduce((sum, day) => sum + day.delivered + day.failed + day.pending, 0),
      deliveryRate: 98.2,
      averageLatency: 0.72,
      revenue: revenueData.reduce((sum, day) => sum + day.amount, 0),
    }
  };
};

/**
 * AnalyticsDashboard Component - Displays key metrics and performance data
 */
function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call based on timeRange
        // Example: const response = await api.get(`/analytics/dashboard?timeRange=${timeRange}`);
        
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        const data = generateMockData();
        setDashboardData(data);
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to load dashboard data: ${err.message}`);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeRange]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        </div>
        <Alert type="error" message={error} className="mb-6" />
      </div>
    );
  }
  
  // If data is loaded successfully
  if (dashboardData) {
    const { messageData, connectorData, routePerformance, summary } = dashboardData;
    
    // Calculate max value for chart scaling
    const maxMessageCount = Math.max(...messageData.map(d => d.delivered + d.failed + d.pending));
    
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTimeRange('7days')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                timeRange === '7days'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === '30days'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('90days')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                timeRange === '90days'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              90 Days
            </button>
          </div>
        </div>
        
        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Messages */}
          <Card className="border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Total Messages
                </p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {summary.totalMessages.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Delivery Rate */}
          <Card className="border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Delivery Rate
                </p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {summary.deliveryRate}%
                </p>
              </div>
            </div>
          </Card>
          
          {/* Average Latency */}
          <Card className="border-l-4 border-amber-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 rounded-full p-3">
                <ClockIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Avg. Latency
                </p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {summary.averageLatency}s
                </p>
              </div>
            </div>
          </Card>
          
          {/* Revenue */}
          <Card className="border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Revenue
                </p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  ${summary.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Message Volume Chart */}
          <Card 
            title="Message Volume" 
            subtitle="Delivered, failed, and pending messages over time"
            className="col-span-1"
          >
            <div className="pt-4">
              {/* This would be a chart component in a real app */}
              <div className="h-64 flex flex-col">
                <div className="flex-1 flex">
                  {messageData.map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col justify-end relative">
                      <div 
                        className="bg-red-500 w-full" 
                        style={{ 
                          height: `${(day.failed / maxMessageCount) * 100}%` 
                        }}
                      ></div>
                      <div 
                        className="bg-amber-400 w-full" 
                        style={{ 
                          height: `${(day.pending / maxMessageCount) * 100}%` 
                        }}
                      ></div>
                      <div 
                        className="bg-green-500 w-full" 
                        style={{ 
                          height: `${(day.delivered / maxMessageCount) * 100}%` 
                        }}
                      ></div>
                      <div className="text-xs text-gray-700 text-center mt-2">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-600">Delivered</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-amber-400 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-600">Failed</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Route Performance Card */}
          <Card 
            title="Route Performance" 
            subtitle="Delivery rates and latency by route"
            className="col-span-1"
          >
            <div className="pt-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Messages
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Latency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {routePerformance.map((route) => (
                      <tr key={route.route} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {route.route}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {route.messagesSent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  route.deliveryRate >= 99 ? 'bg-green-600' :
                                  route.deliveryRate >= 95 ? 'bg-green-500' :
                                  route.deliveryRate >= 90 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${route.deliveryRate}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-700">{route.deliveryRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {route.averageLatency}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Connector Status Section */}
        <div className="mb-6">
          <Card 
            title="Connector Status" 
            subtitle="Current status and performance of configured connectors"
          >
            <div className="pt-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Connector
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Messages Processed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {connectorData.map((connector) => (
                      <tr key={connector.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                              <ServerIcon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{connector.name}</div>
                              <div className="text-sm text-gray-500">ID: {connector.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {connector.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            connector.status === 'connected' || connector.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {connector.status === 'connected' || connector.status === 'active' ? (
                              <CheckCircleIcon className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircleIcon className="mr-1 h-3 w-3" />
                            )}
                            {connector.status.charAt(0).toUpperCase() + connector.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {connector.messagesProcessed.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Last Updated */}
        <div className="text-right text-sm text-gray-500">
          <CalendarDaysIcon className="inline-block h-4 w-4 mr-1" />
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    );
  }
  
  // If no data and no error/loading state, show an empty state
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
      </div>
      <Card className="py-12">
        <div className="text-center">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Analytics data is unavailable at this time.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default AnalyticsDashboard;