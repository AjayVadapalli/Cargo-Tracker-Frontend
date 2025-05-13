import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import { createShipment } from '../redux/slices/shipmentSlice';

const CreateShipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.shipments);
  
  const [formData, setFormData] = useState({
    containerId: '',
    departureDate: '',
    estimatedArrival: '',
    status: 'Loading',
    cargo: {
      type: '',
      weight: '',
      unit: 'tons'
    },
    notes: '',
    currentLocation: {
      name: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    route: []
  });
  
  const [routeStop, setRouteStop] = useState({
    name: '',
    coordinates: {
      latitude: '',
      longitude: ''
    },
    arrivalTime: '',
    departureTime: ''
  });
  
  const [errors, setErrors] = useState({
    currentLocation: {},
    routeStop: {}
  });
  
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
  
  const validateCoordinates = (coordinates, type) => {
    const { latitude, longitude } = coordinates;
    const newErrors = { ...errors[type] };
    
    if (!latitude && latitude !== 0) {
      newErrors.latitude = 'Latitude is required';
    } else if (!isValidCoordinate(latitude, longitude)) {
      newErrors.latitude = 'Invalid coordinates';
      newErrors.longitude = 'Invalid coordinates';
    } else {
      delete newErrors.latitude;
      delete newErrors.longitude;
    }
    
    setErrors(prev => ({
      ...prev,
      [type]: newErrors
    }));
    
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('cargo.')) {
      const cargoField = name.split('.')[1];
      setFormData({
        ...formData,
        cargo: {
          ...formData.cargo,
          [cargoField]: value
        }
      });
    } else if (name.includes('currentLocation.')) {
      const locationField = name.split('.')[1];
      if (locationField === 'latitude' || locationField === 'longitude') {
        const newCoordinates = {
          ...formData.currentLocation.coordinates,
          [locationField]: parseFloat(value) || ''
        };
        
        setFormData({
          ...formData,
          currentLocation: {
            ...formData.currentLocation,
            coordinates: newCoordinates
          }
        });
        
        // Validate coordinates after update
        validateCoordinates(newCoordinates, 'currentLocation');
      } else {
        setFormData({
          ...formData,
          currentLocation: {
            ...formData.currentLocation,
            [locationField]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleRouteStopChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'latitude' || name === 'longitude') {
      const newCoordinates = {
        ...routeStop.coordinates,
        [name]: parseFloat(value) || ''
      };
      
      setRouteStop({
        ...routeStop,
        coordinates: newCoordinates
      });
      
      // Validate coordinates after update
      validateCoordinates(newCoordinates, 'routeStop');
    } else {
      setRouteStop({
        ...routeStop,
        [name]: value
      });
    }
  };
  
  const addRouteStop = () => {
    if (!routeStop.name) {
      setErrors(prev => ({
        ...prev,
        routeStop: { ...prev.routeStop, name: 'Location name is required' }
      }));
      return;
    }
    
    if (!validateCoordinates(routeStop.coordinates, 'routeStop')) {
      return;
    }
    
    setFormData({
      ...formData,
      route: [...formData.route, routeStop]
    });
    
    // Clear route stop form and errors
    setRouteStop({
      name: '',
      coordinates: {
        latitude: '',
        longitude: ''
      },
      arrivalTime: '',
      departureTime: ''
    });
    setErrors(prev => ({
      ...prev,
      routeStop: {}
    }));
  };
  
  const removeRouteStop = (index) => {
    const updatedRoute = [...formData.route];
    updatedRoute.splice(index, 1);
    setFormData({
      ...formData,
      route: updatedRoute
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate current location coordinates
    if (!validateCoordinates(formData.currentLocation.coordinates, 'currentLocation')) {
      return;
    }
    
    // Validate all route stop coordinates
    const hasInvalidRouteStops = formData.route.some(stop => 
      !validateCoordinates(stop.coordinates, 'routeStop')
    );
    
    if (hasInvalidRouteStops) {
      return;
    }
    
    // Ensure the current location is included in the route if not already
    let finalFormData = { ...formData };
    
    // Check if current location already exists in route
    const currentLocationInRoute = formData.route.some(
      stop => stop.name === formData.currentLocation.name
    );
    
    if (!currentLocationInRoute && formData.currentLocation.name) {
      // Add current location to beginning of route
      finalFormData = {
        ...finalFormData,
        route: [
          {
            name: formData.currentLocation.name,
            coordinates: formData.currentLocation.coordinates,
            departureTime: new Date().toISOString()
          },
          ...formData.route
        ]
      };
    }
    
    try {
      const result = await dispatch(createShipment(finalFormData)).unwrap();
      navigate(`/shipment/${result._id}`);
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };
  
  return (
    <div className="fade-in">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)] mb-2">
          <FiArrowLeft className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Create New Shipment</h1>
        <p className="text-[var(--color-neutral-600)]">
          Enter the details of the new cargo shipment
        </p>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              
              <div className="mb-4">
                <label htmlFor="containerId" className="form-label">Container ID</label>
                <input
                  type="text"
                  id="containerId"
                  name="containerId"
                  value={formData.containerId}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="departureDate" className="form-label">Departure Date</label>
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="estimatedArrival" className="form-label">Estimated Arrival</label>
                  <input
                    type="date"
                    id="estimatedArrival"
                    name="estimatedArrival"
                    value={formData.estimatedArrival}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Loading">Loading</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input h-24"
                  placeholder="Any additional information about this shipment"
                ></textarea>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Cargo Details</h2>
              
              <div className="mb-4">
                <label htmlFor="cargo.type" className="form-label">Cargo Type</label>
                <input
                  type="text"
                  id="cargo.type"
                  name="cargo.type"
                  value={formData.cargo.type}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Electronics, Furniture, etc."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="cargo.weight" className="form-label">Weight</label>
                  <input
                    type="number"
                    id="cargo.weight"
                    name="cargo.weight"
                    value={formData.cargo.weight}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cargo.unit" className="form-label">Unit</label>
                  <select
                    id="cargo.unit"
                    name="cargo.unit"
                    value={formData.cargo.unit}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                  </select>
                </div>
              </div>
              
              <h2 className="text-lg font-semibold mb-4 mt-6">Current Location</h2>
              
              <div className="mb-4">
                <label htmlFor="currentLocation.name" className="form-label">Location Name</label>
                <input
                  type="text"
                  id="currentLocation.name"
                  name="currentLocation.name"
                  value={formData.currentLocation.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Port of Shanghai"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="currentLocation.latitude" className="form-label">Latitude</label>
                  <input
                    type="number"
                    id="currentLocation.latitude"
                    name="currentLocation.latitude"
                    value={formData.currentLocation.coordinates.latitude}
                    onChange={handleChange}
                    className={`form-input ${errors.currentLocation.latitude ? 'border-[var(--color-error-500)]' : ''}`}
                    step="0.000001"
                    required
                  />
                  {errors.currentLocation.latitude && (
                    <p className="text-[var(--color-error-500)] text-sm mt-1">{errors.currentLocation.latitude}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="currentLocation.longitude" className="form-label">Longitude</label>
                  <input
                    type="number"
                    id="currentLocation.longitude"
                    name="currentLocation.longitude"
                    value={formData.currentLocation.coordinates.longitude}
                    onChange={handleChange}
                    className={`form-input ${errors.currentLocation.longitude ? 'border-[var(--color-error-500)]' : ''}`}
                    step="0.000001"
                    required
                  />
                  {errors.currentLocation.longitude && (
                    <p className="text-[var(--color-error-500)] text-sm mt-1">{errors.currentLocation.longitude}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <hr className="my-6 border-[var(--color-neutral-200)]" />
          
          <h2 className="text-lg font-semibold mb-4">Route Stops</h2>
          
          {formData.route.length > 0 && (
            <div className="mb-6">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Coordinates</th>
                      <th>Arrival</th>
                      <th>Departure</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.route.map((stop, index) => (
                      <tr key={index}>
                        <td>{stop.name}</td>
                        <td className="text-xs">
                          {stop.coordinates.latitude}, {stop.coordinates.longitude}
                        </td>
                        <td>{stop.arrivalTime ? new Date(stop.arrivalTime).toLocaleDateString() : '-'}</td>
                        <td>{stop.departureTime ? new Date(stop.departureTime).toLocaleDateString() : '-'}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => removeRouteStop(index)}
                            className="text-[var(--color-error-500)] hover:text-[var(--color-error-700)]"
                            title="Remove stop"
                          >
                            <FiX />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg mb-6">
            <h3 className="text-md font-medium mb-3">Add Route Stop</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="stopName" className="form-label">Location Name</label>
                <input
                  type="text"
                  id="stopName"
                  name="name"
                  value={routeStop.name}
                  onChange={handleRouteStopChange}
                  className="form-input"
                  placeholder="e.g., Port of Singapore"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="stopLatitude" className="form-label">Latitude</label>
                  <input
                    type="number"
                    id="stopLatitude"
                    name="latitude"
                    value={routeStop.coordinates.latitude}
                    onChange={handleRouteStopChange}
                    className={`form-input ${errors.routeStop.latitude ? 'border-[var(--color-error-500)]' : ''}`}
                    step="0.000001"
                  />
                  {errors.routeStop.latitude && (
                    <p className="text-[var(--color-error-500)] text-sm mt-1">{errors.routeStop.latitude}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="stopLongitude" className="form-label">Longitude</label>
                  <input
                    type="number"
                    id="stopLongitude"
                    name="longitude"
                    value={routeStop.coordinates.longitude}
                    onChange={handleRouteStopChange}
                    className={`form-input ${errors.routeStop.longitude ? 'border-[var(--color-error-500)]' : ''}`}
                    step="0.000001"
                  />
                  {errors.routeStop.longitude && (
                    <p className="text-[var(--color-error-500)] text-sm mt-1">{errors.routeStop.longitude}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="arrivalTime" className="form-label">Expected Arrival</label>
                <input
                  type="datetime-local"
                  id="arrivalTime"
                  name="arrivalTime"
                  value={routeStop.arrivalTime}
                  onChange={handleRouteStopChange}
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="departureTime" className="form-label">Expected Departure</label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  name="departureTime"
                  value={routeStop.departureTime}
                  onChange={handleRouteStopChange}
                  className="form-input"
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={addRouteStop}
              className="btn bg-[var(--color-neutral-100)] border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Stop
            </button>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link to="/" className="btn border border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;