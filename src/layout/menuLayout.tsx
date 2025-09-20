import React, { useState, useMemo } from "react";
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
  FaUtensils,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { logout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import TopNavigationBar from "../components/TopNavigationBar";

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  to?: string;
  children?: MenuItem[];
  badge?: string;
}

interface ApiMenuData {
  menuId: number;
  menuName: string;
  menuPath: string;
  menuIcon: string;
  menuSequence: number;
  subMenuId: number;
  subMenuName: string;
  subMenuPath: string;
  subMenuIcon: string;
  subMenuSequence: number;
}

// Icon mapping function
const getIconComponent = (iconName: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    FaTachometerAlt: <FaTachometerAlt />,
    FaUtensils: <FaUtensils />,
    FaChartBar: <FaChartBar />,
    FaShoppingCart: <FaShoppingCart />,
    FaBox: <FaBox />,
    FaBoxes: <FaBoxes />,
    FaTags: <FaTags />,
    FaBuilding: <FaBuilding />,
    FaLayerGroup: <FaLayerGroup />,
    FaTable: <FaTable />,
    FaUserShield: <FaUserShield />,
    FaUser: <FaUser />,
    FaUserPlus: <FaUserPlus />,
    FaKey: <FaKey />,
    FaFileInvoiceDollar: <FaFileInvoiceDollar />,
    FaClipboardList: <FaClipboardList />,
    FaMoneyBillWave: <FaMoneyBillWave />,
    FaChartLine: <FaChartLine />,
    FaChartPie: <FaChartPie />,
    FaUserTie: <FaUserTie />,
  };
  return iconMap[iconName] || <FaBox />;
};

// Function to transform API data to menu structure
const transformApiDataToMenu = (apiData: ApiMenuData[]): MenuItem[] => {
  const menuMap = new Map<number, MenuItem>();

  apiData.forEach((item) => {
    // Create or get main menu item
    if (!menuMap.has(item.menuId)) {
      menuMap.set(item.menuId, {
        key: `menu-${item.menuId}`,
        label: item.menuName,
        icon: getIconComponent(item.menuIcon),
        to: item.menuPath !== "/" ? item.menuPath : undefined,
        children: [],
      });
    }

    const mainMenu = menuMap.get(item.menuId)!;

    // Add submenu if it doesn't exist
    if (item.subMenuId && item.subMenuName) {
      const subMenuExists = mainMenu.children?.some(
        (child) => child.key === `submenu-${item.subMenuId}`
      );

      if (!subMenuExists) {
        mainMenu.children!.push({
          key: `submenu-${item.subMenuId}`,
          label: item.subMenuName,
          icon: getIconComponent(item.subMenuIcon),
          to: item.subMenuPath,
        });
      }
    }
  });

  // Convert map to array and sort by sequence
  return Array.from(menuMap.values()).sort((a, b) => {
    const aSeq = apiData.find(item => item.menuName === a.label)?.menuSequence || 0;
    const bSeq = apiData.find(item => item.menuName === b.label)?.menuSequence || 0;
    return aSeq - bSeq;
  });
};

const MenuLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMenu = (key: string) => {
    setOpenMenuKey((prev) => (prev === key ? null : key));
  };

  
  const userRolePermissions = useSelector((state: any) => state.auth.userRolePermissions);

  // Transform API data to menu items
  const mainMenuItems = useMemo(() => {
    if (userRolePermissions && userRolePermissions.length > 0) {
      const transformedMenu = transformApiDataToMenu(userRolePermissions);
      return transformedMenu;
    }
    return [];
  }, [userRolePermissions]);

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
              <span>{item.label}</span>
            </div>
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
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
          >
            {item.children.map((child) => renderMenuItem(child))}
          </div>
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
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto bg-purple-200 text-white text-xs font-bold px-2 py-0.5 rounded-full text-center">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex font-roboto min-h-screen">
      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 h-screen w-[20%] bg-white shadow-lg p-4 flex flex-col z-30"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-500">Restaurant POS</h2>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 flex-grow overflow-y-auto">
          {mainMenuItems.length > 0 ? (
            mainMenuItems.map((item) => renderMenuItem(item))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No menu items available</p>
              <p className="text-sm mt-1">Please check your permissions</p>
            </div>
          )}
        </nav>

        {/* Footer - Logout */}
        {/* <div className="mt-auto pt-4 border-t">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-500 hover:bg-blue-100 transition"
          >
            <FaPowerOff className="text-lg" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div> */}
      </div>

      {/* Main Content Area */}
      <div className="ml-[20%] flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <TopNavigationBar onLogout={() => setShowLogoutModal(true)} />
        
        {/* Page Content */}
        <div className="flex-1 p-6 bg-gray-50">
          {children}
        </div>
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
