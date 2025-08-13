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
  FaClipboardCheck,
  FaThList,
  FaUserShield,
  FaKey,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaClipboardList,
  FaUserTie,
  FaCalendarCheck,
  FaMoneyCheckAlt,
  FaUserFriends,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";

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

  const [collapsed, setCollapsed] = useState(false);
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  const toggleMenu = (key: string) => {
    setOpenMenuKey((prev) => (prev === key ? null : key));
  };

  const mainMenuItems: MenuItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
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
        {
          key: "reservations",
          label: "Reservations",
          icon: <FaCalendarCheck />,
          to: "/reservations",
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
      key: "staff",
      label: "Staff",
      icon: <FaUserFriends />,
      children: [
        {
          key: "staff-list",
          label: "Staff List",
          to: "/staff",
          icon: <FaUser />,
        },
        {
          key: "salary",
          label: "Salary",
          to: "/staff/salary",
          icon: <FaMoneyCheckAlt />,
        },
      ],
    },
    {
      key: "Purchase-Order",
      label: "Purchase Orders",
      icon: <FaFileInvoiceDollar />,
      to: "/purchase-orders",
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
  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      const isOpen = openMenuKey === item.key;
      return (
        <div key={item.key} className="w-full">
          <button
            onClick={() => toggleMenu(item.key)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors duration-200
              ${
                isOpen ? "bg-purple-100 text-[#F97316]" : "hover:bg-purple-50"
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
              ? "bg-white text-[rgb(235,128,62)] border-l-4 border-[#F97316]"
              : "hover:bg-purple-50"
          }`}
      >
        <span className="text-lg">{item.icon}</span>
        {!collapsed && (
          <>
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-purple-200 text-[#F97316] text-xs font-bold px-2 py-0.5 rounded-full text-center">
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
        className={`bg-[#f5e8dd] shadow-lg h-screen p-4 flex flex-col transition-all duration-300 ease-in-out
          w-[20%]`}
      >
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-bold text-[#F97316]">Restaurant POS</h2>
          )}
          {/* <button
            onClick={toggleCollapsed}
            className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button> */}
        </div>

        <nav className="flex flex-col gap-1 flex-grow">
          {mainMenuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 min-h-screen w-[80%]">
        {children}
      </div>
    </div>
  );
};

export default MenuLayout;
