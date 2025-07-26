import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
