import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaBell,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

interface TopNavigationBarProps {
  onLogout: () => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSupportMenu, setShowSupportMenu] = useState(false);

  const user = useSelector((state: any) => state.auth.user);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Table 5 has placed a new order",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Pizza Margherita is running low",
      time: "15 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "Payment Completed",
      message: "Payment of ₹450 received for Table 3",
      time: "1 hour ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - could add breadcrumbs or page title */}
        <div className="flex items-center">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 hidden sm:block">
            Restaurant Management System
          </h1>
          <h1 className="text-lg font-semibold text-gray-800 sm:hidden">
            RMS
          </h1>
        </div>

        {/* Right side - Navigation items */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="relative">
            <button
              onClick={() => setShowSupportMenu(!showSupportMenu)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaEnvelope className="w-5 h-5" />
            </button>

            {/* Support Dropdown */}
            {showSupportMenu && (
              <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Support</h3>
                  <div className="space-y-3">
                    <a
                      href="mailto:support@restaurant.com"
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FaEnvelope className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Email Support</span>
                    </a>
                    <a
                      href="tel:+1234567890"
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FaPhone className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Call Support</span>
                    </a>
                    <button className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors w-full text-left">
                      <FaCog className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Help Center</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.userRole}</p>
              </div>
              <FaChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 md:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <FaUser className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <FaCog className="w-4 h-4" />
                    <span>Account Settings</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfileMenu || showSupportMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
            setShowSupportMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default TopNavigationBar;
