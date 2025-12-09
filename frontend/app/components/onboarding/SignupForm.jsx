import { Form, Link, redirect, useNavigation } from "react-router";
import { useState } from "react";
import { supabase } from "../../library/supabase.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import ButtonLink from "../ui/ButtonLink.jsx";
import InputField from "../ui/InputField.jsx";

export default function SignupForm() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setIsSubmitting(false);
      return;
    }

    // redirect to onboarding
    window.location.href = "/auth?step=onboarding";
  };

  return (
    <section className="auth-container">
      <article className="auth-card">
        <h1>Sign up</h1>
        <p className="auth-subtitle">By continuing you agree to LineUp! Terms of use and Privacy Policy</p>

        <form onSubmit={handleSubmit} className="auth-form">

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
          <button className="signup-providers-btn">Sign up with Google</button>
          <button className="signup-providers-btn">Sign up with AppleID</button>
        </div>

        <ButtonLink to="/auth" query={{ step: "login" }}>
          Already have an account? <span>Log in</span>
        </ButtonLink>
      </article>
    </section>
  )
}


