import express from "express";
import sql from "../db.js";
import { requireAuth, isParticipant } from "../middleware/auth.js";

// Create a new router instance to handle conversation_participants endpoints
const router = express.Router();

// GET /api/conversation_participants - List all conversation participants
// Returns an array of all participants across all conversations the user participates in
// Requires authentication
router.get("/api/conversation-participants", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    // Only return participants from conversations the user is part of
    const participants = await sql`
      SELECT cpa.id, cpa.created_at, cpa.conversation_id, cpa.user_id
      FROM conversation_participants cpa
      WHERE cpa.conversation_id IN (
        SELECT conversation_id 
        FROM conversation_participants 
        WHERE user_id = ${userId}
      )
      ORDER BY cpa.created_at DESC`;

    res.json(participants);
  } catch (error) {
    console.error("Error fetching of conversation participants:", error);

    res.status(500).json({
      error: "Failed to fetch conversation participants",
    });
  }
});

// GET /api/conversation_participants/:conversation_Id - Get participants for a specific conversation
// Returns an array of users who are participating in the specified conversation
// Requires authentication - verifies user is participant
router.get(
  "/api/conversation-participants/:conversationId",
  requireAuth,
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.userId;

      // Verify user is participant in this conversation
      const hasAccess = await isParticipant(sql, userId, conversationId);
      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You are not a participant in this conversation" });
      }

      const participant = await sql`
        SELECT id, created_at, conversation_id, user_id
        FROM conversation_participants
        WHERE conversation_id = ${conversationId}`;

      res.json(participant);
    } catch (error) {
      console.error("Error fetching participant:", error);
      res.status(500).json({
        error:
          "Failed to fetch the participant in the conversation from database",
      });
    }
  }
);

// POST /api/conversation_participants/:conversation_Id - Add a user to a conversation
// Creates a new participant record linking a user to a conversation
// Requires authentication - verifies requesting user is already a participant (can invite others)
router.post(
  "/api/conversation_participants/:conversationId",
  requireAuth,
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const { userId } = req.body;
      const requestingUserId = req.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ error: "userId is required in request body" });
      }

      // Verify requesting user is participant in this conversation
      const hasAccess = await isParticipant(
        sql,
        requestingUserId,
        conversationId
      );
      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You must be a participant to add others" });
      }

      // Check if user is already a participant
      const existingParticipant = await sql`
        SELECT id FROM conversation_participants
        WHERE conversation_id = ${conversationId} AND user_id = ${userId}
        LIMIT 1`;

      if (existingParticipant.length > 0) {
        return res.status(409).json({ error: "User is already a participant" });
      }

      const participants = await sql`
        INSERT INTO conversation_participants (conversation_id, user_id) 
        VALUES (${conversationId}, ${userId})
        RETURNING *`;

      res.status(201).json(participants[0]);
    } catch (error) {
      console.error("Error creating participant:", error);
      res.status(500).json({
        error:
          "Failed to create the participant in the conversation to database",
      });
    }
  }
);

// DELETE /api/conversation_participants/:conversationId - Remove all participants from a conversation
// Deletes all participant records for a specific conversation (useful for cleanup)
// Requires authentication - verifies user is participant (consider limiting to conversation owner)
router.delete(
  "/api/conversation_participants/:conversationId",
  requireAuth,
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.userId;

      // Verify user is participant in this conversation
      const hasAccess = await isParticipant(sql, userId, conversationId);
      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You are not a participant in this conversation" });
      }

      const results = await sql`
        DELETE FROM conversation_participants
        WHERE conversation_id = ${conversationId}
        RETURNING *`;

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "No participants found for this conversation" });
      }

      res.json({
        message: "Participants deleted successfully",
        deletedCount: results.length,
      });
    } catch (error) {
      console.error("Error deleting participants from conversation:", error);
      res.status(500).json({
        error: "Failed to delete the participants in the conversation",
      });
    }
  }
);

// Export the router so it can be imported and used in server.js
export default router;
