import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

//endpoint to get complete list of notes
router.get("/api/notes", async (req, res) => {
  try {
    const notes = await sql`
      SELECT 
        n.id,
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
      ORDER BY n.created_at DESC
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
    const noteId = req.params.id;

    const note = await sql`
    SELECT 
      n.id,
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
    WHERE n.id = ${noteId}
    `;

    if (note.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note[0]);
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
    nc.id,
    nc.user_id,
    u.first_name,
    up.image_url,
    nc.content,
    nc.created_at,
      (
      SELECT COUNT(*)
      FROM note_comment_likes ncl
      WHERE ncl.note_comment_id = nc.id
      ) AS number_of_likes
    FROM note_comments nc
    JOIN users u ON u.auth_user_id = nc.user_id
    JOIN user_profiles up ON up.user_id = u.auth_user_id
    WHERE nc.note_id = ${noteId}
    ORDER BY nc.created_at DESC
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
router.post("/api/notes", requireAuth, async (req, res) => {
  try {
    const { title, content, mediaUrl, tagId } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "'title' is required",
      });
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      return res.status(400).json({
        error: "Title cannot be empty",
      });
    }

    const note = await sql`
    INSERT INTO notes (title, content, media_url, user_id, tag_id)
    VALUES (${trimmedTitle}, ${content}, ${mediaUrl}, ${req.userId}, ${tagId})
    RETURNING id, title, content, media_url, user_id, tag_id, created_at, updated_at
    `;

    res.status(201).json(note[0]);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({
      error: "Failed to create note",
    });
  }
});

router.post("/api/notes/:id/note-likes", requireAuth, async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!req.userId) {
      return res.status(400).json({
        error: "'userId' is required",
      });
    }

    const like = await sql`
    INSERT INTO note_likes (user_id, note_id)
    VALUES (${req.userId}, ${noteId})
    ON CONFLICT (user_id, note_id) DO NOTHING
    RETURNING id, user_id, note_id, created_at
    `;

    if (like.length === 0) {
      return res.status(200).json({ message: "Already liked" });
    }

    res.status(201).json(like[0]);
  } catch (error) {
    console.error("Error liking note:", error);
    res.status(500).json({
      error: "Failed to like note",
    });
  }
});

//endpoint for creating comments
router.post("/api/note-comments", requireAuth, async (req, res) => {
  try {
    const { content, noteId } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "'content' is required",
      });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return res.status(400).json({
        error: "Content cannot be empty",
      });
    }

    const comment = await sql`
    INSERT INTO note_comments (content, user_id, note_id)
    VALUES (${trimmedContent}, ${req.userId}, ${noteId})
    RETURNING id, content, user_id, note_id, created_at, updated_at
    `;

    res.status(201).json(comment[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      error: "Failed to create comment",
    });
  }
});

router.post("/api/note-comments/likes", requireAuth, async (req, res) => {
  try {
    const { noteCommentId } = req.body;

    if (!req.userId || !noteCommentId) {
      return res.status(400).json({
        error: "'userId' and 'noteCommentId' are required",
      });
    }

    const commentLike = await sql`
      INSERT INTO note_comment_likes (user_id, note_comment_id)
      VALUES (${req.userId}, ${noteCommentId})
      ON CONFLICT (user_id, note_comment_id) DO NOTHING
      RETURNING id, user_id, note_comment_id, created_at
      `;

    if (commentLike.length === 0) {
      return res.status(200).json({ message: "Already liked" });
    }

    res.status(201).json(commentLike[0]);
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({
      error: "Failed to like comment",
    });
  }
});

//endpoint for updating a note
router.patch("/api/notes/:id", requireAuth, async (req, res) => {
  try {
    const noteId = req.params.id;

    const { title, content, mediaUrl, tagId } = req.body;

    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (!trimmedTitle)
        return res.status(400).json({ error: "Title cannot be empty" });
    }

    const result = await sql`
    UPDATE notes
    SET 
    title = COALESCE(${title}, title),
    content = COALESCE(${content}, content),
    media_url = COALESCE(${mediaUrl}, media_url), 
    tag_id = COALESCE(${tagId}, tag_id),
    updated_at = NOW()
    WHERE id = ${noteId} AND user_id = ${req.userId}
    RETURNING id, title, content, media_url, user_id, tag_id, created_at, updated_at
    `;

    if (result.length === 0) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({
      error: "Failed to update note",
    });
  }
});

//endpoint for updating a comment
router.patch("/api/note-comments/:id", requireAuth, async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "'content' is required" });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    const result = await sql`
    UPDATE note_comments
    SET 
    content = ${trimmedContent}, 
    updated_at = NOW()
    WHERE id = ${commentId} AND user_id = ${req.userId}
    RETURNING id, content, user_id, note_id, created_at, updated_at
    `;

    if (result.length === 0) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      error: "Failed to update comment",
    });
  }
});

//endpoint for deleting a note
router.delete("/api/notes/:id", requireAuth, async (req, res) => {
  try {
    const noteId = req.params.id;

    const result = await sql`
    DELETE FROM notes
    WHERE id = ${noteId} AND user_id = ${req.userId}
    RETURNING id
    `;
    if (result.length === 0) {
      return res.status(404).json({
        error: "Note not found",
      });
    }
    res.json({
      message: "Note deleted successfully",
      deleteId: result[0].id,
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({
      error: "Failed to delete note",
    });
  }
});

//endpoint for deleting a like on a note
router.delete("/api/notes/:noteId/note-likes", requireAuth, async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const result = await sql`
    DELETE FROM note_likes 
    WHERE note_id = ${noteId} AND user_id = ${req.userId}
    RETURNING id 
    `;
    if (result.length === 0) {
      return res.status(404).json({
        error: "Like not found",
      });
    }
    res.json({
      message: "Like removed successfully",
      deleteId: result[0].id,
    });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({
      error: "Failed to remove like",
    });
  }
});

//endpoint for deleting a comment
router.delete("/api/note-comments/:id", requireAuth, async (req, res) => {
  try {
    const commentId = req.params.id;

    const result = await sql`
    DELETE FROM note_comments
    WHERE id = ${commentId} AND user_id = ${req.userId}
    RETURNING id
    `;
    if (result.length === 0) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }
    res.json({
      message: "Comment deleted successfully",
      deleteId: result[0].id,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      error: "Failed to delete comment",
    });
  }
});

//endpoint for deleting a like on a comment
router.delete("/api/note-comments/:commentId/likes", requireAuth, async (req, res) => {
    try {
      const noteCommentId = req.params.commentId;

      const result = await sql`
    DELETE FROM note_comment_likes 
    WHERE note_comment_id = ${noteCommentId} AND user_id = ${req.userId}
    RETURNING id 
    `;
      if (result.length === 0) {
        return res.status(404).json({
          error: "Comment Like not found",
        });
      }
      res.json({
        message: "Comment like removed successfully",
        deleteId: result[0].id,
      });
    } catch (error) {
      console.error("Error removing comment like:", error);
      res.status(500).json({
        error: "Failed to remove comment like",
      });
    }
  }
);

export default router;
