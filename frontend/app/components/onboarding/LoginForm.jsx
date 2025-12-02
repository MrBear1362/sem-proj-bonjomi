import { Form, Link, redirect, useNavigation } from "react-router";
import { useState } from "react";
import { supabase } from "../../library/supabase.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import ButtonLink from "../ui/ButtonLink.jsx";
// TODO: find icon library and IMPORT here pls

export default function LoginForm() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Email and password are requried");
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
      return;
    }

    // redirect to dashboard
    window.location.href = "/";
  };

  return (
    <section className="auth-container">
      <article className="auth-card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="Enter your password"
            />
          </div>

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
