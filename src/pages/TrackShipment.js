import React, { useState, useEffect } from 'react';
import { FiTruck, FiMapPin, FiClock, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import axios from 'axios';
import moment from 'moment';

// MongoDB ObjectId validation regex
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First try to find by container number
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/shipment/by-container/${trackingId}`
      );
      setShipment(response.data);
    } catch (err) {
      // If not found by container number and it's a valid ObjectId, try by ID
      if (err.response?.status === 404 && isValidObjectId(trackingId)) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/shipment/${trackingId}`
          );
          setShipment(response.data);
        } catch (idErr) {
          setError('Shipment not found. Please check the tracking ID and try again.');
        }
      } else {
        setError('Shipment not found. Please check the tracking ID and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh tracking data every 30 seconds if shipment is in transit
  useEffect(() => {
    let interval;
    if (shipment && shipment.status === 'In Transit') {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/shipment/${shipment._id}`);
          setShipment(response.data);
        } catch (err) {
          console.error('Failed to refresh shipment data:', err);
        }
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [shipment]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Loading': return 'bg-yellow-100 text-yellow-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-neutral-900)] mb-8">Track Shipment</h1>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID or container number"
                className="w-full px-4 py-2 border border-[var(--color-neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--color-primary-500)] text-white rounded-md hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8 flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      )}

      {/* Shipment Details */}
      {shipment && (
        <div className="space-y-8">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-neutral-900)]">
                  Container {shipment.containerId}
                </h2>
                <p className="text-[var(--color-neutral-600)]">
                  {shipment.cargo.type} • {shipment.cargo.weight} {shipment.cargo.unit}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                {shipment.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <FiMapPin className="text-[var(--color-primary-500)] mr-2" />
                <div>
                  <p className="text-sm text-[var(--color-neutral-600)]">Current Location</p>
                  <p className="font-medium">{shipment.currentLocation.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiClock className="text-[var(--color-primary-500)] mr-2" />
                <div>
                  <p className="text-sm text-[var(--color-neutral-600)]">Last Updated</p>
                  <p className="font-medium">{moment(shipment.currentLocation.timestamp).format('MMM D, YYYY HH:mm')}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiTruck className="text-[var(--color-primary-500)] mr-2" />
                <div>
                  <p className="text-sm text-[var(--color-neutral-600)]">Estimated Arrival</p>
                  <p className="font-medium">{moment(shipment.estimatedArrival).format('MMM D, YYYY')}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiPackage className="text-[var(--color-primary-500)] mr-2" />
                <div>
                  <p className="text-sm text-[var(--color-neutral-600)]">Cargo Type</p>
                  <p className="font-medium">{shipment.cargo.type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Shipment Route</h3>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapContainer
                center={[shipment.currentLocation.coordinates.latitude, shipment.currentLocation.coordinates.longitude]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Route Line */}
                <Polyline
                  positions={shipment.route.map(loc => [loc.coordinates.latitude, loc.coordinates.longitude])}
                  color="var(--color-primary-500)"
                  weight={3}
                  opacity={0.7}
                />
                {/* Markers for each location */}
                {shipment.route.map((location, index) => (
                  <Marker
                    key={index}
                    position={[location.coordinates.latitude, location.coordinates.longitude]}
                  >
                    <Popup>
                      <div>
                        <p className="font-medium">{location.name}</p>
                        {location.arrivalTime && (
                          <p className="text-sm text-[var(--color-neutral-600)]">
                            Arrival: {moment(location.arrivalTime).format('MMM D, YYYY HH:mm')}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Tracking History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
            <div className="space-y-4">
              {shipment.route.map((location, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-green-500' :
                      index === shipment.route.length - 1 ? 'bg-red-500' :
                      'bg-[var(--color-primary-500)]'
                    }`} />
                    {index < shipment.route.length - 1 && (
                      <div className="w-0.5 h-12 bg-[var(--color-neutral-200)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{location.name}</p>
                        {location.arrivalTime && (
                          <p className="text-sm text-[var(--color-neutral-600)]">
                            Arrived: {moment(location.arrivalTime).format('MMM D, YYYY HH:mm')}
                          </p>
                        )}
                        {location.departureTime && (
                          <p className="text-sm text-[var(--color-neutral-600)]">
                            Departed: {moment(location.departureTime).format('MMM D, YYYY HH:mm')}
                          </p>
                        )}
                      </div>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Origin
                        </span>
                      )}
                      {index === shipment.route.length - 1 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Destination
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackShipment; 