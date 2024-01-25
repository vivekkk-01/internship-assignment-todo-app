import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login, { loader as loginLoader } from "./pages/Login";
import Home, { loader as homeLoader } from "./pages/Home";
import ResetPassword, {
  loader as resetPasswordLoader,
} from "./pages/ResetPassword";
import AskForEmail, { loader as askForEmailLoader } from "./pages/AskForEmail";
import ResetPasswordFromEmail, {
  loader as resetPasswordFromEmailLoader,
} from "./pages/ResetPasswordFromEmail";
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
  {
    path: "/reset-password",
    element: <ResetPassword />,
    loader: resetPasswordLoader,
  },
  {
    path: "/ask-for-email",
    element: <AskForEmail />,
    loader: askForEmailLoader,
  },
  {
    path: "/reset-password-from-email/:token",
    element: <ResetPasswordFromEmail />,
    loader: resetPasswordFromEmailLoader,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
