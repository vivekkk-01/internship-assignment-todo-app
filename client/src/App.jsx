import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import AskForEmail from "./pages/AskForEmail";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/ask-for-email", element: <AskForEmail /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
