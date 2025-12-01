import express from "express";
import sql from "../db.js";

// Create a new router instance to handle conversation_participants endpoints
const router = express.Router();

// GET /api/conversation_participants - List all conversation participants
// Returns an array of all participants across all conversations
router.get("/api/conversation_participants", async (req, res) => {
  try {
    const participants = await sql`
      SELECT id, created_at, conversation_id, user_id
      FROM conversation_participants
      ORDER BY created_at DESC`;

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
router.get(
  "/api/conversation_participants/:conversation_Id",
  async (req, res) => {
    try {
      const conversation_Id = req.params.conversation_Id;

      const participant = await sql`
        SELECT id, created_at, conversation_id, user_id
        FROM conversation_participants
        WHERE conversation_id = ${conversation_Id}`;

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
router.post(
  "/api/conversation_participants/:conversation_Id",
  async (req, res) => {
    try {
      const conversation_Id = req.params.conversation_Id;
      const { user_Id } = req.body;

      if (!user_Id) {
        return res
          .status(400)
          .json({ error: "userId is required in request body" });
      }

      const participants = await sql`
        INSERT INTO conversation_participants (conversation_id, user_id) 
        VALUES (${conversation_Id}, ${user_Id})
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
router.delete(
  "/api/conversation_participants/:conversationId",
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;

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
