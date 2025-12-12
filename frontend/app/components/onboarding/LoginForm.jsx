import { Form, Link, redirect, useNavigation } from "react-router";
import { useState } from "react";
import { supabase } from "../../library/supabase.js";
import { apiFetch } from "../../library/apiFetch.js";
import LoadingSpinner from "../ui/bits/LoadingSpinner.jsx";
import ButtonLink from "../ui/buttons/ButtonLink.jsx";
import InputField from "../ui/inputs/InputField.jsx";
// TODO: find icon library and IMPORT here pls

export default function LoginForm() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Email and password are requried");
      setIsSubmitting(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
      return;
    }

    // check onboarding status before redirect
    try {
      const response = await apiFetch("/api/onboarding-state");
      if (response.ok) {
        const userData = await response.json();
        const step = userData.onboarding_step;

        // if onboarding not finished, redirect to onboarding
        if (step && step !== 'finished') {
          window.location.href = "/auth?step=onboarding";
          return;
        }
      }
    } catch (error) {
      console.error("Failed to fetch onboarding status:", error);
      // continue to dashboard even if check fails
      // TODO: reconsider this
    }

    // if onboarding finished, redirect to dashboard
    window.location.href = "/";
  };

  return (
    <section className="auth-container">
      <article className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title xxl-heading">Login</h1>
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
          />

          {/* // TODO: design error message */}
          {error && <div className="error-message">{error}</div>}

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
        </form>

        <p>or</p>

        <div className="signup-providers">
          <button className="signup-providers-btn">Login with Google</button>
          <button className="signup-providers-btn">Login with AppleID</button>
        </div>

        <ButtonLink to="/auth" query={{ step: "signup" }}>
          Don't have an account? <span>Sign up</span>
        </ButtonLink>
      </article>
    </section>
  );
}
