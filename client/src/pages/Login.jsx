import React, { useEffect, useState } from "react";
import classes from "./login.module.css";
import { getGoogleUrl } from "../utils/getGoogleUrl";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { setUserInfoAction } from "../redux/actions/user";
import { useDispatch } from "react-redux";

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const dispatch = useDispatch();

  const handleGoogleOAuth = () => {
    if (isNavigating) return;
    const googleUrl = getGoogleUrl(from);
    if (googleUrl) {
      setIsNavigating(true);
      window.location.href = googleUrl;
    }
  };

  useEffect(() => {
    setIsNavigating(false);
    return () => {
      setIsNavigating(false);
    };
  }, []);

  const handleSubmit = async (event) => {
    setEmailError("");
    setPasswordError("");
    event.preventDefault();
    setIsNavigating(true);
    if (isNavigating) return;

    const isPasswordValid = password.trim() !== "";
    const isEmailValid =
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) &&
      email.trim() !== "";
    if (!isEmailValid) {
      setEmailError("Enter a valid Email Address.");
      return;
    }
    if (!isPasswordValid) {
      setPasswordError("Password should contain 8 or more characters!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/user/login`,
        {
          email,
          password,
        }
      );
      if (data.provider) {
        navigate("/reset-password", { state: data.message });
      }

      if (data.id) {
        dispatch(setUserInfoAction(data));
        Cookies.set("todo-user", JSON.stringify(data), {
          secure: true,
          sameSite: "strict",
          expires: 30,
        });
        return navigate("/");
      }
      setIsNavigating(false);
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
        <div className="p-8 shadow-lg flex flex-col items-center justify-center gap-2">
          <div>
            <h1 className="font-bold text-lg">Welcome To MyTodos!</h1>
            <p className="text-gray-500 font-semibold text-md">
              The Best Platform To Organize Your Tasks.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-6"
          >
            <h1 className="text-3xl font-bold text-gray-600">Login</h1>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col items-center justify-center gap-1">
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
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <input
                  className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  placeholder="Password"
                  required
                />
                {passwordError && (
                  <p className="text-red-500 font-bold">{passwordError}</p>
                )}
              </div>
            </div>
            <button
              style={{ cursor: `${isNavigating ? "default" : "pointer"}` }}
              className={classes.login_btn}
            >
              Login
            </button>
          </form>
          <Link
            to="/ask-for-email"
            className="mr-auto font-semibold text-blue-700"
          >
            Forgot Password?
          </Link>
          <p className="text-gray-600 font-semibold">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold">
              Sign up
            </Link>
          </p>
          <p className="text-gray-600 font-bold text-2xl">Or</p>
          <div
            onClick={handleGoogleOAuth}
            className={`${
              !isNavigating ? "cursor-pointer" : ""
            } w-full shadow-lg py-4 flex items-center justify-center gap-3`}
          >
            <img className="w-8 h-8" src={"/google.png"} alt="" />
            <p className="text-gray-500 font-semibold">Continue with Google</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;

export const loader = () => {
  const user = Cookies.get("todo-user");
  if (user) {
    return redirect("/");
  }
  return null;
};
