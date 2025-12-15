import { redirect } from "react-router";
import CreateServiceForm from "../components/CreateServiceForm.jsx";
import { apiFetch } from "../library/apiFetch.js";

/**
 * CLIENT ACTION FUNCTION
 *
 * Handles creation of new services for an authenticated business.
 * Key concepts:
 * 1. FORM SUBMISSION: Extracts data from Form component
 * 2. VALIDATION: Checks required fields before API call
 * 3. AUTHENTICATED REQUEST: Uses apiFetch to include JWT token
 * 4. ERROR HANDLING: Returns error messages or redirects on success
 * 5. REDIRECT: Navigates to new service detail page after creation
 *
 * The action runs:
 * - When a Form with method="post" is submitted
 * - Returns either an error object or a redirect response
 */
export async function clientAction({ request }) {
	try {
		// Extract form data from the submitted Form
		const formData = await request.formData();

		// Parse service data from form
		const serviceData = {
			title: formData.get("title")?.trim(),
			content: formData.get("content")?.trim(),
			location: formData.get("location")?.trim(),
			price: formData.get("price")?.trim(),
			tags: formData.get("tags")?.trim() || null,
			img_url: formData.get("img_url")?.trim() || null,
		};

		// Validate required fields
		if (
			!serviceData.title ||
			!serviceData.content ||
			!serviceData.location ||
			!serviceData.price
		) {
			return { error: "Please fill in all required fields" };
		}

		// Create the service via API
		// apiFetch automatically includes the JWT token and handles the base URL
		const response = await apiFetch(`/api/services`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(serviceData),
		});

		// Check for validation errors (400)
		if (response.status === 400) {
			const error = await response.json();
			return { error: error.error || "Invalid service data" };
		}

		// Check for authorization errors (403)
		if (response.status === 403) {
			const error = await response.json();
			return { error: error.error || "Unauthorized" };
		}

		// Check for other errors
		if (!response.ok) {
			return { error: `Failed to create service: ${response.status}` };
		}

		// Get the created service data
		const data = await response.json();

		// Redirect to the new service detail page
		return redirect(`/services/${data.id}`);
	} catch (error) {
		console.error("Error creating service:", error);
		return { error: error.message || "Failed to create service" };
	}
}

export default function CreateServicePage() {
	return (
		<div className="create-service-page">
			<CreateServiceForm />
		</div>
	);
}
