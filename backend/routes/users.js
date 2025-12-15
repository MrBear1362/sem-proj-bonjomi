import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

// GET - get user by id (public profile info)
router.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await sql`
    SELECT
      u.auth_user_id AS id,
      u.first_name,
      u.last_name,
      u.city,
      p.image_url,
      p.bio,
      p.alias
    FROM users u
    LEFT JOIN user_profiles p ON p.user_id = u.auth_user_id
    WHERE u.auth_user_id = ${userId}
    `;

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// GET - search users by name
router.get("/api/users/search", async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: "Search query must be at least 2 characters" });
    }

    const searchTerm = `%${q.toLowerCase()}%`;

    const users = await sql`
    SELECT
      u.auth_user_id AS id,
      u.first_name,
      u.last_name,
      p.image_url,
      p.alias,
      u.city
    FROM users u
    LEFT JOIN user_profiles p ON p.user_id = u.auth_user_id
    WHERE
      LOWER(u.first_name || ' ' || u.last_name) LIKE ${searchTerm}
      OR LOWER(u.first_name) LIKE ${searchTerm}
      OR LOWER(u.last_name) LIKE ${searchTerm}
      OR LOWER(p.alias) LIKE ${searchTerm}
    LIMIT ${limit}
    `;
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

export default router;