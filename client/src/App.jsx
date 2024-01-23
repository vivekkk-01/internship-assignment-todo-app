import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import AskForEmail from "./pages/AskForEmail";
import ResetPasswordFromEmail from "./pages/ResetPasswordFromEmail";
import Register from "./pages/Register";
import AllTasks from "./pages/AllTasks";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/ask-for-email", element: <AskForEmail /> },
  {
    path: "/reset-password-from-email/:token",
    element: <ResetPasswordFromEmail />,
  },
  { path: "/all", element: <AllTasks /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
