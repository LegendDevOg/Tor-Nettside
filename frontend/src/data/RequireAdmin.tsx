import { Navigate, Outlet } from "react-router-dom";

const RequireAdmin = () => {
  const isAdmin = localStorage.getItem("admin-token") === "letmein123"; // hardcoded for now
  return isAdmin ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default RequireAdmin;