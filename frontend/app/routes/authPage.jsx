import { useSearchParams, useNavigate } from "react-router";
import SignupForm from "../components/onboarding/SignupForm.jsx";
import LoginForm from "../components/onboarding/LoginForm.jsx";
import OnboardingSteps from "../components/onboarding/OnboardingSteps.jsx";
import { supabase } from "../library/supabase.js";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const stepParam = searchParams.get("step");
  const user = supabase.auth.user();

  // determine step to show
  let step = stepParam || "signup";

  // if user is logged in and tries to access signup/login
  if (user && step !== "onboarding") {
    // already logged in, send to dashboard
    navigate("/");
    return null;
  }

  const handleNext = (nextStep) => {
    // updates URL
    setSearchParams({ step: nextStep });
  };

  return (
    <div className="auth-page">
      {step === "signup" && <SignupForm onNext={() => handleNext("login")} />}
      {step === "login" && <LoginForm onNext={() => handleNext("onboarding")} />}
      {step === "onboarding" && <OnboardingSteps />}
    </div>
  );
}