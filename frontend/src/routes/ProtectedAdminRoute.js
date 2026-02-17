import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { adminLoading, isAdminAuthenticated, admin } = useSelector((state) => state.user);
  if (adminLoading === false) {
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin-login" replace />;
    } else if (admin.role !== "Admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  }
};

export default ProtectedAdminRoute;
