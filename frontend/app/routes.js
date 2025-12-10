import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [index("routes/home.jsx")]),
  route("/messages", "routes/messages-list.jsx"),
  route("/messages/:conversationId", "routes/conversation-thread.jsx"),
];
