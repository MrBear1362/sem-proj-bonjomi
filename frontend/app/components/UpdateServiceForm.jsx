import { Form, useActionData, useLoaderData } from "react-router";
//import "./UpdateServiceForm.css";

/**
 * UpdateServiceForm Component
 *
 * A form for updating an existing service.
 * - Uses React Router Form component for form submission
 * - Pre-populates fields with current service data from loaderData
 * - Handles server-side submission via action function (PATCH request)
 * - Displays error messages from actionData
 * - All fields are optional (only send changed values)
 */
export default function UpdateServiceForm() {
	// Get the current service data from the loader
	const service = useLoaderData();

	// Retrieve error and success data from route action
	const actionData = useActionData();

	return (
		<Form method="patch" className="update-service-form">
			<h2>Update Service</h2>

			{/* Display error message if submission failed */}
			{actionData?.error && (
				<div className="error-message">{actionData.error}</div>
			)}

			{/* Title field - optional, pre-populated */}
			<div className="form-group">
				<label htmlFor="title">Title</label>
				<input
					type="text"
					id="title"
					name="title"
					defaultValue={service.title || ""}
				/>
			</div>

			{/* Description/Content field - optional, pre-populated */}
			<div className="form-group">
				<label htmlFor="content">Description</label>
				<textarea
					id="content"
					name="content"
					defaultValue={service.content || ""}
				/>
			</div>

			{/* Location field - optional, pre-populated */}
			<div className="form-group">
				<label htmlFor="location">Location</label>
				<input
					type="text"
					id="location"
					name="location"
					defaultValue={service.location || ""}
				/>
			</div>

			{/* Price field - optional, pre-populated */}
			<div className="form-group">
				<label htmlFor="price">Price</label>
				<input
					type="text"
					id="price"
					name="price"
					placeholder="e.g., 100, 100-200, Contact for pricing"
					defaultValue={service.price || ""}
				/>
			</div>

			{/* Tags field - optional, pre-populated */}
			<div className="form-group">
				<label htmlFor="tags">Tags</label>
				<input
					type="text"
					id="tags"
					name="tags"
					placeholder="Comma separated"
					defaultValue={service.tags || ""}
				/>
			</div>

			{/* Image URL field - optional, pre-populated */}
			<div className="form-group">
				<label htmlFor="img_url">Image URL</label>
				<input
					type="url"
					id="img_url"
					name="img_url"
					defaultValue={service.img_url || ""}
				/>
			</div>

			{/* Submit button */}
			<button type="submit">Update Service</button>
		</Form>
	);
}
