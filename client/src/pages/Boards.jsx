import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBoardsAction } from "../redux/actions/task";
import { ClipLoader } from "react-spinners";
import Board from "../components/Board";
import { IoIosAdd } from "react-icons/io";
import CreateTaskModal from "../modals/CreateTaskModal";
import Cookies from "js-cookie";
import { redirect } from "react-router-dom";

const Boards = () => {
  const [addTask, setAddTask] = useState(false);
  const { boards, allBoardsLoading, allBoardsError } = useSelector(
    (state) => state.task
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBoardsAction());
  }, []);

  if (
    boards?.onGoing?.length <= 0 &&
    boards?.inComplete?.length <= 0 &&
    boards?.completed?.length <= 0
  ) {
    return (
      <>
        {addTask && (
          <CreateTaskModal board={true} onClose={() => setAddTask(false)} />
        )}
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <h2 className="font-bold text-2xl">Create your first Task!</h2>
          <button
            onClick={() => setAddTask(true)}
            className="outline-none text-1xl font-semibold flex items-center justify-center gap-1 text-red-600 py-2 px-4 border-2 border-red-600 rounded-3xl"
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
      {allBoardsLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <ClipLoader color="red" size={80} />
        </div>
      ) : allBoardsError ? (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-red-700 font-bold text-3xl">{allBoardsError}</h1>
        </div>
      ) : (
        (boards?.onGoing?.length > 0 ||
          boards?.inComplete?.length > 0 ||
          boards?.completed?.length > 0) && (
          <div className="h-full w-screen overflow-y-scroll grid grid-cols-3 items-start bg-red-100 p-2 tab:grid-cols-2 mobile:flex mobile:flex-col mobile:gap-4">
            <Board status={"In Complete"} tasks={boards.inComplete} />
            <Board status={"On Going"} tasks={boards.onGoing} />
            <Board status={"Completed"} tasks={boards.completed} />
          </div>
        )
      )}
    </div>
  );
};

export default Boards;

export const loader = () => {
  const user = Cookies.get("todo-user");
  if (!user) {
    return redirect("/login");
  }
  return null;
};
