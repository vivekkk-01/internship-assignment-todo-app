import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasksAction } from "../redux/actions/task";
import { ClipLoader } from "react-spinners";
import Task from "../components/Task";

const AllTasks = () => {
  const dispatch = useDispatch();
  const { allTasksLoading, tasks, allTasksError } = useSelector(
    (state) => state.task
  );

  useEffect(() => {
    dispatch(getAllTasksAction());
  }, []);

  return (
    <div className="w-full h-full p-6">
      {allTasksLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <ClipLoader color="red" size={80} />
        </div>
      ) : allTasksError ? (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-red-700 font-bold text-3xl">{allTasksError}</h1>
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-4 gap-10">
          {tasks.map((task) => {
            return (
              <div>
                <Task
                  key={task.id}
                  id={task.id}
                  status={task.status}
                  title={task.title}
                  description={task.description}
                  category={task.category}
                  image={task?.image}
                  startDate={task.startDate}
                  endDate={task.endDate}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllTasks;
