import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allTasks: [],
  allTasksLoading: false,
  allTasksError: null,
  addTaskLoading: false,
  addTaskError: null,
  updateTaskLoading: false,
  updateTaskError: null,
  deleteTaskLoading: false,
  deleteTaskError: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setAddTaskLoading: (state) => {
      state.addTaskLoading = true;
    },
    setAddTask: (state, { payload }) => {
      state.addTaskLoading = false;
      state.allTasks.push(payload);
      state.addTaskError = null;
    },
    setAddTaskError: (state, { payload }) => {
      state.addTaskLoading = false;
      state.addTaskError = payload;
    },
  },
});

export const { setAddTask, setAddTaskError, setAddTaskLoading } =
  taskSlice.actions;

export default taskSlice.reducer;
