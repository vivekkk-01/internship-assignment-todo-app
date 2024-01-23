import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfoAction } from "../redux/actions/user";
import Header from "../components/Header";
import AllTasks from "./AllTasks";

const Home = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("token")) {
      (async () => {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_API_ENDPOINT}/sessions/auth`,
          {
            headers: {
              Authorization: `Bearer ${searchParams.get("token")}`,
            },
          }
        );
        dispatch(setUserInfoAction(data));
        Cookies.set("todo-user", JSON.stringify(data), {
          secure: true,
          sameSite: "strict",
          expires: 30,
        });
        navigate("/");
      })();
    }
  }, [searchParams.get("token")]);
  return (
    <div className="max-h-full max-w-full p-6">
      <Header user={userInfo} />
      {location.pathname === "/" ? <AllTasks /> : <Outlet />}
    </div>
  );
};

export default Home;
