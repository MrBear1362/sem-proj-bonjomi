import express from "express";
import sql from "../db.js";

const router = express.Router();

// List all conversations
router.get("/api/conversations", async (req, res) => {
  try {
    const rows = await sql`
      SELECT id, title, created_at
      FROM conversations
      ORDER BY created_at DESC`;
    res.json(rows);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get single conversation by id
router.get("/api/conversations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await sql`
      SELECT id, title, created_at
      FROM conversations
      WHERE id = ${id}`;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// List messages for a conversation
router.get("/api/conversations/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await sql`
      SELECT id, content, created_at, updated_at, conversation_id, user_id
      FROM messages
      WHERE conversation_id = ${id}
      ORDER BY created_at ASC`;
    res.json(rows);
  } catch (error) {
    console.error("Error fetching messages for conversation:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch messages for conversation" });
  }
});

// Create a conversation
router.post("/api/conversations", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const rows = await sql`
      INSERT INTO conversations (title)
      VALUES (${title})
      RETURNING id, title, created_at`;

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// Delete a conversation by id
router.delete("/api/conversations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await sql`
      DELETE FROM conversations
      WHERE id = ${id}
      RETURNING id`;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ message: "Conversation deleted", id: rows[0].id });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

export default router;
