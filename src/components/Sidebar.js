import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTruck, FiMap, FiPlus, FiBriefcase, FiSettings, FiHelpCircle, FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/' },
    { name: 'Create Shipment', icon: <FiPlus />, path: '/create-shipment' },
    { name: 'Track Shipment', icon: <FiMap />, path: '/track-shipment' },
    { name: 'Fleet Management', icon: <FiTruck />, path: '/fleet-management' },
    { name: 'Cargo Types', icon: <FiBriefcase />, path: '/cargo-types' },
  ];
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--color-primary-800)] transform transition-transform ease-in-out duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--color-primary-700)]">
          <Link to="/" className="flex items-center">
            <img 
              src="https://placehold.co/40x40/0091B5/FFFFFF?text=CT&font=open-sans" 
              alt="Cargo Tracker Logo"
              className="h-8 w-8 rounded-md" 
            />
            <span className="ml-2 text-lg font-semibold text-white">
              Cargo Tracker
            </span>
          </Link>
          <button 
            className="lg:hidden text-white hover:text-[var(--color-primary-300)] focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-4 py-6">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                    isActive
                      ? 'bg-[var(--color-primary-700)] text-white'
                      : 'text-[var(--color-primary-100)] hover:text-white hover:bg-[var(--color-primary-700)]'
                  }`}
                >
                  <span className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-[var(--color-primary-300)]'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-10">
            <h3 className="px-3 text-xs font-semibold text-[var(--color-primary-300)] uppercase tracking-wider">
              Support
            </h3>
            <div className="mt-2 space-y-1">
              <Link
                to="/settings"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-[var(--color-primary-100)] hover:text-white hover:bg-[var(--color-primary-700)]"
              >
                <span className="mr-3 h-5 w-5 text-[var(--color-primary-300)]">
                  <FiSettings />
                </span>
                Settings
              </Link>
              <Link
                to="/help-support"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-[var(--color-primary-100)] hover:text-white hover:bg-[var(--color-primary-700)]"
              >
                <span className="mr-3 h-5 w-5 text-[var(--color-primary-300)]">
                  <FiHelpCircle />
                </span>
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;