import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";
import { ONBOARDING_STEPS } from "../onboardingSteps.js";

const router = express.Router();

// create user in users table
router.post("/api/signup", requireAuth, async (req, res) => {
  try {
    const { first_name, last_name, phone, city, birth_year } = req.body;

    // use first step from enum array
    const initialStep = ONBOARDING_STEPS[0]; // "user-details"

    const existing = await sql`
    SELECT 1 FROM users WHERE auth_user_id = ${req.userId} LIMIT 1
    `;

    if (existing.length > 0) {
      // status(409) - conflict with current state of server
      return res.status(409).json({ error: "User already exists" });
    }

    const signup = await sql`
    INSERT INTO users (auth_user_id, first_name, last_name, phone, city, birth_year, onboarding_step)
    VALUES (${req.userId}, ${first_name}, ${last_name}, ${phone}, ${city}, ${birth_year}, ${defaultStep})
    RETURNING auth_user_id, first_name, last_name, phone, city, birth_year, onboarding_step
    `;

    res.status(201).json(signup[0]);
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// patch user in users table
router.patch("/api/signup/user-details", requireAuth, async (req, res) => {
  try {
    const { first_name, last_name, phone, city, birth_year } = req.body;

    const nextStep = "user-selection";
    if (!ONBOARDING_STEPS.includes(nextStep)) {
      return res
        .status(500)
        .json({ error: "Invalid onboarding configuration" });
    }

    const updated = await sql`
    UPDATE users
    SET
      first_name = COALESCE(${first_name}, first_name),
      last_name = COALESCE(${last_name}, last_name),
      phone = COALESCE(${phone}, phone),
      city = COALESCE(${city}, city),
      birth_year = COALESCE(${birth_year}, birth_year),
      onboarding_step = ${nextStep}
    WHERE auth_user_id = ${req.userId}
    RETURNING auth_user_id, first_name, last_name, phone, city, birth_year, onboarding_step
    `;

    // old error handling
    // if (updated.length === 0) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    // new attempt at failsafe
    if (updated.length === 0) {
      // user row doesnt exist, create with provided data from user details
      const created = await sql`
      INSERT INTO users (auth_user_id, first_name, last_name, phone, city, birth_year, onboarding_step)
      VALUES (${req.userId}, ${first_name}, ${last_name}, ${phone}, ${city}, ${birth_year}, ${nextStep})
      RETURNING auth_user_id, first_name, last_name, phone, city, birth_year, onboarding_step
      `;
      return res.json(created[0]);
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Failed to update user details" });
  }
});

router.patch("/api/signup/user-selection", requireAuth, async (req, res) => {
  try {
    const { manage_business } = req.body;

    const nextStep = manage_business ? "business-details" : "looking-for";

    if (!ONBOARDING_STEPS.includes(nextStep)) {
      return res
        .status(400)
        .json({ error: "Invalid onboarding step transition" });
    }

    const selection = await sql`
    UPDATE users
    SET
      manage_business = COALESCE(${manage_business}, manage_business),
      onboarding_step = ${nextStep}
    WHERE auth_user_id = ${req.userId}
    RETURNING manage_business, onboarding_step;
    `;

    if (selection.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(selection[0]);
  } catch (error) {
    console.error("Error updating user selection:", error);
    res.status(500).json({ error: "Failed to update user selection" });
  }
});

router.get("/api/onboarding-state", requireAuth, async (req, res) => {
  try {
    const user = await sql`
    SELECT
      manage_business,
      onboarding_step
    FROM users
    WHERE auth_user_id = ${req.userId}
    LIMIT 1
    `;

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching onboarding state:", error);
    res.status(500).json({ error: "Failed to fetch onboarding state" });
  }
});

router.patch("/api/onboarding-step", requireAuth, async (req, res) => {
  const { step } = req.body;

  if (!ONBOARDING_STEPS.includes(step)) {
    return res.status(400).json({ error: "Invalid onboarding step" });
  }

  try {
    await sql`
    UPDATE users
    SET onboarding_step = ${step}
    WHERE auth_user_id = ${req.userId}
    `;

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating step:", error);
    res.status(500).json({ error: "Failed to update onboarding step" });
  }
});

export default router;
