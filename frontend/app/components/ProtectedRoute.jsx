import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router";
import { supabase } from "../library/supabase.js";
import { apiFetch } from "../library/apiFetch.js";
import LoadingSpinner from "./ui/bits/LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
  const [searchParams] = useSearchParams();
  const isOnboardingRoute = searchParams.get("step") === "onboarding";
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    async function check() {
      // check if user has a session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!session) {
        setNeedsOnboarding(false);
        setLoading(false);
        return;
      }

      // check onboarding status
      try {
        const response = await apiFetch("/api/onboarding-state");
        if (response.ok) {
          const data = await response.json();
          setNeedsOnboarding(data.onboarding_step !== "finished");
        } else if (response.status === 404) {
          // no user yet - to onboard
          setNeedsOnboarding(true);
        }
      } catch (error) {
        console.error("Onboarding check failed:", error);
      } finally {
        setLoading(false);
      }
    }

    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => check());
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!session) return <Navigate to="/auth?step=signup" replace />;
  if (needsOnboarding && !isOnboardingRoute) return <Navigate to="/auth?step=onboarding" replace />;

  // user authenticated, render page and return the kidnapped children
  return children;
}