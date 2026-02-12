/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { statsApi } from '../services/api';
import { motion } from 'framer-motion';
import { Users, Building, Eye, EyeOff, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    activeProperties: 0,
    inactiveProperties: 0,
    propertiesByCategory: [],
    propertiesByCity: [],
    usersByCity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await statsApi.getStats();
      setStats(response.data.stats);
      setError('');
    } catch (error) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${color.includes('indigo') ? 'from-indigo-100 to-indigo-200' : color.includes('green') ? 'from-green-100 to-green-200' : color.includes('blue') ? 'from-blue-100 to-blue-200' : 'from-red-100 to-red-200'} text-2xl`}>
          {icon}
        </div>
        <div className="ml-4 w-0 flex-1">
          <dt className="text-sm font-medium text-gray-600 truncate">{title}</dt>
          <dd className="text-2xl font-bold text-gray-900 mt-1">{value}</dd>
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, data, type }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          {title}
        </h3>
      </div>
      <div className="p-6">
        <dl className="divide-y divide-gray-200/50">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="py-4 flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-600">{type === 'category' ? item._id : item._id}</dt>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min((item.count / Math.max(...data.map(d => d.count))) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-8">{item.count}</span>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12"
      >
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12"
      >
        <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8"
    >
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
        >
          Dashboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-gray-600 max-w-2xl"
        >
          Welcome back! Here's what's happening with your Elite Properties CRM.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="h-8 w-8" />}
          color="text-indigo-600"
        />
        <StatCard 
          title="Total Properties" 
          value={stats.totalProperties} 
          icon={<Building className="h-8 w-8" />}
          color="text-green-600"
        />
        <StatCard 
          title="Active Properties" 
          value={stats.activeProperties} 
          icon={<Eye className="h-8 w-8" />}
          color="text-blue-600"
        />
        <StatCard 
          title="Inactive Properties" 
          value={stats.inactiveProperties} 
          icon={<EyeOff className="h-8 w-8" />}
          color="text-red-600"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
      >
        <ChartCard 
          title="Properties by Category" 
          data={stats.propertiesByCategory} 
          type="category"
        />
        <ChartCard 
          title="Properties by City" 
          data={stats.propertiesByCity} 
          type="city"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ChartCard 
          title="Users by City" 
          data={stats.usersByCity} 
          type="city"
        />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;