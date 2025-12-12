/**
 * Supabase Client for Frontend
 *
 * This module creates a Supabase client configured with the ANON key.
 * The anon key is safe to expose in the browser - it has limited permissions.
 *
 * We use this client for authentication:
 * - User registration (signUp)
 * - User login (signInWithPassword)
 * - User logout (signOut)
 * - Getting the current session (getSession)
 * - Listening to auth state changes (onAuthStateChange)
 *
 * Supabase Auth Features:
 * - Automatically stores JWT tokens in localStorage
 * - Automatically refreshes expired tokens
 * - Manages session state
 * - Handles password hashing (bcrypt on the server)
 *
 * What is a JWT?
 * JWT stands for JSON Web Token. It's a secure way to transmit information
 * between parties as a JSON object. When you log in, Supabase creates a JWT
 * that contains your user ID and other information. This token is signed, so
 * it can't be tampered with. You can decode JWTs at https://jwt.io to see
 * what's inside (but you can't modify them without invalidating the signature).
 *
 * Security Note:
 * - The anon key is PUBLIC - it's safe to commit to git and expose in browser
 * - It can only be used for operations allowed by your database policies
 * - Never use the service role key on the frontend (it bypasses all security)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase enviroment variablesl  " +
      "Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
