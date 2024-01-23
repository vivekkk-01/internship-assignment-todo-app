import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  userInfo: Cookies.get("todo-user")
    ? JSON.parse(Cookies.get("todo-user"))
    : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
  },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
