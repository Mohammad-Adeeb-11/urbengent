import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo?.token) {
    localStorage.removeItem("userInfo");
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
