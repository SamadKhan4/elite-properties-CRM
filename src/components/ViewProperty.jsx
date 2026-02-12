/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyApi } from '../services/api';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building, 
  IndianRupee, 
  MapPin, 
  Home, 
  Car, 
  Bed, 
  Ruler, 
  Star, 
  Heart, 
  Image, 
  Video,
  Camera,
  Play,
  User,
  Calendar
} from 'lucide-react';

const ViewProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug: Log the property ID
  console.log('Property ID from URL params:', id);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  // Debug: Log when property state changes
  useEffect(() => {
    console.log('Property state updated:', property);
  }, [property]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      console.log('Fetching property with ID:', id);
      const response = await propertyApi.getPropertyById(id);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Handle different response structures based on API documentation
      let propertyData;
      if (response.data.propertyPost) {
        // API returns propertyPost in response
        propertyData = response.data.propertyPost;
      } else if (response.data.property) {
        propertyData = response.data.property;
      } else if (response.data._id) { // If response has _id, it's likely the property object itself
        propertyData = response.data;
      } else if (response.data.data && response.data.data._id) {
        propertyData = response.data.data;
      } else {
        propertyData = response.data;
      }
      
      // Ensure media arrays exist - API uses propertyPics and propertyVideos
      propertyData.pictures = propertyData.propertyPics || propertyData.pictures || [];
      propertyData.videos = propertyData.propertyVideos || propertyData.videos || [];
      
      console.log('Processed property data:', propertyData);
      setProperty(propertyData);
      setError('');
    } catch (error) {
      setError('Failed to load property details');
      console.error('Error fetching property:', error);
      console.error('Error response:', error.response?.data);
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

  const handleDeletePicture = async (pictureId) => {
    if (window.confirm('Are you sure you want to delete this picture?')) {
      try {
        const response = await propertyApi.deletePropertyPicture(property._id, pictureId);
        if (response.success) {
          // Refresh the property data to reflect changes
          fetchProperty();
          console.log('Picture deleted successfully');
        } else {
          console.error('Failed to delete picture:', response.message);
        }
      } catch (error) {
        console.error('Error deleting picture:', error);
      }
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await propertyApi.deletePropertyVideo(property._id, videoId);
        if (response.success) {
          // Refresh the property data to reflect changes
          fetchProperty();
          console.log('Video deleted successfully');
        } else {
          console.error('Failed to delete video:', response.message);
        }
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading property details...</p>
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
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
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

  if (!property) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-12">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Property not found</h3>
          <p className="text-gray-500 mb-6">The property you're looking for doesn't exist or may have been removed.</p>
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
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
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
              <Building className="h-6 w-6 mr-3 text-blue-600" />
              Property Details
            </h1>
            <p className="mt-2 text-gray-600">View and manage property information and media.</p>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              property.propertyStatus === 'available'
                ? 'bg-green-100 text-green-800'
                : property.propertyStatus === 'sold'
                ? 'bg-red-100 text-red-800'
                : property.propertyStatus === 'under_construction'
                ? 'bg-yellow-100 text-yellow-800'
                : property.propertyStatus === 'rented'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {property.propertyStatus?.charAt(0).toUpperCase() + property.propertyStatus?.slice(1)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Media Gallery */}
      {(property.pictures?.length > 0 || property.videos?.length > 0) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-8"
        >
          <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Image className="h-5 w-5 mr-2 text-blue-500" />
              Property Media
            </h2>
          </div>
          <div className="p-6">
            {/* Images */}
            {property.pictures && property.pictures.length > 0 && (
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <Camera className="h-4 w-4 mr-2 text-blue-500" />
                  Images ({property.pictures.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.pictures.map((pic, index) => {
                    // Handle different image URL formats
                    const imageUrl = typeof pic === 'string' ? pic : (pic.url || pic.path || pic.image);
                    const pictureId = typeof pic === 'object' ? (pic._id || pic.id) : null;
                    return (
                      <div key={`${index}-${imageUrl}`} className="aspect-square relative group">
                        <img
                          src={imageUrl}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl border border-gray-200/50"
                          onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            e.target.src = 'https://via.placeholder.com/300x300/cccccc/666666?text=Image+Not+Found';
                          }}
                          onLoad={(e) => {
                            console.log('Image loaded:', imageUrl);
                          }}
                        />
                        {pictureId && (
                          <button
                            type="button"
                            onClick={async () => await handleDeletePicture(pictureId)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                            title="Delete picture"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Videos */}
            {property.videos && property.videos.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <Play className="h-4 w-4 mr-2 text-blue-500" />
                  Videos ({property.videos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.videos.map((vid, index) => {
                    // Handle different video URL formats
                    const videoUrl = typeof vid === 'string' ? vid : (vid.url || vid.path || vid.video);
                    const videoId = typeof vid === 'object' ? (vid._id || vid.id) : null;
                    return (
                      <div key={`${index}-${videoUrl}`} className="relative group">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-48 object-cover rounded-xl border border-gray-200/50"
                          onError={(e) => {
                            console.error('Video failed to load:', videoUrl);
                          }}
                          onLoadedData={(e) => {
                            console.log('Video loaded:', videoUrl);
                          }}
                        />
                        {videoId && (
                          <button
                            type="button"
                            onClick={async () => await handleDeleteVideo(videoId)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                            title="Delete video"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Property Information */}
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
                <dd className="mt-1 text-sm text-gray-900 font-medium capitalize">{property.propertyType}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium capitalize">{property.propertyCategory}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Price Tag</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.priceTag}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Price</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">₹{Number(property.price).toLocaleString('en-IN')}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Bed className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">BHK</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.bhk} BHK</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Floor</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.floor}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Property Age</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.propertyAge} years</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Facing</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium capitalize">{property.facing}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Ruler className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Build Area</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.buildArea} sq ft</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Ruler className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Carpet Area</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.carpetArea} sq ft</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Locality</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.locality}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">City</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.city}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">State</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.state}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Pincode</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.pincode}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Landmark</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.landmark}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Furnished</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.isFurnished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {property.isFurnished ? 'Yes' : 'No'}
                  </span>
                </dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Parking</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.hasParking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {property.hasParking ? 'Available' : 'Not Available'}
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
                <dd className="mt-1 text-sm text-gray-900 font-medium">{formatDate(property.createdAt)}</dd>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-blue-100/50 rounded-lg mr-4">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Contact Info</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{property.contactInfo}</dd>
              </div>
            </div>
          </dl>
        </div>
      </motion.div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap">{property.propertyDetails}</p>
          </div>
        </motion.div>

        {/* Amenities and Nearby Places */}
        <div className="space-y-8">
          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Nearby Places */}
          {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900">Nearby Places</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {property.nearbyPlaces.map((place, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex justify-end space-x-4"
      >
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 text-sm font-medium rounded-xl text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
        >
          Back
        </button>
        <Link
          to={`/properties`}
          className="px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          View All Properties
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ViewProperty;