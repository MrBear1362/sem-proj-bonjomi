import express from "express";
import sql from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/api/users/search", requireAuth, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Query must be at least 2 characters long" });
    }

    // Sanitize input for ILIKE by escaping wildcard characters and backslashes
    const raw = query.trim();
    const escaped = raw.replace(/[\\%_]/g, (m) => `\\${m}`);
    const q = `%${escaped}%`;

    const rows = await sql`
    SELECT u.auth_user_id as id, u.first_name, u.last_name, up.alias, up.image_url
    FROM users u
    LEFT JOIN user_profiles up ON u.auth_user_id = up.user_id
    WHERE u.first_name ILIKE ${q} ESCAPE '\\'
      OR u.last_name ILIKE ${q} ESCAPE '\\'
      OR up.alias ILIKE ${q} ESCAPE '\\'
    ORDER BY u.first_name, u.last_name
    LIMIT 10
  `;

    res.json(rows);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

export default router;
