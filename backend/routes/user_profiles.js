import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

// GET all user profiles
router.get("/api/user-profiles", async (req, res) => {
  try {
    // combine users table and user profiles table to get user and name
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
    p.tag_id,
    (SELECT COUNT(*)
    FROM connections c
    WHERE (u.auth_user_id = c.user_id OR c.connection_id = u.auth_user_id) AND c.status = 'connected'
    ) AS connection_count,
    p.created_at,
    p.updated_at
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
router.patch("/api/user-profiles/:id", requireAuth, async (req, res) => {
  // extract profile id from url
  const profileId = req.params.id;
  try {
    // destructure possible update fields
    const { first_name, last_name, alias, bio, image_url, about, tag_id, media_url, instagram_url, twitter_url, youtube_url, tiktok_url, facebook_url } = req.body;

    // update object built dynamically
    const profileUpdates = {};
    const userUpdates = {};

    // validate provided fields (partial update)
    if (first_name !== undefined) {
      const trimmed = first_name.trim();
      if (!trimmed) return res.status(400).json({ error: "First name cannot be empty" });
      userUpdates.first_name = trimmed;
    }

    if (last_name !== undefined) {
      const trimmed = last_name.trim();
      if (!trimmed) return res.status(400).json({ error: "Last name cannot be empty" });
      userUpdates.last_name = trimmed;
    }

    if (alias !== undefined) profileUpdates.alias = alias;
    if (bio !== undefined) profileUpdates.bio = bio;
    if (image_url !== undefined) profileUpdates.image_url = image_url;
    if (about !== undefined) profileUpdates.about = about;
    if (tag_id !== undefined) profileUpdates.tag_id = tag_id;
    if (media_url !== undefined) profileUpdates.media_url = media_url;
    if (instagram_url !== undefined) profileUpdates.instagram_url = instagram_url;
    if (twitter_url !== undefined) profileUpdates.twitter_url = twitter_url;
    if (youtube_url !== undefined) profileUpdates.youtube_url = youtube_url;
    if (tiktok_url !== undefined) profileUpdates.tiktok_url = tiktok_url;
    if (facebook_url !== undefined) profileUpdates.facebook_url = facebook_url;

    // ensure at least one field is provided
    if (
      Object.keys(profileUpdates).length === 0 &&
      Object.keys(userUpdates).length === 0
    ) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    profileUpdates.updated_at = sql`now()`;

    // update name fields
    if (Object.keys(userUpdates).length > 0) {
      await sql`
      UPDATE users
      SET ${sql(userUpdates)}
      WHERE auth_user_id = ${req.userId}
      `;
    }

    // update profile fields
    if (Object.keys(profileUpdates).length > 0) {
      await sql`
      UPDATE user_profiles
      SET ${sql(profileUpdates)}
      WHERE user_id = ${req.userId}
      `;
    }

    // fetch combined update profile to return
    const updated = await sql`
    SELECT
      u.auth_user_id as auth_user_id,
      u.first_name,
      u.last_name,
      p.alias,
      p.bio,
      p.image_url,
      p.about,
      p.tag_id,
      p.media_url,
      p.instagram_url,
      p.twitter_url,
      p.youtube_url,
      p.tiktok_url,
      p.facebook_url,
      p.created_at,
      p.updated_at
    FROM users u
    JOIN user_profiles p ON u.auth_user_id = p.user_id
    WHERE u.auth_user_id = ${req.userId}
    `;

    // if no profile updated, means profile doesn't exist
    if (updated.length === 0) {
      return res.status(404).json({ error: "Profile not found or unauthorised", });
    }

    // return updated profile
    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      error: `Failed to update user profile: ${profileId}`
    })
  }
});

export default router;