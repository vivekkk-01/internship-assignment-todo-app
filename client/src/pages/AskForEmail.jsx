import React, { useState } from "react";
import classes from "./askForEmail.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const AskForEmail = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsNavigating(true);
    const isEmailValid =
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) &&
      email.trim() !== "";

    if (!isEmailValid) {
      setEmailError("Enter a valid Email Address.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/user/reset-password`,
        {
          email,
        }
      );
      toast.success(data, toastOptions);
      setIsNavigating(false);
    } catch (error) {
      toast.error(
        typeof error.response.data === "string"
          ? error.response.data
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
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-1xl font-semibold my-2 text-center">
            Enter the email associated with your account and we will send you a
            link to reset your password.
          </p>

          <div className="flex flex-col">
            {emailError && (
              <p className="text-red-600 font-bold">{emailError}</p>
            )}
            <input
              className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              placeholder="Email"
              required
            />

            <button
              style={{ cursor: `${isNavigating ? "default" : "pointer"}` }}
              className={classes.ask_btn}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default AskForEmail;
