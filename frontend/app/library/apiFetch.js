import { supabase } from "./supabase.js";
import { redirect } from "react-router";

export async function apiFetch(path, options = {}) {
  // get api url from .env var
  const apiUrl = import.meta.env.VITE_API_URL;
  // construct url by combining api base url with path
  const url = `${apiUrl}${path}`;

  // get current session from supabase
  const { data: { session }, } = await supabase.auth.getSession();

  // extract JWT token from session
  const token = session?.access_token;

  // prepare headers
  const headers = {
    ...options.headers,
  };

  // add auth header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // make request with standard fetch()
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // special handling for for 401 unauth (session expired/invalid)
  // dont redirect if checking onboarding state during signup
  if (response.status === 401 && !path.includes('/onboarding-state')) {
    const currentPath = window.location.pathname + window.location.search;
    throw redirect(`/auth?redirect=${encodeURIComponent(currentPath)}`);
  }

  return response;
}