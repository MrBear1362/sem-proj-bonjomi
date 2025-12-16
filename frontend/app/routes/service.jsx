import { useLoaderData } from "react-router";
import { ServiceCard } from "../components/Service.jsx";
import { apiFetch } from "../library/apiFetch.js";

/**
 * ServiceDetail Route
 *
 * Displays the full details of a single service.
 * - Fetches service data based on URL parameter (service ID)
 * - Renders the ServiceDetailCard component with fetched data
 */

// Client-side loader: fetches service data before rendering
export async function clientLoader({ params }) {
	// Fetch service metadata from our API with authentication
	// apiFetch handles the base URL and adds the JWT token
	const serviceResponse = await apiFetch(`/api/services/${params.serviceId}`);

	// Check for 404 specifically - service doesn't exist
	if (serviceResponse.status === 404) {
		throw new Response("Service not found", { status: 404 });
	}

	// Check for other errors
	if (!serviceResponse.ok) {
		throw new Error(`Failed to fetch service: ${serviceResponse.status}`);
	}

	// Our API returns the service object directly (not in an array)
	const service = await serviceResponse.json();

	return service;
}

export default function ServiceDetail() {
	const service = useLoaderData();
	return <ServiceCard service={service} mode="detail" />;
}
