import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";


const router = express.Router();

// GET all user profiles
router.get("/api/user-profiles", async (req, res) => {
  try {
    // combine users tabel and user profiles table to get user and name
    const userProfiles = await sql`
    SELECT
    p.user_id,
    u.first_name,
    u.last_name, 
    p.image_url, 
    p.tag_id
    FROM users u
    JOIN user_profiles p ON p.user_id = u.auth_user_id
    `;

    res.json(userProfiles);
  } catch (error) {
    console.error("Failed fetching user profiles:", error);

    res.status(500).json({
      error: "Failed to fetch user profiles from database",
    });
  }
});

// GET specific user profile from id
router.get("/api/user-profiles/:id", async (req, res) => {
  try {
    // extract profile id from url
    const profileId = req.params.id;

  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch user profile: ${profileId}`,
    });
  }
});

// PATCH (update) specific user profile from id
router.patch("/api/user-profiles/:id", requireAuth, async (req, res) => {
  try {
    // extract profile id from url
    const profileId = req.params.id;

  } catch (error) {
    res.status(500).json({
      error: `Failed to update user profile: ${profileId}`
    })
  }
});

export default router;