import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getGoogleUrl } from "../utils/getGoogleUrl";

const ResetPassword = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleOAuth = () => {
    if (isNavigating) return;
    const googleUrl = getGoogleUrl(from);
    if (googleUrl) {
      setIsNavigating(true);
      window.location.href = googleUrl;
    }
  };

  const handleResetPassword = () => {
    navigate("/ask-for-email");
  };

  return (
    <div
      className={`h-screen w-screen flex flex-col items-center justify-center ${
        isNavigating ? "opacity-65" : ""
      }`}
    >
      <div className="p-8 shadow-lg flex flex-col items-center justify-center gap-2 w-96">
        <h2 className="text-2xl font-bold">We found your account!</h2>
        <p className="text-1xl font-semibold my-2">{location.state}</p>
        <div
          onClick={handleGoogleOAuth}
          className={`${
            !isNavigating ? "cursor-pointer" : ""
          } w-full shadow-lg py-4 flex items-center justify-center gap-3`}
        >
          <img className="w-8 h-8" src={"src/assets/google.png"} alt="" />
          <p className="text-gray-500 font-semibold">Continue with Google</p>
        </div>
        <p className="text-gray-600 font-bold text-2xl">Or</p>
        <p
          onClick={handleResetPassword}
          className={`text-1xl font-bold text-blue-700 ${
            !isNavigating ? "cursor-pointer" : ""
          }`}
        >
          Reset Password
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
