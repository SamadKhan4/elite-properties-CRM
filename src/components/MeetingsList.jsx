/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { meetingApi } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  IndianRupee, 
  Clock, 
  Building, 
  Trash2, 
  Eye,
  Search,
  CheckCircle,
  XCircle,
  CalendarCheck
} from 'lucide-react';

const MeetingsList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMeetings: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, [filters, searchTerm]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        ...(searchTerm && { search: searchTerm })
      };
      const response = await meetingApi.getAllMeetings(params);
      
      // Handle different response structures
      setMeetings(response.data.meetings || response.data.meeting || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalMeetings: (response.data.meetings || response.data.meeting)?.length || 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      setError('');
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilters(prev => ({
      ...prev,
      page: 1 // Reset to first page when searching
    }));
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handleDeleteMeeting = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheduled meeting?')) {
      try {
        await meetingApi.deleteMeeting(id);
        fetchMeetings(); // Refresh the list
      } catch (error) {
        setError('Failed to delete meeting');
        console.error('Error deleting meeting:', error);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await meetingApi.updateMeetingStatus(id, newStatus);
      fetchMeetings(); // Refresh the list
    } catch (error) {
      setError('Failed to update meeting status');
      console.error('Error updating meeting status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && meetings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading meetings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center">
          <Calendar className="h-6 w-6 mr-3 text-blue-600" />
          Scheduled Meetings
        </h1>
        <p className="mt-2 text-gray-600">Manage all scheduled meetings with clients.</p>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-xl p-4"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-6"
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
              />
            </div>
            
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Meetings Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Scheduled Meetings ({pagination.totalMeetings})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading meetings...</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
            <p className="text-gray-500">There are no scheduled meetings to display.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/20 divide-y divide-gray-200/30">
                {meetings.map((meeting, index) => (
                  <motion.tr 
                    key={meeting._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{meeting.name}</div>
                          <div className="text-sm text-gray-500">{meeting.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {formatDate(meeting.date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{meeting.place}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {meeting.propertyId && (
                          <>
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2 text-gray-500" />
                              {meeting.propertyId.propertyType} - {meeting.propertyId.propertyCategory}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              {meeting.propertyId.city}
                            </div>
                            <div className="flex items-center mt-1">
                              <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                              ₹{Number(meeting.propertyId.price).toLocaleString('en-IN')}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          meeting.meetingStatus === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : meeting.meetingStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : meeting.meetingStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {meeting.meetingStatus?.charAt(0).toUpperCase() + meeting.meetingStatus?.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="relative group">
                          <select
                            value={meeting.meetingStatus}
                            onChange={(e) => handleUpdateStatus(meeting._id, e.target.value)}
                            className="block appearance-none w-full bg-white/50 backdrop-blur-sm border border-gray-300 text-gray-700 py-1 px-2 pr-6 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        
                        <Link
                          to={`/meetings/${meeting._id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors duration-200"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteMeeting(meeting._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors duration-200"
                          title="Delete meeting"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200/50 bg-white/20">
            <nav className="flex items-center justify-between">
              <div className="flex-1 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.currentPage - 1) * filters.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * filters.limit, pagination.totalMeetings)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalMeetings}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage && pagination.currentPage <= 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-white/50 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl ${
                        pagination.currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/50 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white/80'
                      } transition-all duration-200`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-white/50 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MeetingsList;