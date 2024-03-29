import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfoAction } from "../redux/actions/user";
import Header from "../components/Header";
import AllTasks from "./AllTasks";
import { setAllTasks } from "../redux/slices/task";

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
        dispatch(setUserInfoAction(data.userInfo));
        dispatch(setAllTasks(data.tasks));
        Cookies.set("todo-user", JSON.stringify(data.userInfo), {
          secure: true,
          sameSite: "strict",
          expires: 30,
        });
        navigate("/");
      })();
    }
  }, [searchParams.get("token")]);
  return (
    <div className="h-screen w-screen max-w-screen p-6 gap-12 flex flex-col">
      <header className="h-1/6">
        <Header user={userInfo} />
      </header>
      <main className="w-full h-5/6 overflow-x-hidden">
        {location.pathname === "/" ? <AllTasks /> : <Outlet />}
      </main>
    </div>
  );
};

export default Home;

export const loader = ({ request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("token");
  const user = Cookies.get("todo-user");
  if (!user && !searchTerm) {
    return redirect("/login");
  }
  return null;
};
