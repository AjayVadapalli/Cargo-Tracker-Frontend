import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import ShipmentTable from '../components/ShipmentTable';
import { fetchShipments, deleteShipment } from '../redux/slices/shipmentSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { shipments, loading, error } = useSelector(state => state.shipments);
  
  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);
  
  const handleRefresh = () => {
    dispatch(fetchShipments());
  };
  
  const handleDeleteShipment = (id) => {
    dispatch(deleteShipment(id));
  };
  
  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Shipment Dashboard</h1>
          <p className="text-[var(--color-neutral-600)]">
            Track and manage all cargo shipments in one place
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            className="btn border border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
          
          <Link to="/create-shipment" className="btn btn-primary">
            <FiPlus className="mr-2 h-4 w-4" />
            Add Shipment
          </Link>
        </div>
      </div>
      
      <div className="card">
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 border-4 border-t-[var(--color-primary-500)] border-r-[var(--color-primary-300)] border-b-[var(--color-primary-200)] border-l-[var(--color-primary-100)] rounded-full animate-spin"></div>
            <p className="mt-2 text-[var(--color-neutral-600)]">Loading shipments...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-[var(--color-error-500)]">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : shipments.length > 0 ? (
          <ShipmentTable 
            shipments={shipments} 
            onDelete={handleDeleteShipment}
          />
        ) : (
          <div className="py-8 text-center">
            <p className="text-[var(--color-neutral-600)]">No shipments found.</p>
            <Link to="/create-shipment" className="mt-4 btn btn-primary inline-block">
              Add Your First Shipment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;