import express from "express";
import sql from "../db.js";
import { requireAuth } from "../auth.js";
const router = express.Router();

// API endpoints for services

/* ---------- GET routes ---------- */

// GET all services
router.get("/api/services", async (req, res) => {
	try {
		// Execute SQL query using the sql`` tagged template
		const services = await sql`
			SELECT id, title, content, location, price, tags, img_url, business_id, tag_id
			FROM services
		`;

		// Return the threads as JSON
		// Express automatically sets Content-Type: serverlication/json
		res.status(200).json(services);
	} catch (error) {
		// Log the error for debugging (you should see this in the terminal)
		console.error("Error fetching services", error);

		// Return a generic error message to the client
		// Don't expose internal error details for security
		res.status(500).json({
			error: "Failed to fetch services from database",
		});
	}
});

// GET specific service using id
router.get("/api/services/:id", async (req, res) => {
	try {
		// Extract the services ID from the URL
		// For /api/services/123 req.params.id will be "123"
		const serviceId = req.params.id;

		// Execute SQL query with WHERE clause for auth_user_id
		// The ${servicesId} is safely parameterized by the postgres library
		const services = await sql`
			SELECT id, title, content, location, price, tags, img_url, business_id, tag_id
			FROM services
			WHERE id = ${serviceId}
		`;

		// Check if services was found
		// SQL returns an empty array if no matches (either doesn't exist or not owned by user)
		// We return 404 in both cases to avoid leaking information about other users' services
		if (services.length === 0) {
			return res.status(404).json({
				error: "Service not found",
			});
		}
		// Return the first (and only) services
		res.status(200).json(services[0]);
	} catch (error) {
		// Log the error for debugging (you should see this in the terminal)
		console.error("Error fetching service", error);

		// Return a generic error message to the client
		// Don't expose internal error details for security
		res.status(500).json({
			error: "Failed to fetch service from database",
		});
	}
});

// GET all services from specific business
router.get("/api/businesses/:id/services", requireAuth, async (req, res) => {
	try {
		const businessId = req.params.id;

		const services = await sql`
            SELECT id, title, content, location, price, tags, img_url, business_id, tag_id
            FROM services
            WHERE business_id = ${businessId}
        `;

		res.status(200).json(services);
	} catch (error) {
		console.error("Error fetching services for business", error);
		res.status(500).json({
			error: "Failed to fetch services from database",
		});
	}
});

/* ---------- POST routes ---------- */

// POST new service to database
router.post("/api/businesses/:id/services", requireAuth, async (req, res) => {
	try {
		const businessId = req.params.id;
		const { title, content, location, price, tags, img_url, tag_id } = req.body;

		// Validate required fields
		if (!title || !content || !location || !price) {
			return res.status(400).json({
				error: "Missing required fields: title, content, location, price",
			});
		}

		// Verify the authenticated user owns this business
		if (req.user.business_id !== parseInt(businessId)) {
			return res.status(403).json({
				error:
					"Unauthorized: You can only create services for your own business",
			});
		}

		// Insert new service into database
		const result = await sql`
            INSERT INTO services (title, content, location, price, tags, img_url, business_id, tag_id)
            VALUES (${title}, ${content}, ${location}, ${price}, ${
			tags || null
		}, ${img_url || null}, ${businessId}, ${tag_id || null})
            RETURNING id, title, content, location, price, tags, img_url, business_id, tag_id
        `;

		res.status(201).json(result[0]);
	} catch (error) {
		console.error("Error creating service:", error);
		res.status(500).json({
			error: "Failed to create service",
		});
	}
});

//

/* ---------- PATCH routes ---------- */

// PATCH specific service using id
router.patch("/api/services/:id", requireAuth, async (req, res) => {
	try {
		const serviceId = req.params.id;
		const { title, content, location, price, tags, img_url } = req.body;

		// Check if at least one field is provided
		if (!title && !content && !location && !price && !tags && !img_url) {
			return res.status(400).json({
				error: "No fields to update",
			});
		}

		// Update the service
		// WHERE clause includes BOTH id AND business_id for authorization
		// This ensures users can only update services owned by their business
		const result = await sql`
            UPDATE services
            SET title = ${title || sql`title`}, 
                content = ${content || sql`content`}, 
                location = ${location || sql`location`}, 
                price = ${price || sql`price`}, 
                tags = ${tags || null}, 
                img_url = ${img_url || null}
            WHERE id = ${serviceId} AND business_id = ${req.user.business_id}
            RETURNING id, title, content, location, price, tags, img_url, business_id, tag_id
        `;

		// If no service was updated, it means the service doesn't exist or user doesn't own it
		// We return 404 in both cases to avoid leaking information
		if (result.length === 0) {
			return res.status(404).json({
				error: "Service not found",
			});
		}

		res.status(200).json(result[0]);
	} catch (error) {
		console.error("Error updating service:", error);
		res.status(500).json({
			error: "Failed to update service",
		});
	}
});

/* ---------- DELETE routes ---------- */

// DELETE specific service using id
router.delete("/api/services/:id", requireAuth, async (req, res) => {
	try {
		// Extract service ID from the URL parameters
		const serviceId = req.params.id;

		// Delete the service from the database
		// WHERE clause includes BOTH id AND business_id for authorization
		// This ensures users can only delete services owned by their business
		const result = await sql`
            DELETE FROM services
            WHERE id = ${serviceId} AND business_id = ${req.user.business_id}
            RETURNING id
        `;

		// If no service was deleted, it means the service doesn't exist or user doesn't own it
		// We return 404 in both cases to avoid leaking information
		if (result.length === 0) {
			return res.status(404).json({
				error: "Service not found",
			});
		}

		// Return success message
		res.json({
			message: "Service deleted successfully",
			deletedId: result[0].id,
		});
	} catch (error) {
		console.error("Error deleting service:", error);
		res.status(500).json({
			error: "Failed to delete service",
		});
	}
});

export default router;
