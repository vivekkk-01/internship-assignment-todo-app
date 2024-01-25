import React, { useEffect } from "react";
import ModalOverlay from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteAccountAction,
  resetDeleteAccountAction,
} from "../redux/actions/user";

const toastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  closeOnClick: true,
};

const DeleteAccountModal = ({ onClose }) => {
  const { deleteAccountLoading, deleteAccountError } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDeleteSuccess = () => {
    toast.success("You successfully Deleted your Account!", toastOptions);
  };

  const onDeleteError = () => {
    toast.error(
      deleteAccountError || "Something went wrong, please try again!",
      toastOptions
    );
  };

  useEffect(() => {
    dispatch(resetDeleteAccountAction());
  }, []);

  const deleteAccountHandler = () => {
    dispatch(
      deleteAccountAction({
        onSuccess: onDeleteSuccess,
        onError: onDeleteError,
        onClose,
        navigate,
      })
    );
  };

  const cancelDeleteAccount = () => {
    if (deleteAccountLoading) return;
    onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className={`flex flex-col gap-4 ${
          deleteAccountLoading ? "opacity-60" : ""
        }`}
      >
        <h1 className="text-red-800 font-bold text-2xl">
          Deleting Your Account!
        </h1>
        <p className="text-gray-800 font-semibold text-md">
          After Deleting your MyTodos Account, you will lose access to of all
          your tasks and will never be able to gain access to them again.
        </p>

        <p className="text-black font-bold text-md">
          This action can't be undone. Are you sure you want to delete your
          MyTodos Account?
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={cancelDeleteAccount}
            style={{ backgroundColor: "var(--main-color)" }}
            className={`${
              deleteAccountLoading ? "cursor-default" : "cursor-pointer"
            } bg-red-200 text-gray-700 py-2 px-4 rounded-md font-semibold outline-none`}
          >
            Cancel
          </button>
          <button
            onClick={deleteAccountHandler}
            className={`${
              deleteAccountLoading ? "cursor-default" : "cursor-pointer"
            } bg-red-700 text-white py-2 px-4 rounded-md font-semibold outline-none`}
          >
            Delete Account
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default DeleteAccountModal;
