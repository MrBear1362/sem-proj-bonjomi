import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router";
import { supabase } from "../library/supabase.js";
import { apiFetch } from "../library/apiFetch.js";
import LoadingSpinner from "./ui/bits/LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    }
    getUser();
  }, []);

  // keep layout from flashing redirect if not authenticated
  if (loading) return null;

  if (!user) return <Navigate to="/auth" replace />;

  // user authenticated, render page and return the kidnapped children
  return children;
}