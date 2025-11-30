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
  // extract profile id from url
  const profileId = req.params.id;

  try {

    const userProfiles = await sql`
    SELECT
    p.user_id,
    u.first_name,
    u.last_name,
    p.about,
    p.image_url,
    p.media_url,
    p.instagram_url,
    p.twitter_url,
    p.youtube_url,
    p.tiktok_url,
    p.facebook_url,
    p.tag_id
    FROM users u
    JOIN user_profiles p ON p.user_id = u.auth_user_id
    WHERE p.user_id = ${profileId}
    `;

    // check if user_profile is found
    if (userProfiles.length === 0) { return res.status(404).json({ error: "User profile not found", }); };

    // return first and only profile
    res.json(userProfiles[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: `Failed to fetch user profile: ${profileId}`, });
  }
});

// PATCH (update) specific user profile from id
// TODO: add requireAuth back
router.patch("/api/user-profiles/:id", async (req, res) => {
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