import { useLoaderData } from "react-router";
import { ServicePreviewCard } from "../components/Service.jsx";
import { apiFetch } from "../library/apiFetch.js";

/**
 * ServicePage Route
 *
 * Main page displaying all available services.
 * - Fetches all services from the backend
 * - Renders a grid of ServicePreviewCard components
 * - Each card is clickable to view full details
 */

// Client-side loader: fetches all services before rendering
export async function clientLoader() {
	// Make the request to our custom API with authentication
	// apiFetch automatically includes the JWT token in the Authorization header
	// and constructs the full URL from the API base URL + path
	const response = await apiFetch("/api/services");

	// Check if the request was successful
	if (!response.ok) {
		throw new Error(`Failed to fetch services: ${response.status}`);
	}
	// Parse the JSON response
	const services = await response.json();

	return services;
}

export default function ServicePage() {
	const services = useLoaderData();

	return (
		<div className="services-grid">
			{services.map((service) => (
				<ServicePreviewCard key={service.id} service={service} />
			))}
		</div>
	);
}
