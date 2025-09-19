// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// Import all route components
import Root from "./Root.jsx"; // The new root component
import App from "./routes/App.jsx"; // The component with the nav bar
import Home from "./routes/Home.jsx";
import Login from "./routes/Login.jsx";
import Signup from "./routes/Signup.jsx";
import Stores from "./routes/Stores.jsx";
import Admin from "./routes/Admin.jsx";
import Owner from "./routes/Owner.jsx";
import Profile from "./routes/Profile.jsx";
import Protected from "./routes/Protected.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { index: true, element: <Home /> },
          { path: "stores", element: <Stores /> },
          {
            path: "admin",
            element: (
              <Protected roles={["admin"]}>
                <Admin />
              </Protected>
            ),
          },
          {
            path: "owner",
            element: (
              <Protected roles={["owner"]}>
                <Owner />
              </Protected>
            ),
          },
          {
            path: "profile",
            element: (
              <Protected>
                <Profile />
              </Protected>
            ),
          },
        ],
      },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
