import express from "express";
import sql from "../db.js";
import { requireAuth, isParticipant } from "../middleware/auth.js";

const router = express.Router();

// List all conversations
// Requires authentication - only returns conversations user participates in
router.get("/api/conversations", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await sql`
      SELECT DISTINCT
        c.id,
        c.title,
        c.created_at,
        m.content as last_message_content,
        m.created_at as last_message_time
      FROM conversations c
      INNER JOIN conversation_participants cpa ON c.id = cpa.conversation_id
      LEFT JOIN LATERAL (
        SELECT content, created_at
        FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      ) m on true
      WHERE cpa.user_id = ${userId}
      ORDER BY COALESCE(m.created_at, c.created_at) DESC`;

    res.json(rows);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get single conversation by id
// Requires authentication - verifies user is participant
router.get("/api/conversations/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify user is participant in this conversation
    const hasAccess = await isParticipant(sql, userId, id);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "You are not a participant in this conversation" });
    }

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
// Requires authentication - verifies user is participant
router.get("/api/conversations/:id/messages", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify user is participant in this conversation
    const hasAccess = await isParticipant(sql, userId, id);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "You are not a participant in this conversation" });
    }

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
// Requires authentication - creator is automatically added as participant
router.post("/api/conversations", requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.userId;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }

    // Create conversation
    const rows = await sql`
      INSERT INTO conversations (title)
      VALUES (${title.trim()})
      RETURNING id, title, created_at`;

    const conversation = rows[0];

    // Automatically add creator as participant
    await sql`
      INSERT INTO conversation_participants (conversation_id, user_id)
      VALUES (${conversation.id}, ${userId})`;

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// Update a conversation's title
// Requires authentication - verifies user is participant
router.put("/api/conversations/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.userId;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }

    // Verify user is participant in this conversation
    const hasAccess = await isParticipant(sql, userId, id);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "You are not a participant in this conversation" });
    }

    const rows = await sql`
      UPDATE conversations
      SET title = ${title.trim()}
      WHERE id = ${id}
      RETURNING id, title, created_at`;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating conversation:", error);
    res.status(500).json({ error: "Failed to update conversation" });
  }
});

// Delete a conversation by id
// Requires authentication - verifies user is participant (consider adding owner-only check)
router.delete("/api/conversations/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify user is participant in this conversation
    const hasAccess = await isParticipant(sql, userId, id);
    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "You are not a participant in this conversation" });
    }

    // Delete conversation (participants will cascade if ON DELETE CASCADE is set)
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
