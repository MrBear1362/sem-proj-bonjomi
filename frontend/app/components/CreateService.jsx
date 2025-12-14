import { Form, useActionData } from "react-router";
import InputField from "./ui/inputs/InputField.jsx";
import Button from "./ui/buttons/Button.jsx";
import "./Service.css";

/**
 * CreateServiceForm Component
 *
 * A form for creating new services for a business.
 * - Uses React Router Form component for form submission
 * - Handles server-side submission via action function
 * - Uses custom InputField component for form inputs
 * - Displays error messages from actionData
 * - Renders form fields with required validation
 */
export default function CreateServiceForm() {
	// Retrieve error and success data from route action
	const actionData = useActionData();

	return (
		<Form method="post" className="update-service-form">
			<h2>Create New Service</h2>

			{/* Display error message if submission failed */}
			{actionData?.error && (
				<div className="error-message">{actionData.error}</div>
			)}

			{/* Title field */}
			<InputField
				type="text"
				id="title"
				name="title"
				label="Title"
				showLabel={true}
				placeholder="Service title"
				required
			/>

			{/* Description/Content field */}
			<div className="form-group">
				<label htmlFor="content">Description</label>
				<textarea
					id="content"
					name="content"
					placeholder="Service description"
					required
				/>
			</div>

			{/* Location field */}
			<InputField
				type="text"
				id="location"
				name="location"
				label="Location"
				showLabel={true}
				placeholder="City or location"
				required
			/>

			{/* Price field - accepts any text format */}
			<InputField
				type="text"
				id="price"
				name="price"
				label="Price"
				showLabel={true}
				placeholder="e.g., 100, 100-200, Contact for pricing"
				required
			/>

			{/* Tags field - optional */}
			<InputField
				type="text"
				id="tags"
				name="tags"
				label="Tags"
				showLabel={true}
				placeholder="Comma separated"
			/>

			{/* Image URL field - optional */}
			<InputField
				type="url"
				id="img_url"
				name="img_url"
				label="Image URL"
				showLabel={true}
				placeholder="https://example.com/image.jpg"
			/>

			{/* Submit button - automatically handles loading state via Form */}
			<Button className="btn-primary" type="submit">
				Create Service
			</Button>
		</Form>
	);
}
