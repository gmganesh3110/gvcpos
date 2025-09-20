import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  speciality: string;
  isRegistered: boolean;
  restuarent:number;
};

type UserRolePermission = {
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
};

interface AuthState {
  user: User | null;
  token: string | null;
  userRolePermissions: UserRolePermission[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  userRolePermissions: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User; userRolePermissions: UserRolePermission[] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userRolePermissions = action.payload.userRolePermissions;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.userRolePermissions = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRolePermissions");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
