import { Navigate } from "react-router";
import { supabase } from "../library/supabase.js";

export default function ProtectedRoute({ children }) {
  const user = supabase.auth.user();
  // redirect if not authenticated
  if (!user) return <Navigate to="/auth" />;
  // user authenticated, render page and return the kidnapped children
  return children;
}