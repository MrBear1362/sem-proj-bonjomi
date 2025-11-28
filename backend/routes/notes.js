import express from "express";
import sql from "../db.js";

const router = express.Router();

//endpoint to get complete list of notes
router.get("/api/notes", async (req, res) => {
  try {
    const notes = await sql`
      SELECT 
        u.auth_user_id,
        u.first_name,
        up.image_url,
        n.title, 
        n.content, 
        n.media_url, 
        n.user_id, 
        t.name AS tags,
        (
        SELECT COUNT(*)
        FROM note_likes nl
        WHERE nl.note_id = n.id
        ) AS number_of_likes
      FROM notes n
      LEFT JOIN users u ON u.auth_user_id = n.user_id 
      LEFT JOIN user_profiles up ON up.user_id = u.auth_user_id
      LEFT JOIN tags t ON t.id = n.tag_id`;

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
    const id = req.params.id;

    console.log(id);

    const note = await sql`
    SELECT 
      u.auth_user_id,
      u.first_name,
      up.image_url,
      n.title, 
      n.content, 
      n.media_url, 
      n.user_id, 
      t.name AS tags,
      (
      SELECT COUNT(*)
      FROM note_likes nl
      WHERE nl.note_id = n.id
      ) AS number_of_likes
    FROM notes n
    LEFT JOIN users u ON u.auth_user_id = n.user_id 
    LEFT JOIN user_profiles up ON up.user_id = u.auth_user_id
    LEFT JOIN tags t ON t.id = n.tag_id
    WHERE n.id = ${id}`;

    res.json(note);
  } catch (error) {
    console.log("Error fetching note:", error);
    res.status(500).json({
      error: "Failed to fetch note from database",
    });
  }
});

//endpoint to getting a list of comments connected to a note
router.get("/api/notes/:id/note-comments", async (req, res) => {
  try {
    const noteId = req.params.id;

    const note_comments = await sql`
    SELECT
    u.first_name,
    up.image_url,
    nc.content,
      (
      SELECT COUNT(*)
      FROM note_comment_likes ncl
      WHERE ncl.note_comment_id = nc.id
      ) AS number_of_likes
    FROM users u
    JOIN user_profiles up on up.user_id = u.auth_user_id
    JOIN note_comments nc on nc.user_id = u.auth_user_id
    WHERE nc.note_id = ${noteId};
    `;
    res.json(note_comments);
  } catch (error) {
    console.log("Error fetching comment:", error);
    res.status(500).json({
      error: "Failed to fetch comment from database",
    });
  }
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
