/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { propertyApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building, 
  IndianRupee, 
  MapPin, 
  Home, 
  Car, 
  Bed, 
  Ruler, 
  Star, 
  Heart, 
  Plus, 
  ArrowLeft,
  Image,
  Video,
  X
} from 'lucide-react';

const CreateProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyType: 'owner',
    priceTag: '',
    price: '',
    propertyDetails: '',
    contactInfo: '',
    isFurnished: false,
    hasParking: false,
    propertyCategory: 'sale',
    bhk: '',
    floor: '',
    propertyAge: '',
    facing: '',
    buildArea: '',
    carpetArea: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    amenities: [],
    nearbyPlaces: [],
    pictures: [],
    videos: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ pictures: 0, videos: 0 });
  const [uploading, setUploading] = useState({ pictures: false, videos: false });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInput = (field, value, e) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      const newValue = value.trim();
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], newValue]
      }));
      e.target.value = '';
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const removeMediaFile = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare the payload without pictures and videos (will be uploaded separately)
      const payload = {
        propertyType: formData.propertyType,
        priceTag: formData.priceTag,
        price: parseFloat(formData.price),
        propertyDetails: formData.propertyDetails,
        contactInfo: formData.contactInfo,
        isFurnished: formData.isFurnished,
        hasParking: formData.hasParking,
        propertyCategory: formData.propertyCategory,
        bhk: parseInt(formData.bhk),
        floor: parseInt(formData.floor),
        propertyAge: parseInt(formData.propertyAge),
        facing: formData.facing,
        buildArea: parseInt(formData.buildArea),
        carpetArea: parseInt(formData.carpetArea),
        locality: formData.locality,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark,
        amenities: formData.amenities,
        nearbyPlaces: formData.nearbyPlaces,
        propertyStatus: 'available', // Default status
        isActive: true // Default active
      };

      // Create property first
      const response = await propertyApi.createProperty(payload);
      const propertyId = response.data.propertyPost._id || response.data.property._id; // Handle different response formats

      // Upload pictures if any
      if (formData.pictures.length > 0) {
        setUploading(prev => ({ ...prev, pictures: true }));
        try {
          await propertyApi.uploadPropertyPictures(propertyId, formData.pictures);
        } catch (pictureError) {
          console.error('Error uploading pictures:', pictureError);
        } finally {
          setUploading(prev => ({ ...prev, pictures: false }));
        }
      }

      // Upload videos if any
      if (formData.videos.length > 0) {
        setUploading(prev => ({ ...prev, videos: true }));
        try {
          await propertyApi.uploadPropertyVideos(propertyId, formData.videos);
        } catch (videoError) {
          console.error('Error uploading videos:', videoError);
        } finally {
          setUploading(prev => ({ ...prev, videos: false }));
        }
      }

      setSuccess('Property created successfully! Media files uploaded.');
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/properties');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || error.response?.data?.error || 'Failed to create property');
      console.error('Error creating property:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add createProperty to the propertyApi service


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
              <Plus className="h-6 w-6 mr-3 text-blue-600" />
              Create Property Post
            </h1>
            <p className="mt-2 text-gray-600">Add a new property listing to the platform.</p>
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

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-50/80 backdrop-blur-xl border border-green-200/50 rounded-xl p-4"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </motion.div>
      )}

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-500" />
            Property Information
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Property Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Building className="h-4 w-4 mr-2 text-blue-500" />
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              >
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
                <option value="builder">Builder</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-blue-500" />
                Property Category
              </label>
              <select
                name="propertyCategory"
                value={formData.propertyCategory}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IndianRupee className="h-4 w-4 mr-2 text-green-500" />
                Price Tag
              </label>
              <input
                type="text"
                name="priceTag"
                value={formData.priceTag}
                onChange={handleInputChange}
                placeholder="₹50 Lac"
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IndianRupee className="h-4 w-4 mr-2 text-green-500" />
                Price (Numeric)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="5000000"
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Home className="h-4 w-4 mr-2 text-blue-500" />
                Property Age
              </label>
              <input
                type="number"
                name="propertyAge"
                value={formData.propertyAge}
                onChange={handleInputChange}
                placeholder="5"
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Bed className="h-4 w-4 mr-2 text-blue-500" />
                BHK
              </label>
              <select
                name="bhk"
                value={formData.bhk}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              >
                <option value="">Select BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Ruler className="h-4 w-4 mr-2 text-blue-500" />
                Floor
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                placeholder="3"
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Star className="h-4 w-4 mr-2 text-blue-500" />
                Facing
              </label>
              <select
                name="facing"
                value={formData.facing}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              >
                <option value="">Select Facing</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="northeast">North East</option>
                <option value="northwest">North West</option>
                <option value="southeast">South East</option>
                <option value="southwest">South West</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Ruler className="h-4 w-4 mr-2 text-blue-500" />
                Build Area (sq ft)
              </label>
              <input
                type="number"
                name="buildArea"
                value={formData.buildArea}
                onChange={handleInputChange}
                placeholder="1200"
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Ruler className="h-4 w-4 mr-2 text-blue-500" />
                Carpet Area (sq ft)
              </label>
              <input
                type="number"
                name="carpetArea"
                value={formData.carpetArea}
                onChange={handleInputChange}
                placeholder="900"
                className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
              />
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-500" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Locality</label>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleInputChange}
                  placeholder="Andheri West"
                  className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Mumbai"
                  className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Maharashtra"
                  className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="400058"
                  className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Near Metro Station"
                  className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Details</label>
            <textarea
              name="propertyDetails"
              value={formData.propertyDetails}
              onChange={handleInputChange}
              rows={4}
              placeholder="Beautiful 2 BHK apartment in prime location..."
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
            />
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder="9876543210"
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Home className="h-4 w-4 mr-2 text-blue-500" />
                Furnished
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFurnished"
                  checked={formData.isFurnished}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Is the property furnished?</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Car className="h-4 w-4 mr-2 text-blue-500" />
                Parking
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={formData.hasParking}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Has parking available?</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (Press Enter to add)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('amenities', index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyPress={(e) => handleArrayInput('amenities', e.target.value, e)}
              placeholder="Gym, Swimming Pool, Club House..."
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
            />
          </div>

          {/* Nearby Places */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Places (Press Enter to add)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.nearbyPlaces.map((place, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {place}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('nearbyPlaces', index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyPress={(e) => handleArrayInput('nearbyPlaces', e.target.value, e)}
              placeholder="School, Hospital, Market..."
              className="block w-full rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 p-3"
            />
          </div>

          {/* Media Upload Section */}
          <div className="border-t border-gray-200/50 pt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Image className="h-5 w-5 mr-2 text-blue-500" />
              Property Media
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pictures Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Pictures</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-xl bg-white/30 backdrop-blur-sm transition-colors hover:border-blue-400">
                  <div className="space-y-1 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="pictures-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>Upload photos</span>
                        <input
                          id="pictures-upload"
                          name="pictures"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setFormData(prev => ({
                              ...prev,
                              pictures: [...prev.pictures, ...files]
                            }));
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                
                {/* Uploaded Pictures Preview */}
                {formData.pictures.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.pictures.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeMediaFile('pictures', index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {uploading.pictures && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress.pictures}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading pictures...</p>
                  </div>
                )}
              </div>
              
              {/* Videos Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Videos</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-xl bg-white/30 backdrop-blur-sm transition-colors hover:border-blue-400">
                  <div className="space-y-1 text-center">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="videos-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>Upload videos</span>
                        <input
                          id="videos-upload"
                          name="videos"
                          type="file"
                          className="sr-only"
                          accept="video/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setFormData(prev => ({
                              ...prev,
                              videos: [...prev.videos, ...files]
                            }));
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">MP4, MOV, AVI up to 50MB</p>
                  </div>
                </div>
                
                {/* Uploaded Videos Preview */}
                {formData.videos.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.videos.map((file, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={URL.createObjectURL(file)}
                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() => removeMediaFile('videos', index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {uploading.videos && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress.videos}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading videos...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="px-6 py-2.5 text-sm font-medium rounded-xl text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                'Create Property'
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default CreateProperty;