import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    index("routes/feed.jsx"),
    /*     route("feed", "routes/feed.jsx"), */
  ]),
  // authentication routes outside main layout
  route("auth", "routes/authPage.jsx"),
  // Service routes
  route("services", "routes/servicePage.jsx"),
  route("services/create", "routes/createService.jsx"),
  route("services/:serviceId", "routes/service.jsx", [
    route("edit", "routes/editService.jsx"),
  ]),
  // Feed
  /*  route("feed", "routes/feed.jsx"), */
];
