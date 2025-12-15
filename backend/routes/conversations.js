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
      SELECT
      c.id,
      CASE
        WHEN c.title IS NULL OR c.title = '' THEN
          (
            SELECT u.first_name || ' ' || u.last_name
            FROM conversation_participants cpa2
            JOIN users u ON u.auth_user_id = cpa2.user_id
            WHERE cpa2.conversation_id = c.id
              AND cpa2.user_id != ${userId}
            LIMIT 1
          )
        ELSE c.title
      END as title,
      c.created_at,
      m.content as last_message_content,
      m.created_at as last_message_time,
      (SELECT COUNT(*) FROM conversation_participants WHERE conversation_id = c.id) as participant_count
    FROM conversations c
    JOIN conversation_participants cpa ON cpa.conversation_id = c.id
    LEFT JOIN LATERAL (
      SELECT content, created_at
      FROM messages
      WHERE conversation_id = c.id
      ORDER BY created_at DESC
      LIMIT 1
    ) m ON true
    WHERE cpa.user_id = ${userId}
    ORDER BY COALESCE(m.created_at, c.created_at) DESC
    `;

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
      SELECT
        c.id,
        CASE
          WHEN c.title IS NULL OR c.title = '' THEN
            (
              SELECT u.first_name || ' ' || u.last_name
              FROM conversation_participants cpa2
              JOIN users u ON u.auth_user_id = cpa2.user_id
              WHERE cpa2.conversation_id = c.id
                AND cpa2.user_id != ${userId}
              LIMIT 1
            )
          ELSE c.title
        END as title,
        c.created_at
      FROM conversations c
      WHERE c.id = ${id}
      `;

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
    const { title, participantIds } = req.body;
    const userId = req.userId;

    if (!participantIds || participantIds.length === 0) {
      return res.status(400).json({ error: "participantIds required" });
    }

    let finalTitle = title;

    // For 1:1 conversations, leave title NULL (will be dynamic per user)
    if (participantIds.length === 1) {
      const participantId = participantIds[0];

      // Check if a 1:1 conversation already exists with exactly these 2 users
      const existing = await sql`
        SELECT c.id, c.title
        FROM conversations c
        JOIN conversation_participants p1 ON p1.conversation_id = c.id AND p1.user_id = ${userId}
        JOIN conversation_participants p2 ON p2.conversation_id = c.id AND p2.user_id = ${participantId}
        WHERE (SELECT COUNT(*) FROM conversation_participants WHERE conversation_id = c.id) = 2
        LIMIT 1
      `;

      if (existing && existing.length > 0) {
        // Return existing conversation instead of creating new one
        return res.status(200).json(existing[0]);
      }

      finalTitle = null; // Dynamic title for 1:1
    } else {
      // Group chat: require a title
      if (!finalTitle || !finalTitle.trim()) {
        return res
          .status(400)
          .json({ error: "title required for group chats" });
      }
      finalTitle = finalTitle.trim();
    }

    // Create conversation
    const rows = await sql`
      INSERT INTO conversations (title)
      VALUES (${finalTitle})
      RETURNING id, title, created_at`;

    const conversation = rows[0];

    // Add creator as participant
    await sql`
      INSERT INTO conversation_participants (conversation_id, user_id)
      VALUES (${conversation.id}, ${userId})`;

    // Add all other participants
    for (const participantId of participantIds) {
      await sql`
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (${conversation.id}, ${participantId})`;
    }

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

    // Delete in correct order: messages first, then participants, then conversation
    await sql`DELETE FROM messages WHERE conversation_id = ${id}`;
    await sql`DELETE FROM conversation_participants WHERE conversation_id = ${id}`;

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
