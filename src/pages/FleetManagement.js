import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiX, FiTruck, FiMapPin, FiClock } from 'react-icons/fi';
import axios from 'axios';
import moment from 'moment';

const initialVehicles = [
  {
    id: 1,
    vehicleNumber: 'TRK-001',
    type: 'Semi-Truck',
    status: 'Available',
    currentLocation: 'New York',
    lastMaintenance: '2024-02-15',
    capacity: '20 tons',
    driver: 'John Doe',
    licensePlate: 'NY-1234',
    model: 'Volvo FH16',
    year: 2022
  },
  {
    id: 2,
    vehicleNumber: 'TRK-002',
    type: 'Container Truck',
    status: 'In Transit',
    currentLocation: 'Los Angeles',
    lastMaintenance: '2024-03-01',
    capacity: '40 tons',
    driver: 'Jane Smith',
    licensePlate: 'CA-5678',
    model: 'Scania R500',
    year: 2023
  }
];

const emptyVehicle = {
  id: null,
  vehicleNumber: '',
  type: '',
  status: 'Available',
  currentLocation: '',
  lastMaintenance: '',
  capacity: '',
  driver: '',
  licensePlate: '',
  model: '',
  year: new Date().getFullYear()
};

const FleetManagement = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentVehicle, setCurrentVehicle] = useState(emptyVehicle);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Open modal for add or edit
  const openModal = (mode, vehicle = emptyVehicle) => {
    setModalMode(mode);
    setCurrentVehicle(mode === 'edit' ? vehicle : emptyVehicle);
    setShowModal(true);
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehicle((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update vehicle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (modalMode === 'add') {
        // TODO: Replace with actual API call
        const newVehicle = { ...currentVehicle, id: Date.now() };
        setVehicles((prev) => [...prev, newVehicle]);
      } else {
        // TODO: Replace with actual API call
        setVehicles((prev) =>
          prev.map((v) => (v.id === currentVehicle.id ? currentVehicle : v))
        );
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation
  const openDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      setVehicles((prev) => prev.filter((v) => v.id !== deleteId));
      setShowDelete(false);
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Fleet Management</h1>
        <button
          className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 flex items-center"
          onClick={() => openModal('add')}
        >
          <FiPlus className="mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8 flex items-center">
          <FiAlertTriangle className="mr-2" />
          {error}
        </div>
      )}

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiTruck className="text-3xl text-[var(--color-primary-500)] mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                      {vehicle.vehicleNumber}
                    </h3>
                    <p className="text-sm text-[var(--color-neutral-600)]">
                      {vehicle.model} ({vehicle.year})
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-1 text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)]"
                    onClick={() => openModal('edit', vehicle)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="p-1 text-[var(--color-neutral-500)] hover:text-red-500"
                    onClick={() => openDelete(vehicle.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-neutral-600)]">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="text-[var(--color-neutral-500)] mr-2" />
                  <div>
                    <p className="text-sm text-[var(--color-neutral-600)]">Current Location</p>
                    <p className="font-medium">{vehicle.currentLocation}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiClock className="text-[var(--color-neutral-500)] mr-2" />
                  <div>
                    <p className="text-sm text-[var(--color-neutral-600)]">Last Maintenance</p>
                    <p className="font-medium">{moment(vehicle.lastMaintenance).format('MMM D, YYYY')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-[var(--color-neutral-600)]">Driver</p>
                    <p className="font-medium">{vehicle.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-neutral-600)]">License Plate</p>
                    <p className="font-medium">{vehicle.licensePlate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-neutral-600)]">Capacity</p>
                  <p className="font-medium">{vehicle.capacity}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-[var(--color-neutral-50)] border-t border-[var(--color-neutral-200)]">
              <button className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]"
              onClick={() => setShowModal(false)}
            >
              <FiX className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={currentVehicle.vehicleNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    name="type"
                    value={currentVehicle.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Semi-Truck">Semi-Truck</option>
                    <option value="Container Truck">Container Truck</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Refrigerated Truck">Refrigerated Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={currentVehicle.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Location</label>
                  <input
                    type="text"
                    name="currentLocation"
                    value={currentVehicle.currentLocation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Last Maintenance</label>
                  <input
                    type="date"
                    name="lastMaintenance"
                    value={currentVehicle.lastMaintenance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input
                    type="text"
                    name="capacity"
                    value={currentVehicle.capacity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Driver</label>
                  <input
                    type="text"
                    name="driver"
                    value={currentVehicle.driver}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">License Plate</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={currentVehicle.licensePlate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={currentVehicle.model}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={currentVehicle.year}
                    onChange={handleChange}
                    min="2000"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)] rounded-md hover:bg-[var(--color-neutral-300)]"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md hover:bg-[var(--color-primary-600)]"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : modalMode === 'add' ? 'Add Vehicle' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button
              className="absolute top-3 right-3 text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]"
              onClick={() => setShowDelete(false)}
            >
              <FiX className="h-5 w-5" />
            </button>
            <div className="flex items-center mb-4">
              <FiAlertTriangle className="text-red-500 h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Delete Vehicle</h3>
            </div>
            <p className="mb-6">Are you sure you want to delete this vehicle? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)] rounded-md hover:bg-[var(--color-neutral-300)]"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement; 