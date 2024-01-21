import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";

const router = createBrowserRouter([{ path: "/login", element: <Login /> }]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
