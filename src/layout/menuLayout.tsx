import React, { useState } from "react";
import {
  FaUserPlus,
  FaUser,
  FaBuilding,
  FaLayerGroup,
  FaTable,
  FaBox,
  FaBoxes,
  FaTachometerAlt,
  FaShoppingCart,
  FaTags,
  FaMoneyBillWave,
  FaUserShield,
  FaKey,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaClipboardList,
  FaUserTie,
  FaFileInvoiceDollar,
  FaPowerOff,
  FaUtensils,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  to?: string;
  children?: MenuItem[];
  badge?: string;
}

const MenuLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // @ts-expect-error - parameter is used in callback
  const [collapsed, setCollapsed] = useState(false);
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMenu = (key: string) => {
    setOpenMenuKey((prev) => (prev === key ? null : key));
  };

  const mainMenuItems: MenuItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      to: "/dashboard",
    },
    {
      key: "dining",
      label: "Dining",
      icon: <FaUtensils />,
      to: "/",
    },
    {
      key: "sales",
      label: "Sales",
      icon: <FaChartBar />,
      children: [
        {
          key: "orders",
          label: "Orders",
          to: "/orders",
          icon: <FaShoppingCart />,
        },
      ],
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: <FaBox />,
      children: [
        {
          key: "items",
          label: "Items",
          to: "/items",
          icon: <FaBoxes />,
        },
        {
          key: "categories",
          label: "Categories",
          to: "/category",
          icon: <FaTags />,
        },
      ],
    },
    {
      key: "floor-management",
      label: "Floor Management",
      icon: <FaBuilding />,
      children: [
        {
          key: "block-floor",
          label: "Block or Floor",
          to: "/block-floor",
          icon: <FaLayerGroup />,
        },
        {
          key: "tables",
          label: "Tables",
          to: "/tables",
          icon: <FaTable />,
        },
      ],
    },
    {
      key: "user-management",
      label: "User Management",
      icon: <FaUserShield />,
      children: [
        {
          key: "users",
          label: "Users",
          to: "/users",
          icon: <FaUser />,
        },
        {
          key: "user-roles",
          label: "User Roles",
          to: "/user-roles",
          icon: <FaUserPlus />,
        },
        {
          key: "permissions",
          label: "Permissions",
          to: "/user-role-permissions",
          icon: <FaKey />,
        },
      ],
    },
    {
      key: "Purchase-Order",
      label: "Purchase Orders",
      icon: <FaFileInvoiceDollar />,
      children: [
        {
          key: "purchase-order-list",
          label: "Orders List",
          to: "/purchase-orders",
          icon: <FaClipboardList />,
        },
        {
          key: "purchase-order-items",
          label: "Orders Items",
          to: "/poinventory",
          icon: <FaBoxes />,
        },
      ],
    },
    {
      key: "expense",
      label: "Expense",
      icon: <FaMoneyBillWave />,
      children: [
        {
          key: "expense-list",
          label: "Expense List",
          to: "/expenses",
          icon: <FaFileInvoiceDollar />,
        },
        {
          key: "expense-items",
          label: "Expense Items",
          to: "/expenses/items",
          icon: <FaClipboardList />,
        },
      ],
    },
    {
      key: "reports",
      label: "Reports & Analytics",
      icon: <FaChartLine />,
      children: [
        {
          key: "sales-report",
          label: "Sales Report",
          to: "/reports/sales",
          icon: <FaChartPie />,
        },
        {
          key: "inventory-report",
          label: "Inventory Report",
          to: "/reports/inventory",
          icon: <FaClipboardList />,
        },
        {
          key: "staff-performance",
          label: "Staff Performance",
          to: "/reports/staff",
          icon: <FaUserTie />,
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    dispatch(logout());
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };
  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      const isOpen = openMenuKey === item.key;
      return (
        <div key={item.key} className="w-full">
          <button
            onClick={() => toggleMenu(item.key)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-200
              ${
                isOpen ? "bg-purple-100 text-blue-500" : "hover:bg-purple-50"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
            {!collapsed && (
              <svg
                className={`w-4 h-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </button>
          {!collapsed && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {item.children.map((child) => renderMenuItem(child))}
            </div>
          )}
        </div>
      );
    }

    const isActive = pathname === item.to;

    return (
      <Link
        key={item.key}
        to={item.to || "#"}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
          ${
            isActive
              ? "bg-white text-blue-500 border-l-4 border-blue-500 font-semibold"
              : "text-black hover:bg-purple-50"
          }`}
      >
        <span className="text-lg">{item.icon}</span>
        {!collapsed && (
          <>
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-purple-200 text-white text-xs font-bold px-2 py-0.5 rounded-full text-center">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div className="flex font-roboto">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-[20%] bg-white shadow-lg p-4 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-bold text-blue-500">Restaurant POS</h2>
          )}
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 flex-grow overflow-y-auto">
          {mainMenuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* Footer - Logout */}
        <div className="mt-auto pt-4 border-t">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-500 hover:bg-blue-100 transition"
          >
            <FaPowerOff className="text-lg" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[20%] flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-skyblue bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-blue-600">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuLayout;
