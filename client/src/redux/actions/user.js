import { setUserInfo } from "../slices/user";

export const setUserInfoAction = (userInfo) => (dispatch) => {
  dispatch(setUserInfo(userInfo));
};
