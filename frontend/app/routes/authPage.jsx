import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router";
import { supabase } from "../library/supabase.js";
import SignupForm from "../components/onboarding/SignupForm.jsx";
import LoginForm from "../components/onboarding/LoginForm.jsx";
import OnboardingSteps from "../components/onboarding/OnboardingSteps.jsx";

export default function AuthPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const stepParam = searchParams.get("step");
  const step = stepParam || "signup";

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();

      // if no session, stop loading
      if (!session) {
        setLoading(false);
        return;
      }

      // if there is a session, fetch full user
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
      setLoading(false);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (!loading && user && step !== "onboarding") {
      navigate("/");
    }
  }, [loading, user, step, navigate]);

  if (loading) return <div>Loading... from auth</div>;

  return (
    <div className="auth-page">
      {step === "signup" && <SignupForm onNext={() => setSearchParams({ step: "login" })} />}
      {step === "login" && <LoginForm onNext={() => setSearchParams({ step: "onboarding" })} />}
      {step === "onboarding" && <OnboardingSteps />}
    </div>
  );
}