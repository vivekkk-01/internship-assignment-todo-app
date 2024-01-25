import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login, { loader as loginLoader } from "./pages/Login";
import Home, { loader as homeLoader } from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import AskForEmail from "./pages/AskForEmail";
import ResetPasswordFromEmail from "./pages/ResetPasswordFromEmail";
import Register, { loader as registerLoader } from "./pages/Register";
import AllTasks, { loader as allTasksLoader } from "./pages/AllTasks";
import Boards, { loader as boardsLoader } from "./pages/Boards";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: homeLoader,
    children: [
      { path: "/all", element: <AllTasks />, loader: allTasksLoader },
      { path: "/boards", element: <Boards />, loader: boardsLoader },
    ],
  },
  { path: "/login", element: <Login />, loader: loginLoader },
  { path: "/register", element: <Register />, loader: registerLoader },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/ask-for-email", element: <AskForEmail /> },
  {
    path: "/reset-password-from-email/:token",
    element: <ResetPasswordFromEmail />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
