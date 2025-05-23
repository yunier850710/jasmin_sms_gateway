import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  HiOutlineChartBar, 
  HiOutlineRefresh, 
  HiOutlineDocumentDownload, 
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineServer
} from 'react-icons/hi';
import { api } from '../services/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { TIME_RANGES, CHART_COLORS } from '../utils/constants';

const Statistics = () => {
  const { section = 'system' } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(TIME_RANGES.TODAY);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchStatistics();
  }, [section, timeRange, dateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the API
      // For now, use mock data
      let response;
      
      if (section === 'system') {
        response = await api.getSystemStats({
          timeRange,
          ...(timeRange === TIME_RANGES.CUSTOM ? dateRange : {})
        });
      } else if (section === 'users') {
        // Mock user stats data
        await new Promise(resolve => setTimeout(resolve, 600));
        response = {
          users: [
            {
              id: '1',
              username: 'user1',
              totalMessages: 45230,
              deliveredMessages: 44810,
              failedMessages: 420,
              deliveryRate: 99.07,
              chartData: [
                { date: '2023-01-10', sent: 5240, delivered: 5190 },
                { date: '2023-01-11', sent: 6120, delivered: 6080 },
                { date: '2023-01-12', sent: 7890, delivered: 7820 },
                { date: '2023-01-13', sent: 6540, delivered: 6490 },
                { date: '2023-01-14', sent: 5470, delivered: 5430 },
                { date: '2023-01-15', sent: 7320, delivered: 7250 },
                { date: '2023-01-16', sent: 6650, delivered: 6550 }
              ]
            },
            {
              id: '2',
              username: 'user2',
              totalMessages: 32150,
              deliveredMessages: 31980,
              failedMessages: 170,
              deliveryRate: 99.47,
              chartData: [
                { date: '2023-01-10', sent: 3240, delivered: 3220 },
                { date: '2023-01-11', sent: 4120, delivered: 4100 },
                { date: '2023-01-12', sent: 5890, delivered: 5850 },
                { date: '2023-01-13', sent: 4540, delivered: 4520 },
                { date: '2023-01-14', sent: 3470, delivered: 3450 },
                { date: '2023-01-15', sent: 5320, delivered: 5280 },
                { date: '2023-01-16', sent: 5570, delivered: 5560 }
              ]
            },
            {
              id: '3',
              username: 'user3',
              totalMessages: 28970,
              deliveredMessages: 28100,
              failedMessages: 870,
              deliveryRate: 96.99,
              chartData: [
                { date: '2023-01-10', sent: 2240, delivered: 2150 },
                { date: '2023-01-11', sent: 3120, delivered: 3020 },
                { date: '2023-01-12', sent: 4890, delivered: 4750 },
                { date: '2023-01-13', sent: 4540, delivered: 4390 },
                { date: '2023-01-14', sent: 3470, delivered: 3370 },
                { date: '2023-01-15', sent: 5320, delivered: 5150 },
                { date: '2023-01-16', sent: 5390, delivered: 5270 }
              ]
            }
          ]
        };
      } else if (section === 'reports') {
        // Mock reports data
        await new Promise(resolve => setTimeout(resolve, 500));
        response = {
          reports: [
            {
              id: '1',
              name: 'Daily System Report',
              type: 'system',
              format: 'pdf',
              generatedAt: '2023-01-16T08:30:00Z',
              size: '1.2 MB'
            },
            {
              id: '2',
              name: 'User Activity Summary',
              type: 'user',
              format: 'excel',
              generatedAt: '2023-01-15T14:15:00Z',
              size: '3.4 MB'
            },
            {
              id: '3',
              name: 'Weekly Performance Report',
              type: 'system',
              format: 'pdf',
              generatedAt: '2023-01-14T09:20:00Z',
              size: '2.1 MB'
            },
            {
              id: '4',
              name: 'Connector Uptime Report',
              type: 'connector',
              format: 'pdf',
              generatedAt: '2023-01-13T16:45:00Z',
              size: '0.9 MB'
            },
            {
              id: '5',
              name: 'Monthly Billing Summary',
              type: 'billing',
              format: 'excel',
              generatedAt: '2023-01-01T00:00:00Z',
              size: '4.7 MB'
            }
          ]
        };
      }
      
      setStats(response);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Failed to fetch statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportId) => {
    // In a real implementation, this would trigger a download
    console.log('Downloading report ID:', reportId);
  };

  const generateNewReport = () => {
    // In a real implementation, this would open a modal or navigate to report generator
    console.log('Opening report generator');
  };

  const renderTimeRangeSelector = () => (
    <div className="flex items-center space-x-4">
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value={TIME_RANGES.TODAY}>Today</option>
        <option value={TIME_RANGES.YESTERDAY}>Yesterday</option>
        <option value={TIME_RANGES.WEEK}>This Week</option>
        <option value={TIME_RANGES.MONTH}>This Month</option>
        <option value={TIME_RANGES.CUSTOM}>Custom Range</option>
      </select>
      
      {timeRange === TIME_RANGES.CUSTOM && (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="mt-1 block pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="mt-1 block pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
      )}
    </div>
  );

  const renderSystemStats = () => {
    if (!stats) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-indigo-100 text-sm">Total Messages</p>
                  <h2 className="text-3xl font-bold">{stats.totalMessages.toLocaleString()}</h2>
                </div>
                <div className="p-2 bg-indigo-400 bg-opacity-30 rounded-md">
                  <HiOutlineChartBar className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-green-100 text-sm">Delivered Messages</p>
                  <h2 className="text-3xl font-bold">{stats.deliveredMessages.toLocaleString()}</h2>
                </div>
                <div className="p-2 bg-green-400 bg-opacity-30 rounded-md">
                  <HiOutlineChartBar className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-red-100 text-sm">Failed Messages</p>
                  <h2 className="text-3xl font-bold">{stats.failedMessages.toLocaleString()}</h2>
                </div>
                <div className="p-2 bg-red-400 bg-opacity-30 rounded-md">
                  <HiOutlineChartBar className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-purple-100 text-sm">Delivery Rate</p>
                  <h2 className="text-3xl font-bold">{stats.deliveryRate}%</h2>
                </div>
                <div className="p-2 bg-purple-400 bg-opacity-30 rounded-md">
                  <HiOutlineChartBar className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <Card title="Hourly Message Volume">
          <div className="h-80 p-4">
            <div className="text-center text-gray-500 h-full flex items-center justify-center">
              Chart would be rendered here with actual chart library (e.g., Chart.js, Recharts)
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card title="Top Users">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.messages.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((user.messages / stats.totalMessages) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card title="Messages by Status">
            <div className="h-80 p-4">
              <div className="text-center text-gray-500 h-full flex items-center justify-center">
                Pie chart would be rendered here with actual chart library
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderUserStats = () => {
    if (!stats || !stats.users) return null;

    return (
      <div className="space-y-6">
        {stats.users.map(user => (
          <Card key={user.id} title={`User: ${user.username}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Messages</p>
                <p className="text-xl font-semibold">{user.totalMessages.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-xl font-semibold">{user.deliveredMessages.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-xl font-semibold">{user.failedMessages.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Delivery Rate</p>
                <p className="text-xl font-semibold">{user.deliveryRate}%</p>
              </div>
            </div>
            
            <div className="h-60">
              <div className="text-center text-gray-500 h-full flex items-center justify-center">
                Line chart would be rendered here with actual chart library
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderReports = () => {
    if (!stats || !stats.reports) return null;

    const getReportTypeIcon = (type) => {
      switch (type) {
        case 'system':
          return <HiOutlineServer className="h-5 w-5 text-indigo-500" />;
        case 'user':
          return <HiOutlineUser className="h-5 w-5 text-green-500" />;
        case 'connector':
          return <HiOutlineServer className="h-5 w-5 text-purple-500" />;
        case 'billing':
          return <HiOutlineCalendar className="h-5 w-5 text-blue-500" />;
        default:
          return <HiOutlineDocumentDownload className="h-5 w-5 text-gray-500" />;
      }
    };

    return (
      <div>
        <Card title="Available Reports" actions={
          <button 
            onClick={generateNewReport}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlineDocumentDownload className="mr-2 h-4 w-4" />
            Generate New Report
          </button>
        }>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.reports.map(report => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getReportTypeIcon(report.type)}
                        <span className="ml-2 text-sm font-medium text-gray-900">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.format.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <HiOutlineClock className="mr-1.5 h-4 w-4 text-gray-400" />
                        {new Date(report.generatedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end"
                      >
                        <HiOutlineDocumentDownload className="mr-1 h-5 w-5" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="pb-5 border-b border-gray-200 mb-5 flex justify-between items-center flex-wrap">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Statistics</h1>
        
        <div className="flex items-center space-x-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Link
              to="/statistics/system"
              className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg ${
                section === 'system' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              System
            </Link>
            <Link
              to="/statistics/users"
              className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 ${
                section === 'users' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Users
            </Link>
            <Link
              to="/statistics/reports"
              className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg ${
                section === 'reports' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Reports
            </Link>
          </div>
          
          <button 
            onClick={fetchStatistics} 
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlineRefresh className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
      
      {section !== 'reports' && (
        <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="text-gray-500 text-sm mb-3 sm:mb-0">
            Select time range to display statistics
          </div>
          {renderTimeRangeSelector()}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {section === 'system' && renderSystemStats()}
          {section === 'users' && renderUserStats()}
          {section === 'reports' && renderReports()}
        </>
      )}
    </div>
  );
};

export default Statistics;