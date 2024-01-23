import React, { useRef, useState } from "react";
import ModalOverlay from "./Modal";
import classes from "./createTaskModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addTaskAction, resetAddTaskAction } from "../redux/actions/task";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const CreateTaskModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const dispatch = useDispatch();
  const { addTaskError, addTaskLoading } = useSelector((state) => state.task);

  const fileRef = useRef();

  useEffect(() => {
    dispatch(resetAddTaskAction());
  }, []);

  const onSuccess = () => {
    toast.success("You successfully created the Task!", toastOptions);
  };

  const onError = () => {
    toast.error(
      addTaskError || "Something went wrong, please try again!",
      toastOptions
    );
  };

  const handleSubmit = (event) => {
    if (addTaskLoading) return;
    event.preventDefault();
    const isTitleValid = title.trim() !== "";
    const isDescriptionValid = description.trim() !== "";
    const isCategoryValid = category.trim() !== "";
    const isStartDateValid = startDate.trim() !== "";
    const isEndDateValid = endDate.trim() !== "";

    if (!isTitleValid) {
      setTitleError("Title is required!");
      return;
    }

    if (!isDescriptionValid) {
      setDescriptionError("Description is required!");
      return;
    }

    if (!isCategoryValid) {
      setCategoryError("Category is required!");
      return;
    }

    if (!isStartDateValid) {
      setStartDateError("Start Date is required!");
      return;
    }

    if (!isEndDateValid) {
      setEndDateError("End Date is required!");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setStartDateError("Start Date should be less than End Date!");
    }

    if (image) {
      const values = new FormData();
      values.append("image", image);
      values.append("title", title);
      values.append("category", category);
      values.append("description", description);
      values.append("startDate", startDate);
      values.append("endDate", endDate);
      dispatch(addTaskAction({ values, onClose, onSuccess, onError }));
    } else {
      const values = { title, description, category, startDate, endDate };
      dispatch(addTaskAction({ values, onClose, onSuccess, onError }));
    }
  };

  const addPhotoHandler = () => {
    fileRef.current?.click();
  };

  return (
    <>
      <ModalOverlay onClose={onClose}>
        <h1
          className={`font-bold text-3xl ${addTaskLoading ? "opacity-60" : ""}`}
        >
          Add Task
        </h1>
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-2 justify-center items-center my-2 ${
            addTaskLoading ? "opacity-60" : ""
          }`}
        >
          <div className="flex items-center justify-evenly w-full">
            <div className="flex flex-col items-start gap-1">
              {titleError && (
                <p className="text-1xl font-semibold text-red-700 self-center">
                  {titleError}
                </p>
              )}
              <label htmlFor="title" className="text-gray-600 font-bold">
                Title:
              </label>
              <input
                id="title"
                className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setTitleError("");
                }}
                placeholder="Complete Presentation"
                required
              />
            </div>
            <div className="flex flex-col items-start gap-1">
              {categoryError && (
                <p className="text-1xl font-semibold text-red-700 self-center">
                  {categoryError}
                </p>
              )}
              <label htmlFor="category" className="text-gray-600 font-bold">
                Category:
              </label>
              <input
                id="category"
                className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
                type="text"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setCategoryError("");
                }}
                placeholder="College Assignment"
                required
              />
            </div>
          </div>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start gap-1">
              {descriptionError && (
                <p className="text-1xl font-semibold text-red-700 self-center">
                  {descriptionError}
                </p>
              )}
              <label htmlFor="description" className="text-gray-600 font-bold">
                Description:
              </label>
              <textarea
                id="description"
                cols="30"
                rows="05"
                className="resize-none outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
                placeholder="Description of task..."
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setDescriptionError("");
                }}
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
              {startDateError && (
                <p className="text-1xl font-semibold text-red-700 self-center">
                  {startDateError}
                </p>
              )}
              <label htmlFor="date" className="text-gray-600 font-bold">
                Start Date:
              </label>
              <input
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setStartDateError("");
                }}
                type="date"
                id="date"
              />
            </div>
            <div className="flex flex-col items-start self-start">
              {endDateError && (
                <p className="text-1xl font-semibold text-red-700 self-center">
                  {endDateError}
                </p>
              )}
              <label htmlFor="date" className="text-gray-600 font-bold">
                End Date:
              </label>
              <input
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setEndDateError("");
                  setStartDateError("");
                }}
                type="date"
                id="date"
              />
            </div>
          </div>
          <div className="flex items-center self-end gap-2">
            <button
              onClick={() => onClose()}
              type="button"
              className={`bg-red-700 text-white py-2 px-4 rounded-lg cursor-pointer ${
                addTaskLoading ? "cursor-default" : "cursor-pointer"
              }`}
            >
              Cancel
            </button>
            <button
              className={`${classes.addTask_btn} py-2 ${
                addTaskLoading ? "cursor-default" : "cursor-pointer"
              }`}
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </ModalOverlay>
      <ToastContainer />
    </>
  );
};

export default CreateTaskModal;
