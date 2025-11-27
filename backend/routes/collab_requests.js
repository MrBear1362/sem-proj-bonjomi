import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";
const router = express.Router();

// GET all collab_requests - for feed
router.get("/api/collab-requests", async (req, res) => {
  try {
    const collabRequests = await sql`
    SELECT
    c.id,
    u.first_name,
    c.title,
    c.content,
    c.media_url,
    c.location,
    c.created_at,
    c.updated_at,
    c.due_date,
    c.user_id,
    c.tag_id,
    c.is_paid
    FROM users u
    JOIN collab_requests c ON c.user_id = u.auth_user_id
    WHERE c.is_closed = false
    ORDER BY c.created_at DESC
    LIMIT 50
    `;
    // TODO: refactor pagination handling - currently limited to 50, might want pages etc.

    res.json(collabRequests);
  } catch (error) {
    console.error("Failed fetching collaboration requests:", error);

    res.status(500).json({
      error: "Failed to fetch collaboration requests from database",
    });
  }
});

// GET specific collab_requests
router.get("/api/collab-requests/:id", async (req, res) => {
  try {

  } catch (error) {

  }
});

// POST a new collab_request
// TODO: add requireAuth back
router.post("/api/collab-requests", async (req, res) => {
  try {
    const { title, content, due_date, location, tag_id, is_paid, media_url } = req.body;

    // validate title after trim
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      return res.status(400).json({ error: "Title cannot be empty", });
    }

    // validate content after trim
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return res.status(400).json({ error: "Description cannot be empty", });
    };

    // validate location after trim
    const trimmedLocation = location.trim();
    if (trimmedLocation.length === 0) {
      return res.status(400).json({ error: "Location cannot be empty", });
    };

    // validate required fields
    if (!title || !content || !due_date || !location || !tag_id) {
      return res.status(400).json({
        error: "Required fields cannot be empty",
      });
    };

    // TODO: remove hardcoded user id
    const testUserId = '17f55570-6bfe-44d4-9578-c22e181ba387';

    // create collab request | RETURNING gets genId for next insert
    const collabRequests = await sql`
    INSERT INTO collab_requests (title, content, due_date, location, tag_id, is_paid, user_id, media_url)
    VALUES (${trimmedTitle}, ${trimmedContent}, ${due_date}, ${trimmedLocation}, ${tag_id}, ${is_paid}, ${testUserId}, ${media_url || null})
    RETURNING id, title, user_id, created_at, content, due_date, location, tag_id, is_paid, media_url
    `;

    const collabRequest = collabRequests[0];

    res.status(201).json(collabRequest);
  } catch (error) {
    console.error("Error creating collaboration request:", error);
    res.status(500).json({ error: "Failed to create request", });
  }
});

// PATCH specific collab_request from id
router.patch("/api/collab-requests/:id", requireAuth, async (req, res) => {
  try {

  } catch (error) {

  }
});

// DELETE specific collab_request from id
router.delete("/api/collab-requests/:id", requireAuth, async (req, res) => {
  try {

  } catch (error) {

  }
});

export default router;