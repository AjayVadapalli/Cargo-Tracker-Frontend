import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import moment from 'moment';
import { fetchShipmentById, deleteShipment, clearCurrentShipment } from '../redux/slices/shipmentSlice';
import ShipmentMap from '../components/ShipmentMap';
import ShipmentStatusCard from '../components/ShipmentStatusCard';
import UpdateLocationForm from '../components/UpdateLocationForm';

const ShipmentDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentShipment, loading, error } = useSelector(state => state.shipments);
  
  useEffect(() => {
    dispatch(fetchShipmentById(id));
    
    return () => {
      dispatch(clearCurrentShipment());
    };
  }, [dispatch, id]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      await dispatch(deleteShipment(id));
      navigate('/');
    }
  };
  
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 border-4 border-t-[var(--color-primary-500)] border-r-[var(--color-primary-300)] border-b-[var(--color-primary-200)] border-l-[var(--color-primary-100)] rounded-full animate-spin"></div>
        <p className="mt-2 text-[var(--color-neutral-600)]">Loading shipment details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-[var(--color-error-500)]">{error}</p>
        <Link to="/" className="mt-4 btn btn-primary inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  if (!currentShipment) {
    return (
      <div className="py-8 text-center">
        <p className="text-[var(--color-neutral-600)]">Shipment not found.</p>
        <Link to="/" className="mt-4 btn btn-primary inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <Link to="/" className="inline-flex items-center text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)] mb-2">
            <FiArrowLeft className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
            Shipment: {currentShipment.containerId}
          </h1>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link to={`/shipment/${id}/edit`} className="btn border border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]">
            <FiEdit2 className="mr-2 h-4 w-4" />
            Edit
          </Link>
          
          <button
            onClick={handleDelete}
            className="btn btn-error"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ShipmentMap shipment={currentShipment} />
        </div>
        
        <div>
          <ShipmentStatusCard shipment={currentShipment} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold mb-4">Shipment Route</h2>
          
          <div className="relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-8 before:w-0.5 before:bg-[var(--color-primary-300)]">
            {currentShipment.route.map((location, index) => (
              <div key={index} className="mb-6 relative">
                <div className="absolute left-[-12px] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[var(--color-primary-500)]"></div>
                <div className="slide-in">
                  <h3 className="font-medium">{location.name}</h3>
                  
                  <div className="text-sm text-[var(--color-neutral-600)] ml-2">
                    {location.arrivalTime && (
                      <p>Expected Arrival: {moment(location.arrivalTime).format('MMM D, YYYY, h:mm a')}</p>
                    )}
                    {location.departureTime && (
                      <p>Departure: {moment(location.departureTime).format('MMM D, YYYY, h:mm a')}</p>
                    )}
                    <p className="text-xs mt-1">
                      Coordinates: {location.coordinates.latitude}, {location.coordinates.longitude}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <UpdateLocationForm shipment={currentShipment} />
        </div>
      </div>
      
      <div className="card mt-6">
        <h2 className="text-xl font-bold mb-4">Cargo Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Cargo Type</p>
            <p className="font-medium">{currentShipment.cargo.type}</p>
          </div>
          
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Weight</p>
            <p className="font-medium">{currentShipment.cargo.weight} {currentShipment.cargo.unit}</p>
          </div>
          
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Notes</p>
            <p className="font-medium">{currentShipment.notes || 'No notes available'}</p>
          </div>
        </div>
        
        <hr className="my-4 border-[var(--color-neutral-200)]" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Created At</p>
            <p className="font-medium">{moment(currentShipment.createdAt).format('MMM D, YYYY')}</p>
          </div>
          
          <div>
            <p className="text-sm text-[var(--color-neutral-500)] font-medium">Last Updated</p>
            <p className="font-medium">{moment(currentShipment.updatedAt).format('MMM D, YYYY')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;