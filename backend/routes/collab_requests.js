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
    p.image_url,
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
    JOIN user_profiles p ON p.user_id = u.auth_user_id
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
    p.image_url,
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
    JOIN user_profiles p ON p.user_id = u.auth_user_id
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
router.post("/api/collab-requests", requireAuth, async (req, res) => {
  try {
    const { title, content, due_date, location, tag_id, is_paid, media_url } = req.body;

    // trim
    const trimmedTitle = title?.trim();
    const trimmedContent = content?.trim();
    const trimmedLocation = location?.trim();
    
    // validate after trim
    if (!trimmedTitle) return res.status(400).json({ error: "Title cannot be empty" });
    if (!trimmedContent) return res.status(400).json({ error: "Description cannot be empty" });
    if (!trimmedLocation) return res.status(400).json({ error: "Location cannot be empty" });

    // validate required fields
    if (!title || !content || !due_date || !location || !tag_id) {
      return res.status(400).json({
        error: "Required fields cannot be empty",
      });
    };

    // create collab request | RETURNING gets genId for next insert
    const collabRequests = await sql`
    INSERT INTO collab_requests (title, content, due_date, location, tag_id, is_paid, user_id, media_url)
    VALUES (${trimmedTitle}, ${trimmedContent}, ${due_date}, ${trimmedLocation}, ${tag_id}, ${is_paid}, ${userId}, ${media_url || null})
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
    // extract collab_request id from url param
    const collabRequestId = req.params.id;

    // destructure possible update fields
    const { title, content, media_url, location, due_date, tag_id } = req.body;

    // update object built dynamically
    const updates = {};

    // validate provided fields (partial update)
    if (title !== undefined) {
      const trimmed = title.trim();
      if(!trimmed) return res.status(400).json({error: "Title cannot be empty"});
      updates.title = trimmed;
    }

    if (content !== undefined) {
      const trimmed = content.trim();
      if (!trimmed) return res.status(400).json({error: "Description cannot be empty"});
      updates.content = trimmed;
    }

    if (location !== undefined) {
      const trimmed = location.trim();
      if (!trimmed) return res.status(400).json({error: "Location cannot be empty"});
      updates.location = trimmed;
    }

    if (due_date !== undefined) {
      updates.due_date = due_date;
    }

    if (media_url !== undefined) {
      updates.media_url = media_url || null;
    }

    if (tag_id !== undefined) {
      updates.tag_id = tag_id;
    }

    // ensure at least one field is provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({error: "No fields provided for update"});
    }

    // add updated_at timestamp automatically
    updates.updated_at = sql`now()`;

    // update collaboration request in database
    const result = await sql`
    UPDATE collab_requests
    SET ${sql(updates)}
    WHERE id = ${collabRequestId} AND user_id = ${req.userId}
    RETURNING id, title, content, media_url, location, due_date, tag_id, created_at, updated_at
    `;

    // if no request updated, means no request exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Collaboration request not found or unauthorised", });
    }

    // return updated request
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating collaboration request:", error);
    res.status(500).json({ error: `Failed to update collaboration request: ${collabRequestId}`, });
  }
});

// PATCH close specific collab_request from id
router.patch("/api/collab-requests/:id/close", requireAuth, async (req, res) => {
  try {
    const collabRequestId = req.params.id;

    const result = await sql`
    UPDATE collab_requests
    SET 
      is_closed = true,
      updated_at = now()
    WHERE id = ${collabRequestId} AND user_id = ${req.userId}
    RETURNING id, is_closed, updated_at
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Collaboration request not found", });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error closing collaboration request:", error);
    res.status(500).json({ error: `Failed to close collaboration request: ${collabRequestId}`, });
  }
});

// PATCH open specific collab_request from id
router.patch("/api/collab-requests/:id/open", requireAuth, async (req, res) => {
  try {
    const collabRequestId = req.params.id;

    const result = await sql`
    UPDATE collab_requests
    SET 
      is_closed = false,
      updated_at = now()
    WHERE id = ${collabRequestId} AND user_id = ${req.userId}
    RETURNING id, is_closed, updated_at
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Collaboration request not found", });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error opening collaboration request:", error);
    res.status(500).json({ error: `Failed to open collaboration request: ${collabRequestId}`, });
  }
});

// DELETE specific collab_request from id
router.delete("/api/collab-requests/:id", requireAuth, async (req, res) => {
  try {
    // extract collab_request id from url params
    const collabRequestId = req.params.id;

    // delete request from db
    const result = await sql`
    DELETE FROM collab_requests
    WHERE id = ${collabRequestId} AND user_id = ${req.userId}
    RETURNING id
    `;

    // if no request deleted, no thread exists
    if (result.length === 0) { return res.status(404).json({ error: "Collaboration request not found", }); };

    res.json({ message: "Collaboration request deleted", deletedId: result[0].id, });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Failed to delete request", });
  }
});

export default router;