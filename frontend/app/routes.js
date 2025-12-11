import { index, route } from "@react-router/dev/routes";

export default [
	route("/", "routes/layout.jsx", [index("routes/dashboard.jsx")]),
	// authentication routes outside main layout
	route("auth", "routes/authPage.jsx"),
	// styleguide - no auth, outside main layout
	route("styleguide", "routes/styleguide.jsx"),
	// Service routes
	route("services", "routes/servicePage.jsx"),
	route("services/create", "routes/createService.jsx"),
	route("services/:serviceId", "routes/service.jsx"),
	route("services/:serviceId/edit", "routes/editService.jsx"),
];
