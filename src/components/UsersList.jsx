/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, Mail, Phone, Calendar, Trash2, Eye, Plus } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, limit, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(searchTerm && { search: searchTerm })
      };
      const response = await userApi.getAllUsers(params);
      // Handle API response based on documentation
      setUsers(response.data.users || response.data.user || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalUsers: (response.data.users || response.data.user)?.length || 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      setError('');
    } catch (error) {
      setError('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their associated data.')) {
      try {
        await userApi.deleteUser(userId);
        // Refresh the user list
        fetchUsers();
      } catch (error) {
        setError('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="sm:flex sm:items-center justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Users</h1>
            <p className="mt-2 text-gray-600">
              A list of all the users in your Elite Properties account.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto sm:flex-none">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gray-50/30">
              <tr>
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Name
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    Role
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created
                  </div>
                </th>
                <th scope="col" className="relative py-4 pl-3 pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/30 bg-white/30">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/50 transition-colors duration-200"
                  >
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-gray-900 font-medium">{user.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {user.phoneNo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      <Link 
                        to={`/users/${user._id}`} 
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 mr-2"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(user._id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="whitespace-nowrap py-12 text-center">
                    <div className="flex flex-col items-center">
                      <User className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-gray-900 font-medium text-lg mb-1">No users found</h3>
                      <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
        
      {/* Pagination */}
      {users.length > 0 && (
        <motion.nav 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mt-6"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white/80 ${
                page === 1 ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className={`relative ml-3 inline-flex items-center rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white/80 ${
                page === pagination.totalPages ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{(pagination.currentPage - 1) * limit + 1}</span> to{' '}
                <span className="font-semibold text-gray-900">
                  {Math.min(pagination.currentPage * limit, pagination.totalUsers)}
                </span>{' '}
                of <span className="font-semibold text-gray-900">{pagination.totalUsers}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center rounded-l-xl px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 ${
                    page === 1 
                      ? 'cursor-not-allowed opacity-50 bg-gray-100/50' 
                      : 'bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                
                {/* Page numbers */}
                {[...Array(pagination.totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        page === pageNum
                          ? 'z-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className={`relative inline-flex items-center rounded-r-xl px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 ${
                    page === pagination.totalPages 
                      ? 'cursor-not-allowed opacity-50 bg-gray-100/50' 
                      : 'bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </motion.nav>
      )}
    </motion.div>
  );
};

export default UsersList;