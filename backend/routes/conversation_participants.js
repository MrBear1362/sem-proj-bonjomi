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

router.get("/api/conversation_participants/:Id", async (req, res) => {
  try {
  } catch (error) {}
});

router.post("/api/conversation_participants/", async (req, res) => {
  try {
  } catch (error) {}
});

router.delete("/api/conversation_participants/:id", async (req, res) => {
  try {
  } catch (error) {}
});

export default router;
