// Authentication middleware using Supabase JWT verification
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * requireAuth - Middleware to verify JWT token and attach user to request
 *
 * Expects Authorization header: "Bearer <token>"
 * On success: attaches user object to req.user
 * On failure: returns 401 Unauthorized
 *
 * Usage:
 *   router.get("/protected", requireAuth, async (req, res) => {
 *     // req.user contains authenticated user data
 *   });
 */
export const requireAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No authorization token provided",
      });
    }

    // Remove "Bearer " prefix to get the token
    const token = authHeader.substring(7);

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    // Attach user to request object for use in route handlers
    // user object contains: id, email, and other Supabase user fields
    req.user = user;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      error: "Authentication failed",
    });
  }
};

/**
 * Helper function to verify user is a participant in a conversation
 * Used in conversation routes to check authorization
 *
 * @param {object} sql - postgres connection
 * @param {string} userId - authenticated user's id
 * @param {string} conversationId - conversation id to check
 * @returns {Promise<boolean>} - true if user is participant
 */
export const isParticipant = async (sql, userId, conversationId) => {
  const result = await sql`
    SELECT id 
    FROM conversation_participants 
    WHERE user_id = ${userId} 
      AND conversation_id = ${conversationId}
    LIMIT 1`;

  return result.length > 0;
};

/**
 * Helper function to verify user owns a message
 * Used in message routes to check authorization for update/delete
 *
 * @param {object} sql - postgres connection
 * @param {string} userId - authenticated user's id
 * @param {string} messageId - message id to check
 * @returns {Promise<boolean>} - true if user owns the message
 */
export const ownsMessage = async (sql, userId, messageId) => {
  const result = await sql`
    SELECT id 
    FROM messages 
    WHERE id = ${messageId} 
      AND user_id = ${userId}
    LIMIT 1`;

  return result.length > 0;
};
