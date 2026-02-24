import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // ✅ Logged in
  return children;
}
