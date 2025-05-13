import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map view when center changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ShipmentMap = ({ shipment }) => {
  const [mapCenter, setMapCenter] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [currentLocationCoords, setCurrentLocationCoords] = useState(null);
  const [error, setError] = useState(null);
  const defaultZoom = 8; // Increased zoom level for better detail
  
  // Colors
  const currentLocationIcon = createCustomIcon('red');
  const routeLocationIcon = createCustomIcon('blue');
  const destinationIcon = createCustomIcon('green');
  
  // Memoize the coordinate validation function
  const isValidCoordinate = React.useCallback((lat, lng) => {
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
  }, []);

  // Memoize the route points processing
  const processRoutePoints = React.useCallback((route) => {
    return route
      .filter(loc => {
        const isValid = isValidCoordinate(loc.coordinates.latitude, loc.coordinates.longitude);
        if (!isValid) {
          console.warn(`Invalid coordinates for route stop ${loc.name}: ${loc.coordinates.latitude}, ${loc.coordinates.longitude}`);
        }
        return isValid;
      })
      .map(loc => [loc.coordinates.latitude, loc.coordinates.longitude]);
  }, [isValidCoordinate]);

  useEffect(() => {
    if (!shipment?.currentLocation?.coordinates) {
      setError('Missing shipment location data');
      return;
    }

    const { latitude, longitude } = shipment.currentLocation.coordinates;
    
    // Only update if coordinates are valid and different from current state
    if (isValidCoordinate(latitude, longitude)) {
      const newCoords = [latitude, longitude];
      const newCenter = [latitude, longitude];
      
      // Only update state if values have changed
      if (JSON.stringify(newCoords) !== JSON.stringify(currentLocationCoords)) {
        setCurrentLocationCoords(newCoords);
        setMapCenter(newCenter);
        setError(null);
      }

      // Process route points only if they exist and are different
      if (shipment.route?.length > 0) {
        const newRoutePoints = processRoutePoints(shipment.route);
        if (JSON.stringify(newRoutePoints) !== JSON.stringify(routePoints)) {
          setRoutePoints(newRoutePoints);
        }
      } else {
        setRoutePoints([]);
      }
    } else {
      setError(`Invalid current location coordinates: ${latitude}, ${longitude}`);
    }
  }, [shipment, isValidCoordinate, processRoutePoints, currentLocationCoords, routePoints]);

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-[var(--color-neutral-100)] rounded-lg">
        <p className="text-[var(--color-error-500)] text-center px-4">
          {error}
        </p>
      </div>
    );
  }

  if (!shipment || !mapCenter || !currentLocationCoords) {
    return (
      <div className="h-64 flex items-center justify-center bg-[var(--color-neutral-100)] rounded-lg">
        <p className="text-[var(--color-neutral-500)]">
          {!shipment ? 'No shipment data available' : 'Loading map...'}
        </p>
      </div>
    );
  }

  return (
    <div className="card h-[400px] md:h-[500px]">
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <ChangeView center={mapCenter} zoom={defaultZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Route line */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            pathOptions={{ color: 'var(--color-primary-500)', weight: 3, opacity: 0.7, dashArray: '5, 10' }}
            className="route-path"
          />
        )}
        
        {/* Current location marker */}
        <Marker 
          position={currentLocationCoords} 
          icon={currentLocationIcon}
        >
          <Popup>
            <div>
              <h3 className="font-medium">Current Location: {shipment.currentLocation.name}</h3>
              <p className="text-sm text-[var(--color-neutral-600)]">
                Updated: {new Date(shipment.currentLocation.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-[var(--color-neutral-600)]">
                Coordinates: {currentLocationCoords[0].toFixed(6)}, {currentLocationCoords[1].toFixed(6)}
              </p>
              <p className="text-sm text-[var(--color-neutral-600)]">
                Status: <span className={`font-medium ${shipment.status === 'Delivered' ? 'text-[var(--color-success-500)]' : shipment.status === 'Delayed' ? 'text-[var(--color-warning-500)]' : 'text-[var(--color-primary-500)]'}`}>
                  {shipment.status}
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
        
        {/* Route location markers */}
        {shipment.route.map((location, index) => {
          if (!isValidCoordinate(location.coordinates.latitude, location.coordinates.longitude)) {
            return null;
          }

          const isFirstLocation = index === 0;
          const isLastLocation = index === shipment.route.length - 1;
          const icon = isLastLocation ? destinationIcon : 
                     isFirstLocation ? routeLocationIcon : routeLocationIcon;
          
          return (
            <Marker
              key={`${location.name}-${index}`}
              position={[location.coordinates.latitude, location.coordinates.longitude]}
              icon={icon}
            >
              <Popup>
                <div>
                  <h3 className="font-medium">
                    {isFirstLocation ? 'Origin: ' : isLastLocation ? 'Destination: ' : 'Stop: '}
                    {location.name}
                  </h3>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    Coordinates: {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
                  </p>
                  {location.arrivalTime && (
                    <p className="text-sm text-[var(--color-neutral-600)]">
                      Expected Arrival: {new Date(location.arrivalTime).toLocaleString()}
                    </p>
                  )}
                  {location.departureTime && (
                    <p className="text-sm text-[var(--color-neutral-600)]">
                      Departure: {new Date(location.departureTime).toLocaleString()}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ShipmentMap;