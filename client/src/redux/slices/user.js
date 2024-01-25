import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  userInfo: Cookies.get("todo-user")
    ? JSON.parse(Cookies.get("todo-user"))
    : null,
  updateProfileLoading: false,
  updateProfileError: null,
  deleteAccountLoading: false,
  deleteAccountError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
    setUpdateProfileLoading: (state) => {
      state.updateProfileLoading = true;
    },
    updateProfile: (state, { payload }) => {
      state.updateProfileLoading = false;
      state.updateProfileError = null;
      state.userInfo.picture = payload;
      Cookies.remove("todo-user");
      Cookies.set("todo-user", JSON.stringify(state.userInfo), {
        secure: true,
        sameSite: "strict",
        expires: 30,
      });
    },
    setUpdateProfileError: (state, { payload }) => {
      state.updateProfileLoading = false;
      state.updateProfileError = payload;
    },
    setDeleteAccountLoading: (state) => {
      state.deleteAccountError = null;
      state.deleteAccountLoading = true;
    },
    setDeleteAccount: (state) => {
      state.deleteAccountError = null;
      state.deleteAccountLoading = false;
      Cookies.remove("todo-user");
    },
    setDeleteAccountError: (state, { payload }) => {
      state.deleteAccountError = payload;
      state.deleteAccountLoading = false;
    },
    resetDeleteAccount: (state) => {
      state.deleteAccountError = null;
      state.deleteAccountLoading = false;
    },
  },
});

export const {
  setUserInfo,
  updateProfile,
  setUpdateProfileError,
  setUpdateProfileLoading,
  setDeleteAccount,
  setDeleteAccountError,
  setDeleteAccountLoading,
  resetDeleteAccount,
} = userSlice.actions;

export default userSlice.reducer;
