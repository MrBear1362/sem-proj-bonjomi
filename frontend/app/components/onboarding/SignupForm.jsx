import { Form, Link, redirect, useActionData, useNavigation } from "react-router";
import { supabase } from "../../library/supabase.js";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // validate inputs before sending to supabase
  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.lenght < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  // call supabase auth api to create user
  const { data, error } = await supabase.auth.signUp({
    email, password,
  });

  if (error) {
    console.error("Registration error:", error);
    return { error: error.message };
  }

  // user account created - redirect to login with query parameters
  return redirect("../onboarding/onboarding.jsx");
}

export default function SignupForm() {
  return <div>signup content here</div>;
}


