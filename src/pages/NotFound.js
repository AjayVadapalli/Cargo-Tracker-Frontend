import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="text-center py-12">
      <div className="text-8xl font-bold text-[var(--color-primary-500)]">404</div>
      <h1 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h1>
      <p className="text-[var(--color-neutral-600)] mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary inline-flex items-center">
        <FiArrowLeft className="mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;