import Cookies from "js-cookie";
import {
  resetAddTask,
  setAddTask,
  setAddTaskError,
  setAddTaskLoading,
  setAllTasks,
  setAllTasksError,
  setAllTasksLoading,
  setEditTask,
  setEditTaskError,
  setEditTaskLoading,
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
      }, 2000);
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

export const getAllTasksAction = () => async (dispatch) => {
  try {
    dispatch(setAllTasksLoading());
    const { token } = JSON.parse(Cookies.get("todo-user"));
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP_API_ENDPOINT}/task/get-all-tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setAllTasks(data));
  } catch (error) {
    const err =
      typeof error?.response?.data === "string"
        ? error?.response?.data
        : "Something went wrong, please try again!";
    dispatch(setAllTasksError(err));
  }
};

export const setEditTaskAction =
  ({ taskId, values, onClose, onSuccess, onError }) =>
  async (dispatch) => {
    dispatch(setEditTaskLoading());
    const { token } = JSON.parse(Cookies.get("todo-user"));
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/task/edit-task/${taskId}`,
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
        dispatch(setEditTask(data));
      }, 2000);
    } catch (error) {
      const err =
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : "Something went wrong, please try again!";
      dispatch(setEditTaskError(err));
      onError();
    }
  };
