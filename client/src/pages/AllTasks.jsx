import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterTaskAction, getAllTasksAction } from "../redux/actions/task";
import { ClipLoader } from "react-spinners";
import Task from "../components/Task";
import { IoIosAdd } from "react-icons/io";
import CreateTaskModal from "../modals/CreateTaskModal";
import { RiSoundModuleLine } from "react-icons/ri";
import { BiSort } from "react-icons/bi";
import useClickOutside from "../hooks/useClickOutside";
import categories from "../utils/categories";
import classes from "./allTasks.module.css";
import Cookies from "js-cookie";
import { redirect } from "react-router-dom";

const AllTasks = () => {
  const [addTask, setAddTask] = useState(false);
  const dispatch = useDispatch();
  const { allTasksLoading, tasks, allTasksError } = useSelector(
    (state) => state.task
  );
  const [isFilter, setIsFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const filterRef = useRef();

  const [isSort, setIsSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const sortRef = useRef();

  useClickOutside(filterRef, () => setIsFilter(false));
  useClickOutside(sortRef, () => setIsSort(false));

  useEffect(() => {
    dispatch(getAllTasksAction());
  }, []);

  const handleFilter = (category) => {
    if (category == selectedFilter) {
      setSelectedFilter("");
      dispatch(filterTaskAction({ filter: "", sort: selectedSort }));
    } else {
      setSelectedFilter(category);
      dispatch(filterTaskAction({ filter: category, sort: selectedSort }));
    }
  };

  const handleSort = (sort) => {
    if (sort === selectedSort) {
      setSelectedSort("");
      dispatch(filterTaskAction({ filter: selectedFilter, sort: "" }));
    } else {
      setSelectedSort(sort);
      dispatch(filterTaskAction({ filter: selectedFilter, sort }));
    }
  };

  const showAll = () => {
    setIsFilter(false);
    setIsSort(false);
    setSelectedFilter("");
    setSelectedSort("");
    dispatch(filterTaskAction({ filter: "", sort: "" }));
  };

  if (selectedFilter && tasks.length <= 0) {
    return (
      <>
        {addTask && (
          <CreateTaskModal
            selectedCategory={selectedFilter}
            onClose={() => setAddTask(false)}
          />
        )}
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <h2 className="font-bold text-2xl">{`Create your first Task in ${selectedFilter} Category!`}</h2>
          <p className="font-semibold text-lg text-gray-500">{`You don't have any Task in ${selectedFilter} Category.`}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddTask(true)}
              className="outline-none text-1xl font-semibold flex items-center justify-center gap-1 text-red-600 py-2 px-4 border-2 border-red-600 rounded-3xl"
            >
              <IoIosAdd size={20} />
              Add Task
            </button>
            <button
              onClick={showAll}
              className="outline-none text-1xl font-semibold flex items-center justify-center gap-1 text-red-600 py-2 px-4 border-2 border-red-600 rounded-3xl"
            >
              Show All Tasks
            </button>
          </div>
        </div>
      </>
    );
  }

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
        <div className="w-full h-full bg-red-100 py-4 px-6 relative flex flex-col overflow-x-hidden overflow-y-hidden">
          <div className="m-4 flex items-center gap-3 top-2 right-4  self-end">
            <div
              onClick={() => setIsFilter((prev) => !prev)}
              className={`relative cursor-pointer flex items-center py-2 px-4 border-2 border-gray-400 rounded-xl gap-2`}
            >
              <RiSoundModuleLine className="font-semibold" />
              <span className="font-semibold">Filter</span>
              {isFilter && (
                <div
                  className="bg-white h-44 overflow-y-scroll w-44 shadow-2xl px-2 py-2 z-20 absolute top-12 -left-3 flex flex-col items-start justify-start gap-1"
                  ref={filterRef}
                >
                  {categories.map((category) => {
                    return (
                      <p
                        onClick={handleFilter.bind(null, category)}
                        key={category}
                        className={`flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg ${
                          selectedFilter === category
                            ? "bg-gray-600 text-gray-100 rounded-lg"
                            : ""
                        } cursor-pointer p-1 px-2`}
                      >
                        {category}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              onClick={() => setIsSort((prev) => !prev)}
              className="relative cursor-pointer flex items-center py-2 px-4 border-2 border-gray-400 rounded-xl gap-2"
            >
              <BiSort className="font-semibold" />
              <span className="font-semibold">Sort</span>
              {isSort && (
                <div
                  className="bg-white  w-28 shadow-2xl px-2 py-2 z-20 absolute top-12 right-0 flex flex-col items-start justify-start gap-1"
                  ref={sortRef}
                >
                  {["Newest", "Oldest"].map((sort) => {
                    return (
                      <p
                        key={sort}
                        onClick={handleSort.bind(null, sort)}
                        className={`flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg ${
                          selectedSort === sort
                            ? "bg-gray-600 text-gray-100 rounded-lg"
                            : ""
                        } cursor-pointer p-1 px-2`}
                      >
                        {sort}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="h-full w-full overflow-y-scroll grid grid-cols-4 gap-4">
            {tasks.map((task) => {
              return (
                <div
                  key={task.id}
                  className={`${classes.task} rounded-3xl flex flex-col gap-4 relative`}
                >
                  <Task
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
        </div>
      )}
    </div>
  );
};

export default AllTasks;

export const loader = () => {
  const user = Cookies.get("todo-user");
  if (!user) {
    return redirect("/login");
  }
  return null;
};
