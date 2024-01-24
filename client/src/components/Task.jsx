import React, { useRef, useState } from "react";
import classes from "./task.module.css";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import useClickOutside from "../hooks/useClickOutside";
import CreateTaskModal from "../modals/CreateTaskModal";
import DeleteTaskModal from "../modals/DeleteTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteTaskAction } from "../redux/actions/task";
import { toast } from "react-toastify";

const formatDateRange = (startDate, endDate) => {
  const longStartMonth = startDate.toLocaleString("en-US", { month: "long" });
  const longEndMonth = endDate.toLocaleString("en-US", { month: "long" });

  const shortStartMonth = startDate.toLocaleString("en-US", { month: "short" });
  const shortEndMonth = endDate.toLocaleString("en-US", { month: "short" });

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const longStartYear = startDate.getFullYear();
  const longEndYear = endDate.getFullYear();

  const shortStartYear = startDate.toLocaleString("en-US", { year: "numeric" });
  const shortEndYear = endDate.toLocaleString("en-US", { year: "numeric" });

  if (longStartMonth !== longEndMonth && longStartYear === longEndYear) {
    return `${startDay} ${shortStartMonth} - ${endDay} ${shortEndMonth}, ${longStartYear}`;
  } else if (longStartYear !== longEndYear) {
    return `${startDay} ${shortStartMonth}, ${shortStartYear} - ${endDay} ${shortEndMonth}, ${shortEndYear}`;
  } else {
    return `${startDay}-${endDay} ${longStartMonth}, ${longEndYear}`;
  }
};

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const Task = ({
  status,
  id,
  title,
  description,
  board,
  category,
  startDate,
  endDate,
  image,
}) => {
  const [isVertClicked, setIsVertClicked] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [isDeleteTask, setIsDeleteTask] = useState(false);
  const optionsRef = useRef();
  const deleteModalRef = useRef();
  const dispatch = useDispatch();
  const { deleteTaskLoading, deleteTaskError } = useSelector(
    (state) => state.task
  );

  const deleteTaskClose = () => {
    if (deleteTaskLoading) return;
    setIsDeleteTask(false);
  };

  useClickOutside(optionsRef, () => setIsVertClicked(false));

  useClickOutside(deleteModalRef, deleteTaskClose);

  const onTaskClose = () => setIsEditTask(false);

  const onDeleteTaskError = () => {
    toast.error(
      deleteTaskError || "Something went wrong, please try again!",
      toastOptions
    );
  };

  const onDeleteTaskSuccess = () => {
    toast.success("You successfully deleted the Task!", toastOptions);
  };

  const formattedDateString = (originalDate) =>
    `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${originalDate.getDate().toString().padStart(2, "0")}`;

  const deleteTask = () => {
    dispatch(
      deleteTaskAction({
        taskId: id,
        onClose: deleteTaskClose,
        onError: onDeleteTaskError,
        onSuccess: onDeleteTaskSuccess,
      })
    );
  };

  return (
    <>
      {isEditTask && (
        <CreateTaskModal
          taskId={id}
          taskTitle={title}
          taskCategory={category}
          taskDescription={description}
          taskImage={image || null}
          taskStartDate={formattedDateString(new Date(startDate))}
          taskEndDate={formattedDateString(new Date(endDate))}
          isEditTask={true}
          onClose={onTaskClose}
        />
      )}

      {isDeleteTask && (
        <div
          className="w-full h-full absolute top-0 left-0 z-50 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,.1)" }}
        >
          <div
            ref={deleteModalRef}
            className="w-full flex items-center justify-center"
          >
            <DeleteTaskModal onCancel={deleteTaskClose} onDelete={deleteTask} />
          </div>
        </div>
      )}
      {!board && (
        <div className="flex items-center justify-start gap-3">
          <div
            className={`${classes.status_symbol} ${
              status === "In Complete"
                ? "bg-blue-700"
                : status === "On Going"
                ? "bg-orange-700"
                : "bg-green-600"
            }`}
          ></div>
          <span className="text-gray-600 font-semibold">{status}</span>
        </div>
      )}
      <div className="w-full h-full bg-white shadow-lg rounded-2xl py-4 px-6 flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <span className="py-1 px-2 bg-red-100 text-red-600 rounded-md font-semibold">
            {category}
          </span>
          <div
            ref={optionsRef}
            className="flex flex-col items-center justify-center relative"
          >
            <IoEllipsisVertical
              onClick={() => setIsVertClicked((prev) => !prev)}
              className="rotate-90 text-gray-600 text-xl cursor-pointer hover:text-black"
            />
            {isVertClicked && (
              <div
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
                }}
                className="bg-white w-36 z-20 p-2 absolute top-6 -right-4 flex flex-col items-start justify-start gap-1"
              >
                <p
                  onClick={() => {
                    setIsEditTask(true);
                    setIsVertClicked(false);
                  }}
                  className="flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg cursor-pointer p-1 px-2"
                >
                  <MdOutlineEdit /> Edit Task
                </p>
                <p
                  onClick={() => {
                    setIsVertClicked(false);
                    setIsDeleteTask(true);
                  }}
                  className="flex items-center gap-2 w-full hover:bg-gray-600 hover:text-gray-100 hover:rounded-lg cursor-pointer p-1 px-2"
                >
                  <MdDelete /> Delete Task
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold">{title}</h3>
          {image && (
            <img className="object-cover w-full rounded-xl" src={image} />
          )}
          <p className="text-gray-500 font-semibold">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <FaRegCalendarAlt className="text-gray-500 font-semibold text-lg" />
          <p className="text-gray-500 font-semibold text-sm">
            {formatDateRange(new Date(startDate), new Date(endDate))}
          </p>
        </div>
      </div>
    </>
  );
};

export default Task;
