import React, { useEffect, useState } from "react";
import classes from "./login.module.css";
import { getGoogleUrl } from "../utils/getGoogleUrl";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleOAuth = () => {
    if (isNavigating) return;
    const googleUrl = getGoogleUrl(from);
    if (googleUrl) {
      console.log("url", googleUrl);
      setIsNavigating(true);
      window.location.href = googleUrl;
    }
  };

  useEffect(() => {
    setIsNavigating(false);
  }, []);

  return (
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
        <form className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold text-gray-600">Login</h1>
          <div className="flex flex-col items-center justify-center gap-4">
            <input
              className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              placeholder="Email"
            />
            <input
              className="outline-none bg-gray-300 py-3 p-4 placeholder:text-gray-600 text-lg placeholder:font-bold rounded-lg"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              placeholder="Password"
            />
          </div>
          <button
            style={{ cursor: `${isNavigating ? "default" : "pointer"}` }}
            className={classes.login_btn}
          >
            Login
          </button>
        </form>
        <p className="text-gray-600 font-semibold">
          Don't have an account?{" "}
          <span className="text-blue-600 font-bold">Sign up</span>
        </p>
        <p className="text-gray-600 font-bold text-2xl">Or</p>
        <div
          onClick={handleGoogleOAuth}
          className={`${
            !isNavigating ? "cursor-pointer" : ""
          } w-full shadow-lg py-4 flex items-center justify-center gap-3`}
        >
          <img className="w-8 h-8" src={"src/assets/google.png"} alt="" />
          <p className="text-gray-500 font-semibold">Continue with Google</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
