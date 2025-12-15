import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import SignupForm from "../components/onboarding/SignupForm.jsx";
import LoginForm from "../components/onboarding/LoginForm.jsx";
import OnboardingSteps from "../components/onboarding/OnboardingSteps.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step") || "signup";
  const [onboardingStep, setOnboardingStep] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("onboardingStep");
      setOnboardingStep(stored);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const STEP_TO_PROGRESS = {
    USER_DETAILS: "progress-40",
    USER_SELECTION: "progress-60",
    BUSINESS_DETAILS: "progress-80",
    LOOKING_FOR: "progress-80",
    LINE_UP_PRO: "progress-100",
  };

  const progressClass = STEP_TO_PROGRESS[onboardingStep] || "progress-40";

  if (step === "onboarding") {
    return (
      <ProtectedRoute>
        <div className="app-layout">
          <main className="main-content">
            <div className="progress-container">
              <div className={`progress-bar ${progressClass}`}></div>
            </div>
            <OnboardingSteps />
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="auth-page">
          {step === "signup" && <SignupForm />}
          {step === "login" && <LoginForm />}
        </div>
      </main>
    </div>
  );
}
