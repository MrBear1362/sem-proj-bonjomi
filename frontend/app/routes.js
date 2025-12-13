import { index, route } from "@react-router/dev/routes";

export default [
	route("/", "routes/layout.jsx", [
		index("routes/dashboard.jsx"),
		// create posts route with nested tabs
		route("create-posts", "routes/posting/createPosts.jsx", [
			index("routes/posting/CreateNote.jsx"),
			route("story", "routes/posting/CreateStory.jsx"),
			route("request", "routes/posting/CreateRequest.jsx"),
		]),
		route("posts/:requestId", "routes/posts/collabRequest.jsx"),
	]),
	// authentication routes outside main layout
	route("auth", "routes/authPage.jsx"),
	// styleguide - no auth, outside main layout
	route("styleguide", "routes/styleguide.jsx"),
];
