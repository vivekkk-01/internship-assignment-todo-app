import React, { useRef, useState } from "react";
import ModalOverlay from "./Modal";
import classes from "./createTaskModal.module.css";

const CreateTaskModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const fileRef = useRef();
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const addPhotoHandler = () => {
    fileRef.current?.click();
  };
  return (
    <ModalOverlay onClose={onClose}>
      <h1 className="text-center font-bold text-3xl">Add Task</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 justify-center items-center my-2"
      >
        <div className="flex items-center justify-evenly w-full">
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="title" className="text-gray-600 font-bold">
              Title:
            </label>
            <input
              id="title"
              className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Complete Presentation"
              required
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="category" className="text-gray-600 font-bold">
              Category:
            </label>
            <input
              id="category"
              className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="College Assignment"
              required
            />
          </div>
        </div>
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="description" className="text-gray-600 font-bold">
              Description:
            </label>
            <textarea
              id="description"
              cols="30"
              rows="05"
              className="resize-none outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
              placeholder="Description of task..."
            ></textarea>
          </div>
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="image" className="text-gray-600 font-bold">
              Image:
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg, .jpeg, .png"
              hidden
              onChange={(event) => {
                setImage(event.target.files[0]);
              }}
            />
            {image ? (
              <img
                className="object-cover rounded-lg overflow-hidden w-72 h-40"
                src={URL.createObjectURL(image)}
              />
            ) : (
              <div
                onClick={addPhotoHandler}
                className="rounded-lg w-72 h-40 border-dotted border-2 border-black  flex items-center justify-center cursor-pointer"
              >
                Add Photo
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-evenly w-full">
          <div className="flex flex-col items-start self-start">
            <label htmlFor="date" className="text-gray-600 font-bold">
              Start Date:
            </label>
            <input type="date" id="date" />
          </div>
          <div className="flex flex-col items-start self-start">
            <label htmlFor="date" className="text-gray-600 font-bold">
              End Date:
            </label>
            <input type="date" id="date" />
          </div>
        </div>
        <div className="flex items-center self-end gap-2">
          <button
            type="button"
            className="bg-red-700 text-white py-2 px-4 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button className={`${classes.addTask_btn} py-2`} type="submit">
            Add
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
};

export default CreateTaskModal;
