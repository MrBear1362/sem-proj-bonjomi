import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new error(
    "Missing required environment variables: SUPABASE_URL and SUPABASE_ANON_KEY must be set"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function requireAuth(req, res, next) {
  try {
    // extract auth header | format: "Bearer <jwt-token>"
    const authHeader = req.headers.authorization;

    // check if auth header exists
    if (!authHeader) {
      return res.status(401).json({
        error: "Authentication required. Please provide a valid token.",
      });
    }

    // extract token from "Bearer <token>" format | split by space and take second part
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid authorization header format. Expected: Bearer <token>",
      });
    }

    // verify token with supabase auth | supabase.auth.getUser() validates jwt and returns user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    // check if token verification failed
    if (error || !user) {
      return res
        .status(401)
        .json({ error: "Invalid or expired token. Please log in again." });
    }

    // valid token: attach user id to req object | makes user id available to route handlers
    req.user = user;
    req.userId = user.id;

    // call next() to continue to route handler | without  next(), req will hang
    next();
  } catch (error) {
    // catch unexpected auth errors
    console.error("Authentification error:", error);
    return res
      .status(401)
      .json({ error: "Authentification failed. Please try again." });
  }
}
