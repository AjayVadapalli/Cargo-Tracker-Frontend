import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateShipmentLocation } from '../redux/slices/shipmentSlice';

const UpdateLocationForm = ({ shipment }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState({
    name: '',
    coordinates: {
      latitude: '',
      longitude: ''
    }
  });
  
  const [errors, setErrors] = useState({});
  
  // Enhanced coordinate validation
  const isValidCoordinate = (lat, lng) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return false;
    }
    
    if (isNaN(lat) || isNaN(lng)) {
      return false;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return false;
    }
    
    // Check for reasonable precision (6 decimal places)
    const latStr = lat.toString();
    const lngStr = lng.toString();
    if (latStr.includes('.') && latStr.split('.')[1].length > 6) {
      return false;
    }
    if (lngStr.includes('.') && lngStr.split('.')[1].length > 6) {
      return false;
    }
    
    return true;
  };
  
  const validateCoordinates = (coordinates) => {
    const { latitude, longitude } = coordinates;
    const newErrors = {};
    
    if (!latitude && latitude !== 0) {
      newErrors.latitude = 'Latitude is required';
    } else if (!isValidCoordinate(latitude, longitude)) {
      newErrors.latitude = 'Invalid coordinates';
      newErrors.longitude = 'Invalid coordinates';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'latitude' || name === 'longitude') {
      const newCoordinates = {
        ...locationData.coordinates,
        [name]: parseFloat(value) || ''
      };
      
      setLocationData({
        ...locationData,
        coordinates: newCoordinates
      });
      
      // Validate coordinates after update
      validateCoordinates(newCoordinates);
    } else {
      setLocationData({
        ...locationData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!locationData.name) {
      setErrors(prev => ({ ...prev, name: 'Location name is required' }));
      return;
    }
    
    if (!validateCoordinates(locationData.coordinates)) {
      return;
    }
    
    setLoading(true);
    
    try {
      await dispatch(updateShipmentLocation({
        id: shipment._id,
        locationData
      })).unwrap();
      
      // Reset form and errors
      setLocationData({
        name: '',
        coordinates: {
          latitude: '',
          longitude: ''
        }
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to update location:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to update location' }));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Update Location</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="form-label">Location Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={locationData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'border-[var(--color-error-500)]' : ''}`}
            placeholder="e.g., Port of Singapore"
            required
          />
          {errors.name && (
            <p className="text-[var(--color-error-500)] text-sm mt-1">{errors.name}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="latitude" className="form-label">Latitude</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={locationData.coordinates.latitude}
              onChange={handleChange}
              className={`form-input ${errors.latitude ? 'border-[var(--color-error-500)]' : ''}`}
              step="0.000001"
              required
            />
            {errors.latitude && (
              <p className="text-[var(--color-error-500)] text-sm mt-1">{errors.latitude}</p>
            )}
          </div>
          <div>
            <label htmlFor="longitude" className="form-label">Longitude</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={locationData.coordinates.longitude}
              onChange={handleChange}
              className={`form-input ${errors.longitude ? 'border-[var(--color-error-500)]' : ''}`}
              step="0.000001"
              required
            />
            {errors.longitude && (
              <p className="text-[var(--color-error-500)] text-sm mt-1">{errors.longitude}</p>
            )}
          </div>
        </div>
        
        {errors.submit && (
          <p className="text-[var(--color-error-500)] text-sm mb-4">{errors.submit}</p>
        )}
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Location'}
        </button>
      </form>
    </div>
  );
};

export default UpdateLocationForm;