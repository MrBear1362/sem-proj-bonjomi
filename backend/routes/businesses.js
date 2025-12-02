import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";
const router = express.Router();

// API endpoints for businesses

/* ---------- GET routes ---------- */

// GET all businesses
router.get("/api/businesses", async (req, res) => {
	try {
		// Execute SQL query using the sql`` tagged template
		const businesses = await sql`
			SELECT auth_user_id, name, phone, is_remote, location
			FROM businesses
		`;

		// Return the threads as JSON
		// Express automatically sets Content-Type: serverlication/json
		res.status(200).json(businesses);
	} catch (error) {
		// Log the error for debugging (you should see this in the terminal)
		console.error("Error fetching businesses", error);

		// Return a generic error message to the client
		// Don't expose internal error details for security
		res.status(500).json({
			error: "Failed to fetch businesses from database",
		});
	}
});

// GET specific business using id
router.get("/api/businesses/:id", async (req, res) => {
	try {
		// Extract the business ID from the URL
		// For /api/businesses/123 req.params.id will be "123"
		const businessId = req.params.id;

		// Execute SQL query with WHERE clause for auth_user_id
		// The ${businessId} is safely parameterized by the postgres library
		const businesses = await sql`
			SELECT auth_user_id, name, phone, is_remote, location
			FROM businesses
			WHERE auth_user_id = ${businessId}
		`;

		// Check if business was found
		// SQL returns an empty array if no matches (either doesn't exist or not owned by user)
		// We return 404 in both cases to avoid leaking information about other users' businesses
		if (businesses.length === 0) {
			return res.status(404).json({
				error: "Business not found",
			});
		}
		// Return the first (and only) business
		res.status(200).json(businesses[0]);
	} catch (error) {
		// Log the error for debugging (you should see this in the terminal)
		console.error("Error fetching business", error);

		// Return a generic error message to the client
		// Don't expose internal error details for security
		res.status(500).json({
			error: "Failed to fetch business from database",
		});
	}
});

/* ---------- PATCH routes ---------- */

// PATCH specific business using id
router.patch("/api/businesses/:id", requireAuth, async (req, res) => {
	try {
		const businessId = req.params.id;
		const { name, phone, is_remote, location } = req.body;

		// Check if at least one field is provided
		if (!name && !phone && is_remote === undefined && !location) {
			return res.status(400).json({
				error: "No fields to update",
			});
		}

		// Authorization: verify the authenticated user owns this business
		if (req.user.id !== businessId) {
			return res.status(404).json({
				error: "Business not found",
			});
		}

		// Update the business
		const result = await sql`
            UPDATE businesses
            SET name = ${name || sql`name`},
                phone = ${phone || sql`phone`},
                is_remote = ${
									is_remote !== undefined ? is_remote : sql`is_remote`
								},
                location = ${location || sql`location`}
            WHERE auth_user_id = ${businessId}
            RETURNING auth_user_id, name, phone, is_remote, location
        `;

		// If no business was updated, it means the business doesn't exist or user doesn't own it
		// We return 404 in both cases to avoid leaking information
		if (result.length === 0) {
			return res.status(404).json({
				error: "Business not found",
			});
		}

		res.status(200).json(result[0]);
	} catch (error) {
		console.error("Error updating business:", error);
		res.status(500).json({
			error: "Failed to update business",
		});
	}
});

export default router;
