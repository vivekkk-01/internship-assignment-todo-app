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
  allBoards: {},
  allBoardsLoading: false,
  allBoardsError: null,
  boards: {},
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
      const { statusForBoards } = payload;
      state.addTaskLoading = false;
      state.allTasks.push(payload);
      state.tasks.push(payload);
      console.log(statusForBoards, "status");
      if (statusForBoards) {
        state.boards[statusForBoards].push(payload);
        state.allBoards[statusForBoards].push(payload);
      }
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
      const { statusForBoards } = payload;
      if (statusForBoards) {
        const boardTaskIndex = state.boards[statusForBoards].findIndex(
          (task) => task.id.toString() === payload.id.toString()
        );

        state.allBoards[statusForBoards][boardTaskIndex] = payload;
        state.boards[statusForBoards][boardTaskIndex] = payload;
      }
      const taskIndex = state.allTasks.findIndex(
        (task) => task.id.toString() === payload.id.toString()
      );
      state.allTasks[taskIndex] = payload;
      const index = state.tasks.findIndex(
        (task) => task.id.toString() === payload.id.toString()
      );
      if (index >= 0) {
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
      const { statusForBoards, taskId } = payload;
      state.deleteTaskLoading = false;
      state.allTasks = state.allTasks.filter((task) => task.id !== taskId);
      const isTask = state.tasks.find((task) => task.id === taskId);
      if (isTask) {
        state.tasks = state.tasks.filter((task) => task.id !== taskId);
      }
      if (statusForBoards) {
        state.boards[statusForBoards] = state.boards[statusForBoards].filter(
          (task) => task.id !== taskId
        );
        state.allBoards[statusForBoards] = state.allBoards[
          statusForBoards
        ].filter((task) => task.id !== taskId);
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
    setFilter: (state, { payload }) => {
      state.tasks = [...state.allTasks];
      if (payload.filter) {
        state.tasks = state.tasks.filter(
          (task) => task.category === payload.filter
        );
      }
      if (payload.sort) {
        if (payload.sort === "Oldest") {
          state.tasks = state.tasks.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        }
        if (payload.sort === "Newest") {
          state.tasks = state.tasks.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }
      }
      if (!payload.filter && !payload.sort) {
        state.tasks = [...state.allTasks];
      }
    },
    setAllBoardsLoading: (state) => {
      state.allBoardsLoading = true;
      state.allBoardsError = null;
    },
    setAllBoards: (state, { payload }) => {
      state.allBoardsLoading = false;
      state.allBoards = payload;
      state.boards = payload;
      state.allBoardsError = null;
    },
    setAllBoardsError: (state, { payload }) => {
      state.allBoardsLoading = false;
      state.allBoardsError = payload;
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
  setFilter,
  setAllBoards,
  setAllBoardsError,
  setAllBoardsLoading,
} = taskSlice.actions;

export default taskSlice.reducer;
