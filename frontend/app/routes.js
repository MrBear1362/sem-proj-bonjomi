  import { index, route } from "@react-router/dev/routes";

  export default [
    route("/", "routes/layout.jsx", [
      index("routes/dashboard.jsx"),
    ]),
    // authentication routes outside main layout
    route("auth", "routes/authPage.jsx"),
  ];
