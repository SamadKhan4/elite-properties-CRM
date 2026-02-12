/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { propertyApi } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building, MapPin, IndianRupee, Eye, EyeOff, Trash2, Edit3, Filter, User, Calendar, Plus } from 'lucide-react';

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProperties: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Filters
  const [filters, setFilters] = useState({
    propertyType: '',
    propertyCategory: '',
    city: '',
    state: '',
    bhk: '',
    minPrice: '',
    maxPrice: '',
    isFurnished: '',
    hasParking: '',
    facing: '',
    isActive: ''
  });

  useEffect(() => {
    fetchProperties();
  }, [page, filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...Object.fromEntries(Object.entries(filters).filter(([key, v]) => v !== '' && v !== null && v !== undefined && key !== ''))
      };
      const response = await propertyApi.getAllProperties(params);
      // Handle API response based on documentation
      setProperties(response.data.propertyPosts || response.data.property || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalProperties: (response.data.propertyPosts || response.data.property)?.length || 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      setError('');
    } catch (error) {
      setError('Failed to load properties');
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property? This will also delete all associated media files.')) {
      try {
        await propertyApi.deleteProperty(propertyId);
        // Refresh the property list
        fetchProperties();
      } catch (error) {
        setError('Failed to delete property');
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusUpdate = async (propertyId, newStatus) => {
    try {
      await propertyApi.updatePropertyStatus(propertyId, newStatus);
      // Refresh the property list
      fetchProperties();
    } catch (error) {
      setError(`Failed to update property status: ${error.response?.data?.message || 'Unknown error'}`);
      console.error('Error updating property status:', error);
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
          <p className="text-gray-600 font-medium">Loading properties...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 mb-4">
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Properties</h1>
            <p className="mt-2 text-gray-600">
              A list of all property posts in your Elite Properties account.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto sm:flex-none">
            <Link
              to="/properties/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50"
      >
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <div>
            <label htmlFor="propertyType" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
            >
              <option value="">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label htmlFor="propertyCategory" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
              Category
            </label>
            <select
              id="propertyCategory"
              value={filters.propertyCategory}
              onChange={(e) => handleFilterChange('propertyCategory', e.target.value)}
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
            >
              <option value="">All Categories</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Studio">Studio</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Office">Office</option>
              <option value="Shop">Shop</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label htmlFor="bhk" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
              BHK
            </label>
            <select
              id="bhk"
              value={filters.bhk}
              onChange={(e) => handleFilterChange('bhk', e.target.value)}
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
            >
              <option value="">Any</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>

          <div>
            <label htmlFor="isActive" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
              Status
            </label>
            <select
              id="isActive"
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gray-50/30">
              <tr>
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Owner
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Type
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Price
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Status
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
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <motion.tr 
                    key={property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/50 transition-colors duration-200"
                  >
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                      <div className="text-gray-900 font-medium">{property.userId.fullName}</div>
                      <div className="text-gray-500 text-sm">{property.userId.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <div className="text-gray-900 font-medium">{property.propertyCategory}</div>
                      <div className="text-gray-500 text-xs">{property.propertyType}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <div className="text-gray-900 font-medium">{property.city}</div>
                      <div className="text-gray-500 text-xs">{property.state}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1 text-green-600" />
                        {Number(property.price).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      <select
                        value={property.propertyStatus}
                        onChange={(e) => handleStatusUpdate(property._id, e.target.value)}
                        className={`rounded-xl px-3 py-1 text-xs font-semibold ${
                          property.propertyStatus === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : property.propertyStatus === 'Sold'
                            ? 'bg-red-100 text-red-800'
                            : property.propertyStatus === 'Under Construction'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Rented">Rented</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {formatDate(property.createdAt)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      <Link 
                        to={`/properties/${property._id}`} 
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 mr-2"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(property._id)}
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
                  <td colSpan="7" className="whitespace-nowrap py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Building className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-gray-900 font-medium text-lg mb-1">No properties found</h3>
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
      {properties.length > 0 && (
        <motion.nav 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                  {Math.min(pagination.currentPage * limit, pagination.totalProperties)}
                </span>{' '}
                of <span className="font-semibold text-gray-900">{pagination.totalProperties}</span> results
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

export default PropertiesList;