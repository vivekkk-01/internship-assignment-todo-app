import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBoardsAction } from "../redux/actions/task";
import { ClipLoader } from "react-spinners";
import { RiSoundModuleLine } from "react-icons/ri";
import categories from "../utils/categories";
import { BiSort } from "react-icons/bi";
import Board from "../components/Board";

const Boards = () => {
  const { boards, allBoardsLoading, allBoardsError } = useSelector(
    (state) => state.task
  );
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const filterRef = useRef();
  const sortRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBoardsAction());
  }, []);

  const handleSort = () => {};

  const handleFilter = () => {};

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
        <div className="w-full h-full bg-red-100 py-4 px-6 overflow-x-hidden overflow-y-hidden">
          <div className="h-full w-screen overflow-y-scroll grid grid-cols-3 gap-3">
            <Board status={"In Complete"} tasks={boards.inComplete} />
            <Board status={"On Going"} tasks={boards.onGoing} />
            <Board status={"Completed"} tasks={boards.completed} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Boards;
