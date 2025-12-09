import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";
import { ONBOARDING_STEPS } from "../onboardingSteps.js";

const router = express.Router();

router.post("/api/signup", requireAuth, async (req, res) => {
  try {
    const { first_name, last_name, phone, city, birth_year } = req.body;

    const signup = await sql`
    INSERT INTO users (auth_user_id, first_name, last_name, phone, city, birth_year)
    VALUES (${req.userId}, ${first_name}, ${last_name}, ${phone}, ${city}, ${birth_year})
    RETURNING auth_user_id, first_name, last_name, phone, city, birth_year
    `;

    res.status(201).json(signup[0]);
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

router.patch("/api/signup/user-selection", requireAuth, async (req, res) => {
  try {
    const { isBusiness } = req.body;

    const selection = await sql`
    UPDATE users
    SET
    is_business = COALESCE(${isBusiness}, is_business)
    WHERE auth_user_id = ${req.userId}
    RETURNING is_business
    `;

    if (selection.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(selection[0]);
  } catch (error) {
    console.error("Error updating user selection:", error);
    res.status(500).json({error: "Failed to update user selection"});
  }
});

export default router;