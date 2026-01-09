import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Protected Route for authenticated users
export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Route for non-authenticated users (like login page)
export const AuthenticatedUser = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

// Admin Route for instructor access
export const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== "instructor") {
    return <Navigate to="/" />;
  }

  return children;
};