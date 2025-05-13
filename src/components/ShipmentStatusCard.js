import React from 'react';
import { FiTruck, FiClock, FiMapPin, FiPackage } from 'react-icons/fi';
import moment from 'moment';

const ShipmentStatusCard = ({ shipment }) => {
  if (!shipment) return null;
  
  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Loading':
        return 'var(--color-neutral-500)';
      case 'In Transit':
        return 'var(--color-primary-500)';
      case 'Delivered':
        return 'var(--color-success-500)';
      case 'Delayed':
        return 'var(--color-warning-500)';
      default:
        return 'var(--color-neutral-500)';
    }
  };
  
  const statusColor = getStatusColor(shipment.status);
  
  // Calculate remaining days
  const remainingDays = () => {
    const today = moment();
    const arrivalDate = moment(shipment.estimatedArrival);
    return Math.max(0, arrivalDate.diff(today, 'days'));
  };
  
  return (
    <div className="card border-t-4" style={{ borderTopColor: statusColor }}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">Shipment Status</h2>
        <span 
          className="shipment-status" 
          style={{ 
            backgroundColor: `${statusColor}20`, // 20% opacity
            color: statusColor
          }}
        >
          {shipment.status}
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="text-[var(--color-primary-500)] mr-3">
            <FiTruck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Container ID</p>
            <p className="font-medium">{shipment.containerId}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-[var(--color-primary-500)] mr-3">
            <FiMapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Current Location</p>
            <p className="font-medium">{shipment.currentLocation.name}</p>
            <p className="text-xs text-[var(--color-neutral-500)]">
              Updated {moment(shipment.currentLocation.timestamp).fromNow()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-[var(--color-primary-500)] mr-3">
            <FiClock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Estimated Arrival</p>
            <p className="font-medium">{moment(shipment.estimatedArrival).format('MMM D, YYYY')}</p>
            <p className="text-xs text-[var(--color-neutral-500)]">
              {remainingDays()} days remaining
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-[var(--color-primary-500)] mr-3">
            <FiPackage className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Cargo</p>
            <p className="font-medium">{shipment.cargo.type}</p>
            <p className="text-xs text-[var(--color-neutral-500)]">
              {shipment.cargo.weight} {shipment.cargo.unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentStatusCard;