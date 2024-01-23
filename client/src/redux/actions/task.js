import Cookies from "js-cookie";
import { setAddTask, setAddTaskError, setAddTaskLoading } from "../slices/task";
import axios from "axios";

export const addTaskAction =
  ({ values, onClose }) =>
  async (dispatch) => {
    dispatch(setAddTaskLoading);
    const { token } = JSON.parse(Cookies.get("todo-user"));
    console.log("Token", token);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/task/add-task`,
        {
          values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setAddTask(data));
      onClose();
    } catch (error) {
      const err =
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : "Something went wrong, please try again!";
      dispatch(setAddTaskError(err));
    }
  };
