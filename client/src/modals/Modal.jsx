import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./modal.module.css";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const Modal = ({ children }) => {
  return (
    <div className={classes.modal}>
      <div>{children}</div>
    </div>
  );
};

const Overlay = ({ onClose }) => {
  return (
    <div className={classes.backdrop} onClick={onClose}>
      <ToastContainer />
    </div>
  );
};

const ModalOverlay = ({ children, onClose }) => {
  const { addTaskLoading } = useSelector((state) => state.task);
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Modal>{children}</Modal>,
        document.getElementById("modal")
      )}
      {ReactDOM.createPortal(
        <Overlay onClose={addTaskLoading ? null : onClose} />,
        document.getElementById("backdrop")
      )}
    </Fragment>
  );
};

export default ModalOverlay;
