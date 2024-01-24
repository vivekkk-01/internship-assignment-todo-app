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
