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
    // extract collaboration request id from url
    const collabRequestId = req.params.id;

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
    WHERE c.id = ${collabRequestId}
    `;

    // check if collaboration request is found
    if (collabRequests.length === 0) {
      return res.status(404).json({ error: "Collaboration request not found", });
    };

    // return first and only request
    res.json(collabRequests[0]);
  } catch (error) {
    console.error("Error fetching collaboration request:", error);
    res.status(500).json({ error: "Failed to fetch collaboration request from database", });
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
router.patch("/api/collab-requests/:id", async (req, res) => {
  try {
    // extract collab_request id from url param
    const collabRequestId = req.params.id;

    // extract new data from req
    const { title, content, media_url, location, due_date, tag_id } = req.body;

    // validate required fields
    if (!title || !content || !due_date || !location || !tag_id) {
      return res.status(400).json({ error: "Required fields cannot be empty", });
    };

    // trim
    const trimmedTitle = title?.trim();
    const trimmedContent = content?.trim();
    const trimmedLocation = location?.trim();

    // validate after trim
    if (!trimmedTitle) return res.status(400).json({ error: "Title cannot be empty" });
    if (!trimmedContent) return res.status(400).json({ error: "Description cannot be empty" });
    if (!trimmedLocation) return res.status(400).json({ error: "Location cannot be empty" });

    // TODO: remove hardcoded user id
    const testUserId = '17f55570-6bfe-44d4-9578-c22e181ba387';

    // update collaboration request in database
    const result = await sql`
    UPDATE collab_requests
    SET 
      title = ${trimmedTitle}, 
      content = ${trimmedContent}, 
      media_url = ${media_url}, 
      location = ${trimmedLocation}, 
      due_date = ${due_date}, 
      tag_id = ${tag_id},
      updated_at = now()
    WHERE id = ${collabRequestId} AND user_id = ${testUserId}
    RETURNING id, title, content, media_url, location, due_date, tag_id, updated_at
    `;

    // if no request updated, means no request exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Collaboration request not found", });
    }

    // return updated request
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating collaboration request:", error);
    res.status(500).json({ error: `Failed to update collaboration request: ${collabRequestId}`, });
  }
});

// DELETE specific collab_request from id
// TODO: add requireAuth back
router.delete("/api/collab-requests/:id", async (req, res) => {
  try {
    // extract collab_request id from url params
    const collabRequestId = req.params.id;

    // TODO: remove hardcoded user id
    const testUserId = '17f55570-6bfe-44d4-9578-c22e181ba387';

    // delete request from db
    const result = await sql`
    DELETE FROM collab_requests
    WHERE id = ${collabRequestId} AND user_id = ${testUserId}
    RETURNING id
    `;

    // if no request deleted, no thread exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Collaboration request not found", });
    };

    res.json({
      message: "Collaboration request deleted",
      deletedId: result[0].id,
    });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Failed to delete request", });
  }
});

export default router;