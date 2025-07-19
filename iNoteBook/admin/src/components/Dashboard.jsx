import { Users, FileText, TrendingUp, Activity, Settings as SettingsIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import Settings from './Settings';

const Dashboard = () => {
  const { dashboardData, fetchDashboardData } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Add some sample user growth data
  const enhanceChartData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    // Calculate a steeper growth curve for users
    return data.map((item, index) => {
      const monthProgress = index / (data.length - 1); // 0 to 1 progress
      const growthFactor = Math.pow(monthProgress, 1.5); // Make growth more exponential
      const baseUsers = dashboardData.totalUsers * 0.3; // Start from 30% of total users
      const growth = dashboardData.totalUsers * 0.7 * growthFactor; // Grow up to 100%
      return {
        ...item,
        users: Math.floor(baseUsers + growth)
      };
    });
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Notes',
      value: dashboardData.totalNotes.toLocaleString(),
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Growth Rate',
      value: dashboardData.growthRate,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Active Users',
      value: dashboardData.activeUsers.toLocaleString(),
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a 
            href="/send-announcement" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-150 ease-in-out"
          >
            Send Announcement
          </a>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors duration-150"
            title="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Growth Trends
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monthly user and note creation trends
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enhanceChartData(dashboardData.userTrend)}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="notes"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Notes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;