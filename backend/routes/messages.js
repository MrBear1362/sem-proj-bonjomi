import express from "express";
import sql from "../db.js";
import { requireAuth, isParticipant, ownsMessage } from "../middleware/auth.js";

const router = express.Router();

// List messages, optionally filter by conversation_id
// Requires authentication - only returns messages from conversations user participates in
router.get("/api/messages", requireAuth, async (req, res) => {
  try {
    const { conversationid } = req.query;
    const userId = req.user.id; // From requireAuth middleware

    if (conversationid) {
      // Verify user is participant in this conversation
      const hasAccess = await isParticipant(sql, userId, conversationid);
      if (!hasAccess) {
        return res
          .status(403)
          .json({ error: "You are not a participant in this conversation" });
      }

      const messages = await sql`
        SELECT id, content, created_at, updated_at, conversation_id, user_id
        FROM messages
        WHERE conversation_id = ${conversationid}
        ORDER BY created_at ASC`;

      return res.json(messages);
    }

    // Return messages only from conversations the user participates in
    const messages = await sql`
      SELECT m.id, m.content, m.created_at, m.updated_at, m.conversation_id, m.user_id
      FROM messages m
      INNER JOIN conversation_participants cpa 
        ON m.conversation_id = cpa.conversation_id
      WHERE cpa.user_id = ${userId}
      ORDER BY m.created_at DESC`;

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Get single message by id
// Requires authentication - verifies user is participant in message's conversation
router.get("/api/messages/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rows = await sql`
      SELECT id, content, created_at, updated_at, conversation_id, user_id
      FROM messages
      WHERE id = ${id}`;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Verify user is participant in this message's conversation
    const hasAccess = await isParticipant(sql, userId, rows[0].conversation_id);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "You do not have access to this message" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ error: "Failed to fetch message" });
  }
});

// Create a new message
// Requires authentication - uses authenticated user's id, verifies they're a participant
router.post("/api/messages", requireAuth, async (req, res) => {
  try {
    const { content, conversationid } = req.body;
    const userId = req.user.id; // Use authenticated user's id, not from body

    if (!content || !conversationid) {
      return res.status(400).json({
        error: "content and conversation_id are required",
      });
    }

    // Verify user is participant in this conversation
    const hasAccess = await isParticipant(sql, userId, conversationid);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "You are not a participant in this conversation" });
    }

    const rows = await sql`
      INSERT INTO messages (content, conversation_id, user_id)
      VALUES (${content}, ${conversationid}, ${userId})
      RETURNING id, content, created_at, updated_at, conversation_id, user_id`;

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// Update a message's content
// Requires authentication - only message owner can update
router.put("/api/messages/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    // Verify user owns this message
    const isOwner = await ownsMessage(sql, userId, id);
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: "You can only update your own messages" });
    }

    const rows = await sql`
      UPDATE messages
      SET content = ${content},
          updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id, content, created_at, updated_at, conversation_id, user_id`;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Failed to update message" });
  }
});

// Delete a message by id
// Requires authentication - only message owner can delete
router.delete("/api/messages/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify user owns this message
    const isOwner = await ownsMessage(sql, userId, id);
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: "You can only delete your own messages" });
    }

    const rows = await sql`
      DELETE FROM messages
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id`;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted", id: rows[0].id });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
