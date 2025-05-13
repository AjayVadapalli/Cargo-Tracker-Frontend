import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiUser, FiSettings, FiLogOut, FiX } from 'react-icons/fi';

const Navbar = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: 'Shipment Status Update',
      message: 'Shipment CT123 has arrived at Port of Singapore',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'ETA Update',
      message: 'Shipment CT456 ETA has been updated to 2:30 PM',
      time: '1 hour ago',
      read: true
    },
    {
      id: 3,
      title: 'New Shipment',
      message: 'New shipment CT789 has been created',
      time: '2 hours ago',
      read: true
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-[var(--color-neutral-200)]">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button 
            className="text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)] focus:outline-none focus:text-[var(--color-primary-500)] lg:hidden mr-4"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          
          <Link to="/" className="flex items-center">
            <img 
              src="https://placehold.co/40x40/0091B5/FFFFFF?text=CT&font=open-sans" 
              alt="Cargo Tracker Logo" 
              className="h-8 w-8 rounded-md"
            />
            <span className="ml-2 text-lg font-semibold text-[var(--color-primary-600)] hidden md:block">
              Cargo Tracker
            </span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-xl px-4 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-[var(--color-neutral-400)]" />
            </div>
            <input 
              type="text" 
              placeholder="Search shipments..."
              className="block w-full pl-10 pr-3 py-2 border border-[var(--color-neutral-300)] rounded-md leading-5 bg-[var(--color-neutral-50)] placeholder-[var(--color-neutral-400)] focus:outline-none focus:placeholder-[var(--color-neutral-300)] focus:border-[var(--color-primary-300)] focus:ring-[var(--color-primary-300)] focus:ring-1 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="p-1 rounded-full text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)] focus:outline-none focus:text-[var(--color-primary-500)] relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
            <span className="sr-only">View notifications</span>
            <FiBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-[var(--color-neutral-200)] flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  <button 
                    className="text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)]"
                    onClick={() => setShowNotifications(false)}
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-[var(--color-neutral-50)] ${!notification.read ? 'bg-[var(--color-primary-50)]' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[var(--color-neutral-900)]">
                            {notification.title}
                          </p>
                          <p className="text-sm text-[var(--color-neutral-600)]">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-[var(--color-neutral-500)]">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-[var(--color-neutral-200)]">
                  <button className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
                    View all notifications
          </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              className="flex items-center max-w-xs rounded-full focus:outline-none"
              onClick={() => setShowProfile(!showProfile)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-[var(--color-primary-500)] flex items-center justify-center text-white">
                <FiUser className="h-5 w-5" />
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-[var(--color-neutral-200)]">
                  <p className="text-sm font-medium text-[var(--color-neutral-900)]">John Doe</p>
                  <p className="text-xs text-[var(--color-neutral-500)]">john.doe@example.com</p>
                </div>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
                  onClick={() => setShowProfile(false)}
                >
                  <FiSettings className="inline-block mr-2 h-4 w-4" />
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
                  onClick={() => {
                    // Add logout logic here
                    setShowProfile(false);
                  }}
                >
                  <FiLogOut className="inline-block mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;