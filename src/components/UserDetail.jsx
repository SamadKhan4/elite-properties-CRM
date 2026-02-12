/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, FileText, Building, CreditCard } from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserById(id);
      setUser(response.data.user);
      setError('');
    } catch (error) {
      setError('Failed to load user details');
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading user details...</p>
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
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-2xl p-6">
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
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">User not found</h3>
          <p className="text-gray-500 mb-6">The user you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center">
              <User className="h-6 w-6 mr-3 text-blue-600" />
              User Details
            </h1>
            <p className="mt-2 text-gray-600">View and manage user information and profile details.</p>
          </div>
          <div className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
            <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Active</span>
          </div>
        </div>
      </motion.div>
      
      {/* User Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-8"
      >
        <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-500" />
            Personal Information
          </h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{user.fullName}</dd>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{user.email}</dd>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Phone Number</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{user.phoneNo}</dd>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Role</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </dd>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{formatDate(user.createdAt)}</dd>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Updated At</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{formatDate(user.updatedAt)}</dd>
              </div>
            </div>
          </dl>
        </div>
      </motion.div>

      {user.profile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Profile Information
            </h2>
            <p className="mt-1 text-sm text-gray-600">Additional personal details and documents.</p>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-600 truncate">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">
                    <p>{user.profile.address?.street}</p>
                    <p className="mt-1">{user.profile.address?.city}, {user.profile.address?.state} {user.profile.address?.pincode}</p>
                  </dd>
                </div>
              </div>
              
              {user.profile.aadhaarCard && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-600 truncate">Aadhaar Card</dt>
                    <dd className="mt-1">
                      <a 
                        href={user.profile.aadhaarCard} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                      >
                        View Document
                      </a>
                    </dd>
                  </div>
                </div>
              )}
              
              {user.profile.panCard && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-600 truncate">PAN Card</dt>
                    <dd className="mt-1">
                      <a 
                        href={user.profile.panCard} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                      >
                        View Document
                      </a>
                    </dd>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-600 truncate">Profile Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{formatDate(user.profile.createdAt)}</dd>
                </div>
              </div>
            </dl>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex justify-end"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </motion.div>
    </motion.div>
  );
};

export default UserDetail;