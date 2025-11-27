import express from "express";
import sql from "../db.js"; // Adjust path to your database connection file

const router = express.Router();

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

router.get(
  "/api/conversation_participants/:conversationId",
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;

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

router.post(
  "/api/conversation_participants/:conversationId",
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required in request body" });
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
        return res.status(404).json({ error: "No participants found for this conversation" });
      }

      res.json({ 
        message: "Participants deleted successfully",
        deletedCount: results.length 
      });
    } catch (error) {
      console.error("Error deleting participants from conversation:", error);
      res.status(500).json({
        error: "Failed to delete the participants in the conversation",
      });
    }
  }
);

export default router;
