import express from "express";
import sql from "../db.js";

const router = express.Router();

// get all user profiles
router.get("/api/user-profiles", async (req, res) => {
  try {
    // combine users tabel and user profiles table to get user and name
    const userProfiles = await sql`
    SELECT
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

router.get("/api/user-profiles/:id", async (req, res) => {
  try {

  } catch (error) {

  }
});

router.patch("/api/user-profiles/:id", async (req, res) => {
  try {

  } catch (error) {

  }
});

export default router;