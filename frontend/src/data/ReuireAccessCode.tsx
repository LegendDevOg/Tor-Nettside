import { Navigate, Outlet } from "react-router-dom";
import useAccessStore from "./AccessStore";
import Footer from "../components/Footer/Footer";

const RequireAccessCode = () => {
  const hasAccess = useAccessStore((state) => state.hasAccess);

  return hasAccess ? (
    <>
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to="/access-code" replace />
  );
};

export default RequireAccessCode;