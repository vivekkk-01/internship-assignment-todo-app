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
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setAddTaskLoading: (state) => {
      state.addTaskError = null;
      state.addTaskLoading = true;
    },
    setAddTask: (state, { payload }) => {
      state.addTaskLoading = false;
      state.allTasks.push(payload);
      state.tasks.push(payload);
      state.addTaskError = null;
    },
    setAddTaskError: (state, { payload }) => {
      state.addTaskLoading = false;
      state.addTaskError = payload;
    },
    resetAddTask: (state) => {
      state.addTaskLoading = false;
      state.addTaskError = null;
    },
    setAllTasksLoading: (state) => {
      state.allTasksLoading = true;
    },
    setAllTasks: (state, { payload }) => {
      state.allTasksLoading = false;
      state.allTasks = payload;
      state.allTasksError = null;
      state.tasks = payload;
    },
    setAllTasksError: (state, { payload }) => {
      state.allTasksLoading = false;
      state.allTasksError = payload;
    },
  },
});

export const {
  setAddTask,
  setAddTaskError,
  setAddTaskLoading,
  resetAddTask,
  setAllTasks,
  setAllTasksError,
  setAllTasksLoading,
} = taskSlice.actions;

export default taskSlice.reducer;
