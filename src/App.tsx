// src/App.tsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setCredentials, logout } from "./store/authSlice";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login/Login";

import RequireAuth from "./routes/RequireAuth";
import PublicOnly from "./routes/PublicOnly";
import MenuLayout from "./layout/menuLayout";
import UserRoles from "./pages/UserRoles/UserRoles";
import UserRolePermissions from "./pages/UserRolePermissions/UserRolePermissions";
import Users from "./pages/Users/Users";
import "./App.css";
import Orders from "./pages/Orders/Orders";
import Block from "./pages/Blocks/Block";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tables from "./pages/Tables/Tables";
import Category from "./pages/Category/Category";
import Items from "./pages/Items/Items";
import ExpenseItems from "./pages/ExpenseItems/ExpenseItems";
import Expenses from "./pages/Expenses/Expenses";
import PoInventory from "./pages/POInventory/PoInventory";
import Dining from "./pages/Dining/Dining";
import Register from "./pages/Register/Register";
import RestaurantRegister from "./pages/RestaurantRegister/RestaurantRegister";
import Subscription from "./pages/Subscription/Subscription";
import PaymentSuccess from "./pages/Subscription/PaymentSuccess";

// Inventory Management
import StockManagement from "./pages/Inventory/StockManagement";
import StockAdjustments from "./pages/Inventory/StockAdjustments";
import LowStockAlerts from "./pages/Inventory/LowStockAlerts";

// Customer Management
import CustomerList from "./pages/Customers/CustomerList";

// Sales & Transactions
import SalesHistory from "./pages/Sales/SalesHistory";

// Kitchen Operations
import KitchenDisplay from "./pages/Kitchen/KitchenDisplay";

// Financial Management
import DailySalesSummary from "./pages/Finance/DailySalesSummary";

// Reports
import {
  DailySalesReport,
  MonthlySalesReport,
  SalesByCategoryReport,
  TopSellingItemsReport,
  RevenueAnalysisReport,
  ProfitLossReport,
  PaymentMethodsReport,
  TablePerformanceReport,
  StaffPerformanceReport,
  CustomerAnalyticsReport
} from "./pages/Reports";

// Settings & Configuration
import RestaurantSettings from "./pages/Settings/RestaurantSettings";

function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((s: any) => s.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (!storedToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const payload = jwtDecode<{ user: any; exp?: number; userRolePermissions: any }>(storedToken);

        // Check expiry
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          dispatch(logout());
          setIsInitializing(false);
          return;
        }

        // Update Redux only if user not already set
        if (!user) {
          dispatch(
            setCredentials({
              token: storedToken,
              user: {
                ...payload.user,
                // optional: overwrite or map fields
                id: payload.user.id,
                email: payload.user.email,
                firstName: payload.user.firstName,
                lastName: payload.user.lastName,
                mobileNumber: payload.user.mobileNumber,
                speciality: payload.user.speciality,
                isRegistered: payload.user.isRegistered,
                restuarent: payload.user.restuarent,
              },
              userRolePermissions: payload.userRolePermissions,
            })
          );
        }
      } catch (e) {
        console.error("Invalid token in localStorage:", e);
        dispatch(logout());
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch, user]);

  // Show loading spinner while initializing auth
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/subscription" element={<Subscription />} />
          <Route
            path="/"
            element={
              <MenuLayout>
                <Dining />
              </MenuLayout>
            }
          />
          <Route path="/restaurantregister" element={<RestaurantRegister />} />
          <Route
            path="/dashboard"
            element={
              <MenuLayout>
                <Dashboard />
              </MenuLayout>
            }
          />

          <Route
            path="/user-roles"
            element={
              <MenuLayout>
                <UserRoles />
              </MenuLayout>
            }
          />
          <Route
            path="/user-role-permissions"
            element={
              <MenuLayout>
                <UserRolePermissions />
              </MenuLayout>
            }
          />
          <Route
            path="/users"
            element={
              <MenuLayout>
                <Users />
              </MenuLayout>
            }
          />
          <Route
            path="/block-floor"
            element={
              <MenuLayout>
                <Block />
              </MenuLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <MenuLayout>
                <Orders />
              </MenuLayout>
            }
          />
          <Route
            path="/tables"
            element={
              <MenuLayout>
                <Tables />
              </MenuLayout>
            }
          />
          <Route
            path="/category"
            element={
              <MenuLayout>
                <Category />
              </MenuLayout>
            }
          />
          <Route
            path="/items"
            element={
              <MenuLayout>
                <Items />
              </MenuLayout>
            }
          />
          <Route
            path="/expenses/items"
            element={
              <MenuLayout>
                <ExpenseItems />
              </MenuLayout>
            }
          />
          <Route
            path="/expenses"
            element={
              <MenuLayout>
                <Expenses />
              </MenuLayout>
            }
          />
          <Route
            path="/poinventory"
            element={
              <MenuLayout>
                <PoInventory />
              </MenuLayout>
            }
          />

          {/* Inventory Management Routes */}
          <Route
            path="/inventory/stock"
            element={
              <MenuLayout>
                <StockManagement />
              </MenuLayout>
            }
          />
          <Route
            path="/inventory/adjustments"
            element={
              <MenuLayout>
                <StockAdjustments />
              </MenuLayout>
            }
          />
          <Route
            path="/inventory/alerts"
            element={
              <MenuLayout>
                <LowStockAlerts />
              </MenuLayout>
            }
          />

          {/* Customer Management Routes */}
          <Route
            path="/customers"
            element={
              <MenuLayout>
                <CustomerList />
              </MenuLayout>
            }
          />

          {/* Sales & Transactions Routes */}
          <Route
            path="/sales/history"
            element={
              <MenuLayout>
                <SalesHistory />
              </MenuLayout>
            }
          />

          {/* Kitchen Operations Routes */}
          <Route
            path="/kitchen/display"
            element={
              <MenuLayout>
                <KitchenDisplay />
              </MenuLayout>
            }
          />

          {/* Financial Management Routes */}
          <Route
            path="/finance/daily"
            element={
              <MenuLayout>
                <DailySalesSummary />
              </MenuLayout>
            }
          />

          {/* Reports Routes */}
          <Route
            path="/reports/daily-sales"
            element={
              <MenuLayout>
                <DailySalesReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/monthly-sales"
            element={
              <MenuLayout>
                <MonthlySalesReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/sales-category"
            element={
              <MenuLayout>
                <SalesByCategoryReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/top-items"
            element={
              <MenuLayout>
                <TopSellingItemsReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/revenue"
            element={
              <MenuLayout>
                <RevenueAnalysisReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/profit-loss"
            element={
              <MenuLayout>
                <ProfitLossReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/payment-methods"
            element={
              <MenuLayout>
                <PaymentMethodsReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/table-performance"
            element={
              <MenuLayout>
                <TablePerformanceReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/staff-performance"
            element={
              <MenuLayout>
                <StaffPerformanceReport />
              </MenuLayout>
            }
          />
          <Route
            path="/reports/customer-analytics"
            element={
              <MenuLayout>
                <CustomerAnalyticsReport />
              </MenuLayout>
            }
          />

          {/* Settings & Configuration Routes */}
          <Route
            path="/settings/restaurant"
            element={
              <MenuLayout>
                <RestaurantSettings />
              </MenuLayout>
            }
          />

          {/* Missing Routes - Add these new routes */}
          <Route
            path="/dining-orders"
            element={
              <MenuLayout>
                <Dining />
              </MenuLayout>
            }
          />
          <Route
            path="/sales/refunds"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Refunds & Returns</h1>
                  <p>Refunds and returns management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/sales/voids"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Void Transactions</h1>
                  <p>Void transactions management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/payments/methods"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>
                  <p>Payment methods management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/cash/management"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Cash Management</h1>
                  <p>Cash management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/inventory/transfers"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Stock Transfers</h1>
                  <p>Stock transfers management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Purchase Orders</h1>
                  <p>Purchase orders management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/suppliers"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Supplier Management</h1>
                  <p>Supplier management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/customers/groups"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Customer Groups</h1>
                  <p>Customer groups management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/loyalty"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Loyalty Program</h1>
                  <p>Loyalty program management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/customers/history"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Customer History</h1>
                  <p>Customer history page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/kitchen/status"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Order Status</h1>
                  <p>Kitchen order status page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/kitchen/timing"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Preparation Time</h1>
                  <p>Kitchen preparation time management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/kitchen/staff"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Kitchen Staff</h1>
                  <p>Kitchen staff management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/finance/register"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Cash Register</h1>
                  <p>Cash register management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/finance/tax"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Tax Management</h1>
                  <p>Tax management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/finance/pnl"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Profit & Loss</h1>
                  <p>Profit & Loss management page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/reports/inventory"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Inventory Report</h1>
                  <p>Inventory report page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/reports/kitchen"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Kitchen Report</h1>
                  <p>Kitchen report page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/settings/pos"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">POS Configuration</h1>
                  <p>POS configuration page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/settings/tax"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Tax Settings</h1>
                  <p>Tax settings page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/settings/printers"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Printer Settings</h1>
                  <p>Printer settings page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
          <Route
            path="/settings/backup"
            element={
              <MenuLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Backup & Restore</h1>
                  <p>Backup & restore page - to be implemented</p>
                </div>
              </MenuLayout>
            }
          />
        </Route>
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="!rounded-xl !shadow-lg !text-sm !px-4 !py-3 !bg-blue-500 !text-white"
      />
    </BrowserRouter>
  );
}

export default App;
