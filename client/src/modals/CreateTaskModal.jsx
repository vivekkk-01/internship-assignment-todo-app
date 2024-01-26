import React, { useRef, useState } from "react";
import ModalOverlay from "./Modal";
import classes from "./createTaskModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskAction,
  resetAddTaskAction,
  resetEditTaskAction,
  setEditTaskAction,
} from "../redux/actions/task";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { ImCancelCircle } from "react-icons/im";
import categories from "../utils/categories";

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  closeOnClick: true,
};

const CreateTaskModal = ({
  onClose,
  taskTitle,
  taskImage,
  taskCategory,
  taskDescription,
  taskStartDate,
  taskEndDate,
  isEditTask,
  taskId,
  selectedCategory,
  board,
}) => {
  const [title, setTitle] = useState(taskTitle || "");
  const [image, setImage] = useState(taskImage || "");
  const [category, setCategory] = useState(
    taskCategory || selectedCategory || ""
  );
  const [description, setDescription] = useState(taskDescription || "");
  const [startDate, setStartDate] = useState(taskStartDate || "");
  const [endDate, setEndDate] = useState(taskEndDate || "");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const dispatch = useDispatch();
  const { addTaskError, addTaskLoading, updateTaskLoading, updateTaskError } =
    useSelector((state) => state.task);

  const fileRef = useRef();
  useEffect(() => {
    dispatch(resetAddTaskAction());
    dispatch(resetEditTaskAction());
  }, []);

  const onSuccess = () => {
    toast.success("You successfully created the Task!", toastOptions);
  };

  const onEditSuccess = () => {
    toast.success("You successfully edited the Task!", toastOptions);
  };

  const onEditError = () => {
    toast.error(
      updateTaskError || "Something went wrong,, please try again!",
      toastOptions
    );
  };

  const onError = () => {
    toast.error(
      addTaskError || "Something went wrong, please try again!",
      toastOptions
    );
  };

  const handleSubmit = (event) => {
    if (addTaskLoading || updateTaskLoading) return;
    event.preventDefault();
    const isTitleValid = title.trim() !== "";
    const isDescriptionValid = description.trim() !== "";
    const isCategoryValid =
      category.trim() !== "" && category.trim() !== "Category";
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
      return;
    }

    if (image) {
      const values = new FormData();
      values.append("image", image);
      values.append("title", title);
      values.append("category", category);
      values.append("description", description);
      values.append("startDate", startDate);
      values.append("endDate", endDate);
      if (!isEditTask) {
        dispatch(addTaskAction({ values, onClose, onSuccess, onError, board }));
      } else {
        dispatch(
          setEditTaskAction({
            taskId,
            values,
            onClose,
            onSuccess: onEditSuccess,
            onError: onEditError,
            board,
          })
        );
      }
    } else {
      const values = { title, description, category, startDate, endDate };
      if (!isEditTask) {
        dispatch(addTaskAction({ values, onClose, onSuccess, onError, board }));
      } else {
        dispatch(
          setEditTaskAction({
            taskId,
            values,
            onClose,
            onSuccess: onEditSuccess,
            onError: onEditError,
            board,
          })
        );
      }
    }
  };

  const addPhotoHandler = () => {
    fileRef.current?.click();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <h1
        className={`font-bold text-3xl mobile:text-2xl ${
          addTaskLoading || updateTaskLoading ? "opacity-60" : ""
        }`}
      >
        {`${!isEditTask ? "Add" : "Edit"} Task`}
      </h1>
      <form
        onSubmit={handleSubmit}
        className={`tab:h-full tab:overflow-y-scroll overflow-x-hidden flex flex-col gap-2 justify-center items-center my-2 ${
          addTaskLoading || updateTaskLoading ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-center justify-evenly w-full tab:block">
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
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setCategoryError("");
              }}
              className="border-2 border-black p-2"
              id="category"
            >
              <option>Category</option>
              {categories.map((category) => {
                return (
                  <option
                    className="desktop:p-0 desktop:text-xs"
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="flex items-start justify-between w-full tab:block">
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
              className="resize-none mobile:h-32 mobile:w-64 outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
              placeholder="Description of task..."
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setDescriptionError("");
              }}
            ></textarea>
          </div>
          <div className="flex flex-col items-start gap-1 relative">
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
                onClick={() => {
                  if (addTaskLoading || updateTaskLoading) return;
                  addPhotoHandler();
                }}
                className={`object-cover rounded-lg overflow-hidden w-72 h-40 ${
                  addTaskLoading || updateTaskLoading
                    ? "default"
                    : "cursor-pointer"
                }`}
                src={
                  typeof image === "string" && image?.includes("cloudinary")
                    ? image
                    : URL.createObjectURL(image)
                }
              />
            ) : (
              <div
                onClick={() => {
                  if (addTaskLoading || updateTaskLoading) return;
                  addPhotoHandler();
                }}
                className={`rounded-lg w-72 h-40 mobile:w-64 mobile:h-32 border-dotted border-2 border-black  flex items-center justify-center ${
                  addTaskLoading || updateTaskLoading
                    ? "default"
                    : "cursor-pointer"
                } `}
              >
                Add Photo
              </div>
            )}
            {image && (
              <ImCancelCircle
                onClick={() => {
                  if (addTaskLoading || updateTaskLoading) return;
                  setImage("");
                }}
                className={`absolute h-5 w-5 rounded-full bg-white top-10 right-3 ${
                  addTaskLoading || updateTaskLoading
                    ? "default"
                    : "cursor-pointer"
                } ${addTaskLoading || updateTaskLoading ? "opacity-60" : ""}`}
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-evenly w-full mobile:flex-col mobile:gap-2">
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
            onClick={() => {
              if (addTaskLoading || updateTaskLoading) return;
              onClose();
            }}
            type="button"
            className={`bg-red-700 text-white py-2 px-4 rounded-lg ${
              addTaskLoading || updateTaskLoading
                ? "cursor-default"
                : "cursor-pointer"
            }`}
          >
            Cancel
          </button>
          <button
            className={`${classes.addTask_btn} py-2 ${
              addTaskLoading || updateTaskLoading
                ? "cursor-default"
                : "cursor-pointer"
            }`}
            type="submit"
          >
            {!isEditTask ? "Add" : "Edit"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
};

export default CreateTaskModal;
