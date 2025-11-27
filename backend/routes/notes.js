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
      t.name as tags,
      (SELECT COUNT(*) 
        FROM note_likes
        JOIN notes ON notes.id = note_likes.note_id) as number_of_likes
    /* WHERE note_likes.note_id = n.id) as number_of_likes */
    FROM notes n
    JOIN users u on u.auth_user_id = n.user_id 
    JOIN user_profiles up on up.user_id = u.auth_user_id
    JOIN tags t on t.id = n.tag_id`;

    /* building blocks */

    /* const userData = await sql`
    SELECT 
      u.auth_user_id,
      u.first_name,
      up.image_url
    FROM users u
    JOIN user_profiles up on up.user_id = u.auth_user_id
    `;

    const notes = await sql`
    SELECT 
    n.id,
    n.title, 
    n.content, 
    n.media_url, 
    n.user_id, 
    n.tag_id 
    FROM notes n
    `;

    const note_likes = await sql`
    SELECT
    COUNT(*) as number_of_likes
    FROM notes n
    JOIN note_likes nl ON nl.note_id = n.id
    `;

    const note_comments = await sql`
    SELECT
    nc.content
    FROM notes n
    JOIN note_comments nc ON nc.note_id = n.id
    `;

    const note_comment_likes = await sql`
    SELECT
    COUNT(*) as number_of_likes
    FROM note_comments nc
    JOIN note_comment_likes ncl ON nc.id = ncl.note_comment_id
    `;

    const note_comment_user = await sql`
    SELECT
      nc.content,
      u.first_name,
      up.image_url
    FROM users u
    JOIN user_profiles up on up.user_id = u.auth_user_id
    JOIN note_comments nc on nc.user_id = u.auth_user_id
    `; */

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

    const note = await sql`
    SELECT 
      u.auth_user_id,
      u.first_name,
      up.image_url,
      n.title, 
      n.content, 
      n.media_url, 
      n.user_id, 
      t.name as tags,
      (SELECT COUNT(*) 
        FROM note_likes
        WHERE note_likes.note_id = ${id}) as number_of_likes
    FROM notes n
    JOIN users u on u.auth_user_id = n.user_id 
    JOIN user_profiles up on up.user_id = u.auth_user_id
    JOIN tags t on t.id = n.tag_id
    WHERE n.user_id = ${id}`;

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

    const note_comment = await sql`
    SELECT
      nc.content,
      u.first_name,
      up.image_url
    FROM users u
    JOIN user_profiles up on up.user_id = u.auth_user_id
    JOIN note_comments nc on nc.user_id = u.auth_user_id
    WHERE nc.id = ${noteId};
    `;
    res.json(note_comment);
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
