/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { contactApi } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Clock, 
  Building, 
  Trash2,
  Eye
} from 'lucide-react';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await contactApi.getContactById(id);
      
      // Handle different response structures
      let contactData;
      if (response.data.contact) {
        contactData = response.data.contact;
      } else {
        contactData = response.data;
      }
      
      setContact(contactData);
      setError('');
    } catch (error) {
      console.error('Error fetching contact:', error);
      setError('Failed to load contact details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    if (window.confirm('Are you sure you want to delete this contact inquiry?')) {
      try {
        await contactApi.deleteContact(id);
        navigate('/contacts'); // Go back to contacts list
      } catch (error) {
        setError('Failed to delete contact');
        console.error('Error deleting contact:', error);
      }
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
            <p className="text-gray-600 font-medium">Loading contact details...</p>
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
          <div className="mt-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contacts
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!contact) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-12">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact not found</h3>
          <p className="text-gray-500 mb-6">The contact inquiry you're looking for doesn't exist or may have been removed.</p>
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
              <MessageCircle className="h-6 w-6 mr-3 text-blue-600" />
              Contact Details
            </h1>
            <p className="mt-2 text-gray-600">View detailed information about this contact inquiry.</p>
          </div>
          <div>
            <button
              onClick={handleDeleteContact}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Contact
            </button>
          </div>
        </div>
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

      {/* User Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-8"
      >
        <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-500" />
            User Information
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
                <dd className="mt-1 text-sm text-gray-900 font-medium">{contact.fullName}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{contact.email}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Contact Number</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{contact.contactNumber}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Submitted At</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{formatDate(contact.createdAt)}</dd>
              </div>
            </div>
          </dl>
        </div>
      </motion.div>

      {/* Property Information */}
      {contact.propertyId && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-8"
        >
          <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-500" />
              Property Information
            </h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-600 truncate">Property Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium capitalize">{contact.propertyId.propertyType}</dd>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-600 truncate">City</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{contact.propertyId.city}</dd>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-600 truncate">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">₹{Number(contact.propertyId.price).toLocaleString('en-IN')}</dd>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-600 truncate">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium capitalize">{contact.propertyId.propertyCategory}</dd>
                </div>
              </div>
            </dl>
          </div>
        </motion.div>
      )}

      {/* Message */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
            Message
          </h2>
        </div>
        <div className="p-6">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-900 leading-relaxed">{contact.description}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactDetail;