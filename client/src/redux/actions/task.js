import Cookies from "js-cookie";
import {
  resetAddTask,
  setAddTask,
  setAddTaskError,
  setAddTaskLoading,
} from "../slices/task";
import axios from "axios";

export const addTaskAction =
  ({ values, onClose, onSuccess, onError }) =>
  async (dispatch) => {
    dispatch(setAddTaskLoading());
    const { token } = JSON.parse(Cookies.get("todo-user"));
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/task/add-task`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccess();
      setTimeout(() => {
        onClose();
        dispatch(setAddTask(data));
      }, 3000);
    } catch (error) {
      const err =
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : "Something went wrong, please try again!";
      dispatch(setAddTaskError(err));
      onError();
    }
  };

export const resetAddTaskAction = () => (dispatch) => {
  dispatch(resetAddTask());
};
