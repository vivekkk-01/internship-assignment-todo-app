import Cookies from "js-cookie";
import {
  resetAddTask,
  setAddTask,
  setAddTaskError,
  setAddTaskLoading,
  setAllBoards,
  setAllBoardsError,
  setAllBoardsLoading,
  setAllTasks,
  setAllTasksError,
  setAllTasksLoading,
  setDeleteTask,
  setDeleteTaskError,
  setDeleteTaskLoading,
  setEditTask,
  setEditTaskError,
  setEditTaskLoading,
  setFilter,
} from "../slices/task";
import axios from "axios";

export const addTaskAction =
  ({ values, onClose, onSuccess, onError, board }) =>
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
      const statusForBoards = board
        ? data.status === "On Going"
          ? "onGoing"
          : data.status === "In Complete"
          ? "inComplete"
          : "completed"
        : null;
      onSuccess();
      setTimeout(() => {
        onClose();
        dispatch(setAddTask({ ...data, statusForBoards }));
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
  ({ taskId, values, onClose, onSuccess, onError, board }) =>
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
      const statusForBoards = board
        ? data.status === "On Going"
          ? "onGoing"
          : data.status === "In Complete"
          ? "inComplete"
          : "completed"
        : null;
      onSuccess();
      setTimeout(() => {
        onClose();
        dispatch(setEditTask({ ...data, statusForBoards }));
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

export const deleteTaskAction =
  ({ taskId, onSuccess, onError, onClose, statusForBoards }) =>
  async (dispatch) => {
    dispatch(setDeleteTaskLoading());
    const { token } = JSON.parse(Cookies.get("todo-user"));
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/task/delete-task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccess();
      setTimeout(() => {
        dispatch(setDeleteTask({ taskId, statusForBoards }));
        onClose();
      }, 2000);
    } catch (error) {
      const err =
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : "Something went wrong, please try again!";
      dispatch(setDeleteTaskError(err));
      onError();
    }
  };

export const filterTaskAction =
  ({ filter, sort }) =>
  (dispatch) => {
    dispatch(setFilter({ filter, sort }));
  };

export const getAllBoardsAction = () => async (dispatch) => {
  try {
    dispatch(setAllBoardsLoading());
    const { token } = JSON.parse(Cookies.get("todo-user"));
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP_API_ENDPOINT}/task/get-boards`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setAllBoards(data));
  } catch (error) {
    const err =
      typeof error?.response?.data === "string"
        ? error?.response?.data
        : "Something went wrong, please try again!";
    dispatch(setAllBoardsError(err));
  }
};
