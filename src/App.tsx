// src/App.tsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setCredentials, logout } from "./store/authSlice";

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

type JwtPayload = {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  speciality: string;
  exp?: number;
};

function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((s: any) => s.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const payload = jwtDecode<JwtPayload>(storedToken);
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        dispatch(logout());
        return;
      }

      if (!user) {
        dispatch(
          setCredentials({
            token: storedToken,
            user: {
              id: payload.id,
              email: payload.email,
              firstName: payload.firstName,
              lastName: payload.lastName,
              mobileNumber: payload.mobileNumber,
              speciality: payload.speciality,
            },
          })
        );
      }
    } catch (e) {
      console.error("Invalid token in localStorage:", e);
      dispatch(logout());
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route
            path="/"
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
        </Route>
        <Route
          path="*"
          element={<Navigate to={token ? "/expenses/items" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
