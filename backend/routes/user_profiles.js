const express = require('express');
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
  } catch (error) {
    console.error("Failed fetching user profiles:", error);
  }
})

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