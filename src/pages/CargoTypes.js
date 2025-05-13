import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiX } from 'react-icons/fi';

const initialCargoTypes = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and components',
    handlingRequirements: 'Temperature controlled, Fragile',
    specialInstructions: 'Handle with care, Keep dry',
    restrictions: 'No stacking',
    icon: '📱'
  },
  {
    id: 2,
    name: 'Perishable Goods',
    description: 'Food items and other perishable products',
    handlingRequirements: 'Temperature controlled, Time-sensitive',
    specialInstructions: 'Maintain temperature between 2-8°C',
    restrictions: 'No delays allowed',
    icon: '🥗'
  },
  {
    id: 3,
    name: 'Hazardous Materials',
    description: 'Dangerous goods requiring special handling',
    handlingRequirements: 'Special permits required, Safety equipment needed',
    specialInstructions: 'Follow IATA/IMO regulations strictly',
    restrictions: 'Multiple restrictions apply',
    icon: '⚠️'
  },
  {
    id: 4,
    name: 'General Cargo',
    description: 'Standard non-hazardous goods',
    handlingRequirements: 'Standard handling',
    specialInstructions: 'None',
    restrictions: 'None',
    icon: '📦'
  }
];

const emptyCargo = {
  id: null,
  name: '',
  description: '',
  handlingRequirements: '',
  specialInstructions: '',
  restrictions: '',
  icon: ''
};

const CargoTypes = () => {
  const [cargoTypes, setCargoTypes] = useState(initialCargoTypes);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCargo, setCurrentCargo] = useState(emptyCargo);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Open modal for add or edit
  const openModal = (mode, cargo = emptyCargo) => {
    setModalMode(mode);
    setCurrentCargo(mode === 'edit' ? cargo : emptyCargo);
    setShowModal(true);
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCargo((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update cargo type
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      setCargoTypes((prev) => [
        ...prev,
        { ...currentCargo, id: Date.now() }
      ]);
    } else {
      setCargoTypes((prev) =>
        prev.map((c) => (c.id === currentCargo.id ? currentCargo : c))
      );
    }
    setShowModal(false);
  };

  // Open delete confirmation
  const openDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  // Confirm delete
  const handleDelete = () => {
    setCargoTypes((prev) => prev.filter((c) => c.id !== deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Cargo Types</h1>
        <button
          className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 flex items-center"
          onClick={() => openModal('add')}
        >
          <FiPlus className="mr-2" />
          Add Cargo Type
        </button>
      </div>

      {/* Cargo Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cargoTypes.map((cargo) => (
          <div key={cargo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{cargo.icon}</span>
                  <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                    {cargo.name}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-1 text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)]"
                    onClick={() => openModal('edit', cargo)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="p-1 text-[var(--color-neutral-500)] hover:text-red-500"
                    onClick={() => openDelete(cargo.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p className="text-[var(--color-neutral-600)] mb-4">
                {cargo.description}
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                    Handling Requirements
                  </h4>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    {cargo.handlingRequirements}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                    Special Instructions
                  </h4>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    {cargo.specialInstructions}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                    Restrictions
                  </h4>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    {cargo.restrictions}
                  </p>
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
            <h2 className="text-xl font-bold mb-4">{modalMode === 'add' ? 'Add Cargo Type' : 'Edit Cargo Type'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentCargo.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={currentCargo.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Handling Requirements</label>
                <input
                  type="text"
                  name="handlingRequirements"
                  value={currentCargo.handlingRequirements}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                <input
                  type="text"
                  name="specialInstructions"
                  value={currentCargo.specialInstructions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Restrictions</label>
                <input
                  type="text"
                  name="restrictions"
                  value={currentCargo.restrictions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon (emoji)</label>
                <input
                  type="text"
                  name="icon"
                  value={currentCargo.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md"
                  maxLength={2}
                />
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
                >
                  {modalMode === 'add' ? 'Add' : 'Save'}
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
              <h3 className="text-lg font-semibold">Delete Cargo Type</h3>
            </div>
            <p className="mb-6">Are you sure you want to delete this cargo type? This action cannot be undone.</p>
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
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoTypes; 