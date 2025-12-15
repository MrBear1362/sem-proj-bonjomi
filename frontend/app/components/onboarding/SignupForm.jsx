import { Form, Link, redirect, useNavigate } from "react-router";
import { useState } from "react";
import { supabase } from "../../library/supabase.js";
import { ONBOARDING_STEPS } from "../../library/onboardingSteps.js";
import { apiFetch } from "../../library/apiFetch.js";
import LoadingSpinner from "../ui/bits/LoadingSpinner.jsx";
import ButtonLink from "../ui/buttons/ButtonLink.jsx";
import InputField from "../ui/inputs/InputField.jsx";

export default function SignupForm() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const createUser = async () => {
    const response = await apiFetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: "",
        last_name: "",
        phone: "",
        city: "",
        birth_year: null,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Could not create user");
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      // create supabase auth user only
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        setIsSubmitting(false);
        return;
      }

      try {
        // if throws, navigation stops
        await createUser();
      } catch (error) {
        setError(error.message);
        setIsSubmitting(false);
        // prevent redirect
        return;
      }

      // only navigate if db row was created
      // send user to onboarding flow
      window.location.href = "/auth?step=onboarding";
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occured on signup");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-container">
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
      <article className="auth-card">
        <header className="auth-header flex-clm">
          <h1 className="auth-title xxl-heading">Sign up</h1>
          <p className="auth-subtitle m-text">
            By continuing you agree to LineUp! Terms of use and Privacy Policy
          </p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form flex-clm">
          {/* input field for email */}
          <InputField
            type="email"
            id="email"
            name="email"
            label="Email address"
            required
            placeholder="Enter your email"
            autoComplete="email"
            className="input__form"
          />

          {/* input field for password */}
          <InputField
            type="password"
            id="password"
            name="password"
            label="Password"
            required
            placeholder="Enter your password"
            minLength={6}
            autoComplete="new-password"
            className="input__form"
          />

          {/* input field for password confirm */}
          <InputField
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            required
            placeholder="Repeat your password"
            minLength={6}
            autoComplete="new-password"
            className="input__form"
          />

          {/* // TODO: design error message */}
          {error && <div className="error-message">{error}</div>}

          <div className="flex justify-center">
            <button
              className="btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  Continue <LoadingSpinner />
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>

        <p className="justify-center spacing-1">or</p>

        <div className="signup-providers justify-center flex-clm gap-1">
          <button className="btn-outline">Sign up with Google</button>
          <button className="btn-outline">Sign up with AppleID</button>
        </div>

        <ButtonLink
          to="/auth"
          query={{ step: "login" }}
          className="btn-text spacing-1 flex gap-025"
        >
          Already have an account? <span>Log in</span>
        </ButtonLink>
      </article>
    </section>
  );
}
