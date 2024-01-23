import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasksAction } from "../redux/actions/task";

const AllTasks = () => {
  const dispatch = useDispatch();
  const { allTasksLoading, tasks, allTasksError } = useSelector(
    (state) => state.task
  );
  useEffect(() => {
    dispatch(getAllTasksAction());
  }, []);
  return <div></div>;
};

export default AllTasks;
