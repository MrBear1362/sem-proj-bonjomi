import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

// Import all CSS files individually with ?url
import appStylesHref from "./app.css?url";
import layoutStylesHref from "./layout.css?url";
import authPageStylesHref from "./authPage.css?url";
import loadingSpinnerStylesHref from "./components/ui/bits/loading-spinner.css?url";
import userIdentifierStylesHref from "./components/ui/bits/user-identifier.css?url";
import bookmarkStylesHref from "./components/ui/buttons/Bookmark.css?url";
import buttonStylesHref from "./components/ui/buttons/button.css?url";
import commentBtnStylesHref from "./components/ui/buttons/Comment.css?url";
import likeStylesHref from "./components/ui/buttons/Like.css?url";
import tagStylesHref from "./components/ui/buttons/Tag.css?url";
import toggleStylesHref from "./components/ui/buttons/ToggleSwitch.css?url";
import inputStylesHref from "./components/ui/inputs/input.css?url";
import radioCardStylesHref from "./components/ui/inputs/radio-card.css?url";
import collabCardStylesHref from "./components/CollabCard.css?url";
import commentSectionStylesHref from "./components/CommentSection.css?url";
import footerStylesHref from "./components/Footer.css?url";
import noteCardStylesHref from "./components/NoteCard.css?url";
import serviceStylesHref from "./components/Service.css?url";
import postingStylesHref from "./routes/posting/posting.css?url";
import msgConvStylesHref from "./msg&conv.css?url";
import LoadingSpinner from "./components/ui/bits/LoadingSpinner";

// Single links export
export const links = () => [
  // External fonts first
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" },
  { rel: "stylesheet", href: "https://db.onlinewebfonts.com/c/0976a2619014c5855690b7509fab4c6e?family=Helvetica+Now+Display" },
  // App CSS with global styles (must come first)
  { rel: "stylesheet", href: appStylesHref },
  // Then all component CSS files in order
  { rel: "stylesheet", href: layoutStylesHref },
  { rel: "stylesheet", href: authPageStylesHref },
  { rel: "stylesheet", href: loadingSpinnerStylesHref },
  { rel: "stylesheet", href: userIdentifierStylesHref },
  { rel: "stylesheet", href: bookmarkStylesHref },
  { rel: "stylesheet", href: buttonStylesHref },
  { rel: "stylesheet", href: commentBtnStylesHref },
  { rel: "stylesheet", href: likeStylesHref },
  { rel: "stylesheet", href: tagStylesHref },
  { rel: "stylesheet", href: toggleStylesHref },
  { rel: "stylesheet", href: inputStylesHref },
  { rel: "stylesheet", href: radioCardStylesHref },
  { rel: "stylesheet", href: collabCardStylesHref },
  { rel: "stylesheet", href: commentSectionStylesHref },
  { rel: "stylesheet", href: footerStylesHref },
  { rel: "stylesheet", href: noteCardStylesHref },
  { rel: "stylesheet", href: serviceStylesHref },
  { rel: "stylesheet", href: postingStylesHref },
  { rel: "stylesheet", href: msgConvStylesHref },
];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <div className="hydrate-loading">Loading <LoadingSpinner /></div>;
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
