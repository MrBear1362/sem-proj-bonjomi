import express from "express";
import sql from "../db.js";

const router = express.Router();

//endpoint to get complete list of notes
router.get("/api/notes", async (req, res) => {
  try {
    const notes = await sql`
    SELECT id, title, content, media_url, user_id, tag_id FROM notes
    ORDER BY created_at DESC
    `;
    res.json(notes);
  } catch (error) {
    console.log("Error fetching notes:", error);

    res.status(500).json({
      error: "Failed to fetch notes from database",
    });
  }
});

//endpoint to get a specifik note
router.get("/api/notes/:id", async (req, res) => {
  try {
  } catch (error) {}
});

//endpoint to getting a list of comments connected to a note
router.get("/api/notes/:id/note-comments", async (req, res) => {
  try {
  } catch (error) {}
});

//endpoint for creating a note
router.post("/api/notes", async (req, res) => {
  try {
  } catch (error) {}
});

//endpoint for creating comments
router.post("/api/note-comments", async (req, res) => {
  try {
  } catch (error) {}
});

//endpoint for updating a note
router.patch("/api/notes/:id", async (req, res) => {
  try {
  } catch (error) {}
});

//endpoint for updating a comment
router.patch("/api/note-comments/:id", async (req, res) => {
  try {
  } catch (error) {}
});

//endpoint for deleting a note
router.delete("/api/notes/:id", async (req, res) => {
  try {
  } catch (error) {}
});

//endpoint for deleting a comment
router.delete("/api/note-comments/:id", async (req, res) => {
  try {
  } catch (error) {}
});

export default router;
