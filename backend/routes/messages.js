import express from "express";
import sql from "../db.js";

const router = express.Router();

// List messages, optionally filter by conversation_id
router.get("/api/messages", async (req, res) => {
  try {
    const { conversation_id } = req.query;

    const messages = conversation_id
      ? await sql`
          SELECT id, content, created_at, updated_at, conversation_id, user_id
          FROM messages
          WHERE conversation_id = ${conversation_id}
          ORDER BY created_at ASC`
      : await sql`
          SELECT id, content, created_at, updated_at, conversation_id, user_id
          FROM messages
          ORDER BY created_at DESC`;

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Get single message by id
router.get("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await sql`
      SELECT id, content, created_at, updated_at, conversation_id, user_id
      FROM messages
      WHERE id = ${id}`;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ error: "Failed to fetch message" });
  }
});

// Create a new message
router.post("/api/messages", async (req, res) => {
  try {
    const { content, conversation_id, user_id } = req.body;

    if (!content || !conversation_id || !user_id) {
      return res.status(400).json({
        error: "content, conversation_id and user_id are required",
      });
    }

    const rows = await sql`
      INSERT INTO messages (content, conversation_id, user_id)
      VALUES (${content}, ${conversation_id}, ${user_id})
      RETURNING id, content, created_at, updated_at, conversation_id, user_id`;

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// Update a message's content
router.put("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    const rows = await sql`
      UPDATE messages
      SET content = ${content},
          updated_at = NOW()
      WHERE id = ${id}
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
router.delete("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await sql`
      DELETE FROM messages
      WHERE id = ${id}
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
