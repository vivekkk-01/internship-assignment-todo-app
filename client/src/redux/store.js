import { configureStore, combineReducers } from "@reduxjs/toolkit";

import user from "./slices/user";
import task from "./slices/task";

const reducer = combineReducers({
  user,
  task,
});

export default configureStore({
  reducer,
});
