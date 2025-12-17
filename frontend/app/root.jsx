import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import appStylesHref from "./app.css?url";
import testStylesHref from "./msg&conv.css?url";
// import styles
import "./app.css";
import LoadingSpinner from "./components/ui/bits/LoadingSpinner";

// Ensure styles load via <link> tags for stable SSR/CSR hydration
export const links = () => [
  { rel: "stylesheet", href: appStylesHref },
  { rel: "stylesheet", href: testStylesHref },
];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <Scripts />
      </head>
      <body>
        {children}
        <ScrollRestoration />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <div className="hydrate-loading">Loading <LoadingSpinner/></div>;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ width: "100%", padding: 16, overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
