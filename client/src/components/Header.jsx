import React, { useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiLayout } from "react-icons/fi";
import { TbLayoutBoardSplit } from "react-icons/tb";
import useClickOutside from "../hooks/useClickOutside";
import { Link, NavLink } from "react-router-dom";
import CreateTaskModal from "../modals/CreateTaskModal";

const Header = ({ user }) => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const profileRef = useRef();
  useClickOutside(profileRef, () => setIsProfileClicked(false));
  return (
    <>
      {addTask && <CreateTaskModal onClose={() => setAddTask(false)} />}
      <div className="flex flex-col gap-8">
        <div className="w-full flex items-center justify-between">
          <div
            className="flex flex-col items-center justify-center relative"
            ref={profileRef}
          >
            <img
              onClick={() => setIsProfileClicked(!isProfileClicked)}
              src={user?.picture}
              alt=""
              className="h-10 w-10 object-cover rounded-full cursor-pointer"
            />
            {isProfileClicked && (
              <div className="bg-white w-44 shadow-lg px-2 py-2 z-20 absolute top-12 -left-3 flex flex-col items-start justify-start gap-1">
                <p className="flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg cursor-pointer p-1 px-2">
                  <CgProfile /> Change Profile
                </p>
                <p className="flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg cursor-pointer p-1 px-2">
                  <CiLogout /> Logout
                </p>
                <p className="flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg cursor-pointer p-1 px-2">
                  <MdDelete /> Delete Account
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-semibold">My Task</h1>
            <p className="text-1xl text-gray-500 font-semibold">
              You can organize, track, and complete your assignments
              efficiently.
            </p>
          </div>
          <button
            onClick={() => setAddTask(true)}
            className="outline-none text-1xl font-semibold flex items-center justify-center gap-1 text-red-600 py-2 px-4 border border-2 border-red-600 rounded-3xl"
          >
            <IoIosAdd size={20} />
            Add Task
          </button>
        </div>
        <div className="flex items-center gap-5">
          <NavLink
            to="/all"
            className={`flex items-center justify-center gap-1 text-gray-600 font-semibold`}
          >
            <TbLayoutBoardSplit /> All Tasks
          </NavLink>
          <NavLink
            to="/boards"
            className={`flex items-center justify-center gap-1 text-gray-600 font-semibold`}
          >
            <FiLayout />
            Boards
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Header;
