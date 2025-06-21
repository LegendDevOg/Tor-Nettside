import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import RequireAdmin from "./data/RequireAdmin";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import AccessCodeScreen from "./pages/AccessStore/AccessStore";
import RequireAccessCode from "./data/ReuireAccessCode";
import Quiz from "./pages/Quiz/Quiz";
import Sett from "./pages/sett/Sett";
import SingleQuestion from "./pages/Quiz/SingleQuestion";
import Success from "./pages/Success/Success";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Access Code Route */}
      <Route path="/access-code" element={<AccessCodeScreen />} />

      {/* Protected Routes */}
      <Route element={<RequireAccessCode />}>
        <Route path="/" element={<App />} />
        <Route path="question" element={<Quiz />} />
        <Route path="vannskelig/:id" element={<Sett />} />
        <Route path="question/:id/:set" element={<SingleQuestion />} />
        <Route path="finish" element={<Success />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
