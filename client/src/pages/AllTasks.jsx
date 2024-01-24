import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasksAction } from "../redux/actions/task";
import { ClipLoader } from "react-spinners";
import Task from "../components/Task";
import { IoIosAdd } from "react-icons/io";
import CreateTaskModal from "../modals/CreateTaskModal";

const AllTasks = () => {
  const [addTask, setAddTask] = useState(false);
  const dispatch = useDispatch();
  const { allTasksLoading, tasks, allTasksError } = useSelector(
    (state) => state.task
  );

  useEffect(() => {
    dispatch(getAllTasksAction());
  }, []);

  if (tasks.length <= 0) {
    return (
      <>
        {addTask && <CreateTaskModal onClose={() => setAddTask(false)} />}
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <h2 className="font-bold text-2xl">Create your first Task!</h2>
          <button
            onClick={() => setAddTask(true)}
            className="outline-none text-1xl font-semibold flex items-center justify-center gap-1 text-red-600 py-2 px-4 border border-2 border-red-600 rounded-3xl"
          >
            <IoIosAdd size={20} />
            Add Task
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="w-full h-full">
      {allTasksLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <ClipLoader color="red" size={80} />
        </div>
      ) : allTasksError ? (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-red-700 font-bold text-3xl">{allTasksError}</h1>
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-4 gap-4 bg-red-100 py-4 px-6 overflow-y-scroll">
          {tasks.map((task) => {
            return (
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllTasks;
