import React from "react";
import classes from "./deleteTaskModal.module.css";

const DeleteTaskModal = ({ onCancel, onDelete }) => {
  const cancelDeleteTask = () => {
    onCancel();
  };

  const deleteTaskHandler = () => {
    onDelete();
  };

  return (
    <div className={`${classes.delete_modal} flex flex-col gap-2`}>
      <h1 className="text-2xl text-red-700 font-bold">Deleting Task!</h1>
      <p className="text-lg font-semibold">
        This action can't be undone. Are you sure you want to delete this task?
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={cancelDeleteTask}
          style={{ backgroundColor: "var(--main-color)" }}
          className="bg-red-200 text-gray-700 py-2 px-4 rounded-md cursor-pointer font-semibold outline-none"
        >
          Cancel
        </button>
        <button
          onClick={deleteTaskHandler}
          className="bg-red-700 text-white py-2 px-4 rounded-md cursor-pointer font-semibold outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
