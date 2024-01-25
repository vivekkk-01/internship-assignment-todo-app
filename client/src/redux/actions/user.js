import axios from "axios";
import {
  setDeleteAccount,
  setDeleteAccountError,
  setDeleteAccountLoading,
  setUpdateProfileError,
  setUpdateProfileLoading,
  setUserInfo,
  updateProfile,
} from "../slices/user";
import Cookies from "js-cookie";

export const setUserInfoAction = (userInfo) => (dispatch) => {
  dispatch(setUserInfo(userInfo));
};

export const updateProfileAction =
  ({ values, onSuccess, onError }) =>
  async (dispatch) => {
    try {
      dispatch(setUpdateProfileLoading());
      const { token } = JSON.parse(Cookies.get("todo-user"));
      const { data } = await axios.patch(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/user/update-profile`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccess();
      dispatch(updateProfile(data));
    } catch (error) {
      const err =
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : "Something went wrong, please try again!";
      dispatch(setUpdateProfileError(err));
      onError();
    }
  };

export const deleteAccountAction =
  ({ onSuccess, onClose, onError }) =>
  async (dispatch) => {
    dispatch(setDeleteAccountLoading());
    const { id, token } = Cookies.get("todo-user");
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/user/delete-account/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccess();
      setTimeout(() => {
        dispatch(setDeleteAccount());
        onClose();
      }, 2000);
    } catch (error) {
      const err =
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : "Something went wrong, please try again!";
      dispatch(setDeleteAccountError(err));
      onError();
    }
  };
