import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [index("routes/dashboard.jsx")]),
  // authentication routes outside main layout
  route("auth", "routes/authPage.jsx"),
  // styleguide - no auth, outside main layout
  route("styleguide", "routes/styleguide.jsx"),
  route("/messages", "routes/messages-list.jsx"),
  route("/messages/:conversationId", "routes/conversation-thread.jsx"),
];
