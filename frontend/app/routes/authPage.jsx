import { useSearchParams } from "react-router";
import SignupForm from "../components/onboarding/SignupForm.jsx";
import LoginForm from "../components/onboarding/LoginForm.jsx";
import OnboardingSteps from "../components/onboarding/OnboardingSteps.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step") || "signup";

  if (step === "onboarding") {
    return (
      <ProtectedRoute>
        <OnboardingSteps />
      </ProtectedRoute>
    );
  }

  return (
    <div className="auth-page">
      {step === "signup" && <SignupForm />}
      {step === "login" && <LoginForm />}
    </div>
  );
}