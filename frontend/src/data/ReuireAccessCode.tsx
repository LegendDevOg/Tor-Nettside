import { Navigate, Outlet } from "react-router-dom";
import useAccessStore from "./AccessStore";

const RequireAccessCode = () => {
  const hasAccess = useAccessStore((state) => state.hasAccess);

  return hasAccess ? <Outlet /> : <Navigate to="/access-code" replace />;
};

export default RequireAccessCode;