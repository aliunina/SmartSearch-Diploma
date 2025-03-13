import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import Main from "./pages/Main/Main";
import Search from "./pages/Search/Search";
import Error from "./pages/Error/Error";
import SignUp from "./pages/SignUp/SignUp";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/search",
    element: <Search />
  },
  {
    path: "*",
    element: <Error />
  },
  {
    path: "/sign-up",
    element: <SignUp />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>
);
