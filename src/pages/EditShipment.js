import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft } from 'react-icons/fi';
import { fetchShipmentById, updateShipment } from '../redux/slices/shipmentSlice';

const EditShipment = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentShipment, loading, error } = useSelector(state => state.shipments);
  
  const [formData, setFormData] = useState({
    containerId: '',
    cargo: {
      type: '',
      weight: '',
      unit: 'kg'
    },
    notes: '',
    route: []
  });

  useEffect(() => {
    dispatch(fetchShipmentById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentShipment) {
      setFormData({
        containerId: currentShipment.containerId,
        cargo: {
          type: currentShipment.cargo.type,
          weight: currentShipment.cargo.weight,
          unit: currentShipment.cargo.unit
        },
        notes: currentShipment.notes || '',
        route: currentShipment.route
      });
    }
  }, [currentShipment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateShipment({ id, ...formData })).unwrap();
      navigate(`/shipment/${id}`);
    } catch (err) {
      console.error('Failed to update shipment:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('cargo.')) {
      const cargoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        cargo: {
          ...prev.cargo,
          [cargoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
        <button onClick={() => navigate(-1)} className="mt-4 btn btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)] mb-2"
        >
          <FiArrowLeft className="mr-1" /> Back to Shipment Details
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
          Edit Shipment
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Container ID
            </label>
            <input
              type="text"
              name="containerId"
              value={formData.containerId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Cargo Type
            </label>
            <input
              type="text"
              name="cargo.type"
              value={formData.cargo.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Weight
            </label>
            <div className="flex">
              <input
                type="number"
                name="cargo.weight"
                value={formData.cargo.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                required
              />
              <select
                name="cargo.unit"
                value={formData.cargo.unit}
                onChange={handleChange}
                className="px-3 py-2 border border-[var(--color-neutral-300)] border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="tons">tons</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn border border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShipment; 