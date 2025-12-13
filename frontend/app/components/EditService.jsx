import { Form, useActionData, useLoaderData } from "react-router";
import InputField from "./ui/inputs/InputField.jsx";
import Button from "./ui/buttons/Button.jsx";

/**
 * UpdateServiceForm Component
 *
 * A form for updating an existing service.
 * - Uses React Router Form component for form submission
 * - Pre-populates fields with current service data from loaderData
 * - Handles server-side submission via action function (PATCH request)
 * - Uses custom InputField component for form inputs
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
			<InputField
				type="text"
				id="title"
				name="title"
				label="Title"
				showLabel={true}
				defaultValue={service.title || ""}
			/>

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
			<InputField
				type="text"
				id="location"
				name="location"
				label="Location"
				showLabel={true}
				defaultValue={service.location || ""}
			/>

			{/* Price field - optional, pre-populated */}
			<InputField
				type="text"
				id="price"
				name="price"
				label="Price"
				showLabel={true}
				placeholder="e.g., 100, 100-200, Contact for pricing"
				defaultValue={service.price || ""}
			/>

			{/* Tags field - optional, pre-populated */}
			<InputField
				type="text"
				id="tags"
				name="tags"
				label="Tags"
				showLabel={true}
				placeholder="Comma separated"
				defaultValue={service.tags || ""}
			/>

			{/* Image URL field - optional, pre-populated */}
			<InputField
				type="url"
				id="img_url"
				name="img_url"
				label="Image URL"
				showLabel={true}
				defaultValue={service.img_url || ""}
			/>

			{/* Submit button */}
			<Button className="btn-primary" type="submit">
				Update Service
			</Button>
		</Form>
	);
}
