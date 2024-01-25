import React, { useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import classes from "./resetPasswordFromEmail.module.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const ResetPasswordFromEmail = () => {
  const [password, setPassword] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isNavigating) return;
    setIsNavigating(true);

    const isPasswordValid = password.trim().length >= 8;
    if (!isPasswordValid) {
      setIsNavigating(false);
      setPasswordError("Password should contain at least 8 characters!");
      return;
    }

    try {
      await axios.post(
        `${
          import.meta.env.VITE_APP_API_ENDPOINT
        }/user/reset-password-with-token`,
        {
          token,
          password,
        }
      );
      toast.success("Password changed successfully!", toastOptions);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : "Something went wrong, please try again!",
        toastOptions
      );
      setIsNavigating(false);
    }
  };
  return (
    <>
      <div
        className={`h-screen w-screen flex flex-col items-center justify-center ${
          isNavigating ? "opacity-65" : ""
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`p-8 shadow-lg flex flex-col items-center justify-center gap-2 w-96 ${
            isNavigating ? "opacity-65" : ""
          }`}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Password Reset
          </h2>
          {passwordError && (
            <p className="text-red-600 font-bold text-center">
              {passwordError}
            </p>
          )}
          <input
            className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(event) => {
              setPasswordError("");
              setPassword(event.target.value);
            }}
          />
          <button
            style={{ cursor: `${isNavigating ? "default" : "pointer"}` }}
            className={classes.reset_btn}
          >
            Reset Password
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default ResetPasswordFromEmail;

export const loader = () => {
  const user = Cookies.get("todo-user");
  if (user) {
    return redirect("/");
  }
  return null;
};
