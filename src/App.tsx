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
        const payload = jwtDecode<{ user: any; exp?: number }>(storedToken);

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
