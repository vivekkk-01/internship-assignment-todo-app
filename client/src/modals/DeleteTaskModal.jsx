import React from "react";
import classes from "./deleteTaskModal.module.css";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const DeleteTaskModal = ({ onCancel, onDelete }) => {
  const { deleteTaskLoading } = useSelector((state) => state.task);

  const cancelDeleteTask = () => {
    if (deleteTaskLoading) return;
    onCancel();
  };

  const deleteTaskHandler = () => {
    if (deleteTaskLoading) return;
    onDelete();
  };

  return (
    <>
      <div
        className={`${classes.delete_modal} flex flex-col gap-2 ${
          deleteTaskLoading ? "opacity-60" : ""
        }`}
      >
        <h1 className="text-2xl text-red-700 font-bold">Deleting A Task!</h1>
        <p className="text-lg font-semibold">
          This action can't be undone. Are you sure you want to delete this
          task?
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={cancelDeleteTask}
            style={{ backgroundColor: "var(--main-color)" }}
            className={`${
              deleteTaskLoading ? "cursor-default" : "cursor-pointer"
            } bg-red-200 text-gray-700 py-2 px-4 rounded-md font-semibold outline-none`}
          >
            Cancel
          </button>
          <button
            onClick={deleteTaskHandler}
            className={`${
              deleteTaskLoading ? "cursor-default" : "cursor-pointer"
            } bg-red-700 text-white py-2 px-4 rounded-md font-semibold outline-none`}
          >
            Delete
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default DeleteTaskModal;
