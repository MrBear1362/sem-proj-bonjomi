import { Form, useActionData } from "react-router";
//import "./CreateServiceForm.css";

/**
 * CreateServiceForm Component
 *
 * A form for creating new services for a business.
 * - Uses React Router Form component for form submission
 * - Handles server-side submission via action function
 * - Displays error messages from actionData
 * - Renders form fields with required validation
 */
export default function CreateServiceForm() {
	// Retrieve error and success data from route action
	const actionData = useActionData();

	return (
		<Form method="post" className="create-service-form">
			<h2>Create New Service</h2>

			{/* Display error message if submission failed */}
			{actionData?.error && (
				<div className="error-message">{actionData.error}</div>
			)}

			{/* Title field */}
			<div className="form-group">
				<label htmlFor="title">Title</label>
				<input type="text" id="title" name="title" required />
			</div>

			{/* Description/Content field */}
			<div className="form-group">
				<label htmlFor="content">Description</label>
				<textarea id="content" name="content" required />
			</div>

			{/* Location field */}
			<div className="form-group">
				<label htmlFor="location">Location</label>
				<input type="text" id="location" name="location" required />
			</div>

			{/* Price field - accepts any text format */}
			<div className="form-group">
				<label htmlFor="price">Price</label>
				<input
					type="text"
					id="price"
					name="price"
					placeholder="e.g., 100, 100-200, Contact for pricing"
					required
				/>
			</div>

			{/* Tags field - optional */}
			<div className="form-group">
				<label htmlFor="tags">Tags</label>
				<input
					type="text"
					id="tags"
					name="tags"
					placeholder="Comma separated"
				/>
			</div>

			{/* Image URL field - optional */}
			<div className="form-group">
				<label htmlFor="img_url">Image URL</label>
				<input type="url" id="img_url" name="img_url" />
			</div>

			{/* Submit button - automatically handles loading state via Form */}
			<button type="submit">Create Service</button>
		</Form>
	);
}
