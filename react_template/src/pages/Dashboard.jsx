import React, { useEffect, useState } from 'react';
import { HiOutlineChartPie, HiOutlineUsers, HiOutlineServer, HiOutlineSwitchHorizontal, HiOutlineCheck, HiOutlineX, HiOutlineBell } from 'react-icons/hi';
import { api } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import ConnectorStatus from '../components/dashboard/ConnectorStatus';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CHART_COLORS } from '../utils/constants';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const dashboardStats = await api.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="pb-5 border-b border-gray-200 mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              activeValue={stats.activeUsers}
              icon={<HiOutlineUsers className="h-6 w-6" />}
              trend="up"
              trendValue="3%"
            />
            <StatCard
              title="SMPP Connectors"
              value={stats.totalConnectors}
              activeValue={stats.activeConnectors}
              icon={<HiOutlineServer className="h-6 w-6" />}
              colorClass="bg-blue-500"
            />
            <StatCard
              title="Messages Sent Today"
              value={stats.messagesSentToday.toLocaleString()}
              icon={<HiOutlineChartPie className="h-6 w-6" />}
              colorClass="bg-green-500"
            />
            <StatCard
              title="Delivery Rate"
              value={`${stats.deliveryRateToday}%`}
              icon={<HiOutlineCheck className="h-6 w-6" />}
              colorClass="bg-purple-500"
              trend="up"
              trendValue="0.3%"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            <div className="lg:col-span-2">
              <Card title="Messages Throughput">
                <div className="h-80">
                  {/* Chart would go here - using a placeholder for now */}
                  <div className="bg-gray-100 h-full rounded flex items-center justify-center">
                    <p className="text-gray-500">Message Volume Chart</p>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card title="Top Users">
                <div className="space-y-4">
                  {stats.recentActivity.filter(activity => activity.type === 'user').slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <HiOutlineUsers className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.entity}</p>
                        <p className="text-xs text-gray-500">{activity.action}</p>
                      </div>
                      <div className="text-sm font-medium">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <Card title="Active SMPP Connectors">
                <div className="overflow-x-auto">
                  <ConnectorStatus />
                </div>
              </Card>
            </div>
            <div>
              <Card title="Recent Activity">
                <div className="space-y-4">
                  {stats.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        activity.type === 'connector' ? 'bg-blue-100 text-blue-500' :
                        activity.type === 'message' ? 'bg-green-100 text-green-500' :
                        activity.type === 'user' ? 'bg-purple-100 text-purple-500' :
                        'bg-yellow-100 text-yellow-500'
                      }`}>
                        {activity.type === 'connector' && <HiOutlineServer className="h-4 w-4" />}
                        {activity.type === 'message' && <HiOutlineBell className="h-4 w-4" />}
                        {activity.type === 'user' && <HiOutlineUsers className="h-4 w-4" />}
                        {activity.type === 'route' && <HiOutlineSwitchHorizontal className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.entity}</p>
                        <p className="text-xs text-gray-500">{activity.action}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;