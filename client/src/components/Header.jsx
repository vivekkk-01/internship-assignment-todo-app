import React, { useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiLayout } from "react-icons/fi";
import { TbLayoutBoardSplit } from "react-icons/tb";
import useClickOutside from "../hooks/useClickOutside";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import classes from "./header.module.css";
import CreateTaskModal from "../modals/CreateTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileAction } from "../redux/actions/user";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const Header = ({ user }) => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const profileRef = useRef();
  const fileRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateProfileLoading, updateProfileError } = useSelector(
    (state) => state.user
  );
  useClickOutside(profileRef, () => setIsProfileClicked(false));

  const changeProfileHandler = () => {
    fileRef.current.click();
  };

  const onProfileChangeSuccess = () =>
    toast.success(
      "You successfully changed your Profile Picture!",
      toastOptions
    );

  const onProfileChangeError = () => {
    toast.error(
      updateProfileError || "Something went wrong, please try again!",
      toastOptions
    );
    setProfilePicture("");
  };

  const changeImageHandler = (event) => {
    setProfilePicture(event.target.files[0]);
    const values = new FormData();
    values.append("image", event.target.files[0]);
    dispatch(
      updateProfileAction({
        values,
        onSuccess: onProfileChangeSuccess,
        onError: onProfileChangeError,
      })
    );
    setIsProfileClicked(false);
  };

  const logoutHandler = () => {
    Cookies.remove("todo-user");
    return navigate("/login");
  };

  return (
    <>
      {addTask && (
        <CreateTaskModal
          board={location.pathname === "boards"}
          onClose={() => setAddTask(false)}
        />
      )}
      <div className="flex flex-col gap-8">
        <div className="w-full flex items-center justify-between">
          <div
            ref={profileRef}
            className="flex flex-col items-center justify-center relative"
          >
            <img
              ref={profileRef}
              onClick={() => {
                if (updateProfileLoading) return;
                setIsProfileClicked(!isProfileClicked);
              }}
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : user?.picture
              }
              alt=""
              className={`h-10 w-10 object-cover rounded-full ${
                updateProfileLoading
                  ? "cursor-default opacity-60"
                  : "cursor-pointer"
              }`}
            />
            {isProfileClicked && (
              <div className="bg-white w-44 shadow-lg px-2 py-2 z-20 absolute top-12 -left-3 flex flex-col items-start justify-start gap-1">
                <input
                  accept=".jpg, .jpeg, .png"
                  onChange={changeImageHandler}
                  ref={fileRef}
                  type="file"
                  hidden
                />
                <p
                  onClick={changeProfileHandler}
                  className="flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg cursor-pointer p-1 px-2"
                >
                  <CgProfile /> Change Profile
                </p>
                <p
                  onClick={logoutHandler}
                  className="flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg cursor-pointer p-1 px-2"
                >
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
            className="outline-none text-1xl font-semibold flex items-center justify-center gap-1 text-red-600 py-2 px-4 border-2 border-red-600 rounded-3xl"
          >
            <IoIosAdd size={20} />
            Add Task
          </button>
        </div>
        <div className="flex items-center gap-5 w-full">
          <NavLink
            to="/all"
            className={({ isActive }) =>
              `flex items-center justify-center gap-1 text-gray-600 font-semibold ${
                isActive ? classes.active : ""
              } ${location.pathname === "/" ? classes.active : ""}`
            }
          >
            <TbLayoutBoardSplit /> All Tasks
          </NavLink>
          <NavLink
            to="/boards"
            className={({ isActive }) =>
              `flex items-center justify-center gap-1 text-gray-600 font-semibold ${
                isActive ? classes.active : ""
              }`
            }
          >
            <FiLayout />
            Boards
          </NavLink>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Header;
