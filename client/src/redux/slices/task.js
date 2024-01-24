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
    setEditTaskLoading: (state) => {
      state.updateTaskError = null;
      state.updateTaskLoading = true;
    },
    setEditTask: (state, { payload }) => {
      state.updateTaskLoading = false;
      state.updateTaskError = null;

      const taskIndex = state.allTasks.findIndex(
        (task) => task.id.toString() === payload.id.toString()
      );
      state.allTasks[taskIndex] = payload;
      const index = state.tasks.findIndex(
        (task) => task.id.toString() === payload.id.toString()
      );
      if (index) {
        state.tasks[index] = payload;
      }
    },
    setEditTaskError: (state, { payload }) => {
      state.updateTaskLoading = false;
      state.updateTaskError = payload;
    },
    resetEditTask: (state) => {
      state.updateTaskError = null;
      state.updateTaskLoading = false;
    },
    setDeleteTaskLoading: (state) => {
      state.deleteTaskLoading = true;
      state.deleteTaskError = null;
    },
    setDeleteTask: (state, { payload }) => {
      state.deleteTaskLoading = false;
      state.allTasks = state.allTasks.filter((task) => task.id !== payload);
      const isTask = state.tasks.find((task) => task.id === payload);
      if (isTask) {
        state.tasks = state.tasks.filter((task) => task.id !== payload);
      }
      state.deleteTaskError = null;
    },
    setDeleteTaskError: (state, { payload }) => {
      state.deleteTaskLoading = false;
      state.deleteTaskError = payload;
    },
    resetDeleteTask: (state) => {
      state.deleteTaskLoading = false;
      state.deleteTaskError = null;
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
  setEditTask,
  setEditTaskError,
  setEditTaskLoading,
  resetEditTask,
  setDeleteTask,
  setDeleteTaskError,
  setDeleteTaskLoading,
  resetDeleteTask,
} = taskSlice.actions;

export default taskSlice.reducer;
