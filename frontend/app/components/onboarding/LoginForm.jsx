import { Form, Link, redirect, useNavigation } from "react-router";
import { useState } from "react";
import { supabase } from "../../library/supabase.js";
import { apiFetch } from "../../library/apiFetch.js";
import LoadingSpinner from "../ui/bits/LoadingSpinner.jsx";
import ButtonLink from "../ui/buttons/ButtonLink.jsx";
import InputField from "../ui/inputs/InputField.jsx";
// TODO: find icon library and IMPORT here pls

import "../UI/inputs/input.css";
import "../UI/buttons/button.css";
import "../../app.css";

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

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
        if (step && step !== "finished") {
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
    <section className="auth-container spacing-8">
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
          <button className="signup-providers-btn btn-white">
            Login with Google
          </button>
          <button className="signup-providers-btn btn-white">
            Login with AppleID
          </button>
        </div>

        <ButtonLink
          to="/auth"
          query={{ step: "signup" }}
          className="btn-link spacing-1 flex gap-025"
        >
          Don't have an account? <span className="blue">Sign up</span>
        </ButtonLink>
      </article>
    </section>
  );
}
