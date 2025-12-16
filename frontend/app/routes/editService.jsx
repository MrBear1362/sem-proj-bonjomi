import { redirect, useLoaderData } from "react-router";
import UpdateServiceForm from "../components/EditService.jsx";
import { apiFetch } from "../library/apiFetch.js";

/**
 * EditService Route
 *
 * Allows users to update an existing service.
 * - Fetches current service data before rendering (clientLoader)
 * - Handles PATCH request submission (clientAction)
 * - Redirects to service detail page on success
 */

// Client-side loader: fetches service data before rendering
export async function clientLoader({ params }) {
	// Fetch the current service data from our API
	const serviceResponse = await apiFetch(`/api/services/${params.serviceId}`);

	// Check for 404 - service doesn't exist
	if (serviceResponse.status === 404) {
		throw new Response("Service not found", { status: 404 });
	}

	// Check for other errors
	if (!serviceResponse.ok) {
		throw new Error(`Failed to fetch service: ${serviceResponse.status}`);
	}

	const service = await serviceResponse.json();
	return service;
}

// Client-side action: handles form submission (PATCH request)
export async function clientAction({ request, params }) {
	// Only handle PATCH requests
	if (request.method !== "PATCH") {
		return null;
	}

	try {
		// Extract form data from the request
		const formData = await request.formData();

		// Parse and trim all fields, keeping only non-empty values
		const updateData = {};

		const title = formData.get("title")?.trim();
		if (title) updateData.title = title;

		const content = formData.get("content")?.trim();
		if (content) updateData.content = content;

		const location = formData.get("location")?.trim();
		if (location) updateData.location = location;

		const price = formData.get("price")?.trim();
		if (price) updateData.price = price;

		const tags = formData.get("tags")?.trim();
		if (tags) updateData.tags = tags;

		const img_url = formData.get("img_url")?.trim();
		if (img_url) updateData.img_url = img_url;

		// Check if at least one field was provided
		if (Object.keys(updateData).length === 0) {
			return {
				error: "No fields to update",
			};
		}

		// Send PATCH request to update the service
		const response = await apiFetch(`/api/services/${params.serviceId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updateData),
		});

		// Handle 400 - validation error
		if (response.status === 400) {
			const errorData = await response.json();
			return {
				error: errorData.error || "Validation error",
			};
		}

		// Handle 401 - not authenticated
		if (response.status === 401) {
			return {
				error: "You must be logged in to update a service",
			};
		}

		// Handle 403 - not authorized (don't own this service)
		if (response.status === 403) {
			return {
				error: "You do not have permission to update this service",
			};
		}

		// Handle 404 - service not found
		if (response.status === 404) {
			throw new Response("Service not found", { status: 404 });
		}

		// Handle other errors
		if (!response.ok) {
			return {
				error: "Failed to update service",
			};
		}

		// Success - redirect to the service detail page
		const updatedService = await response.json();
		return redirect(`/services/${updatedService.id}`);
	} catch (error) {
		console.error("Error updating service:", error);
		return {
			error: "Failed to update service",
		};
	}
}

export default function EditService() {
	return <UpdateServiceForm />;
}
