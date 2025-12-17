import { Outlet, useLocation } from "react-router";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";

export default function Layout() {
  const location = useLocation();

  const showNavigation = !location.pathname.startsWith("/messages");
  const isConversationThread = /^\/messages\/[^/]+$/.test(location.pathname);
  const showFooter = !isConversationThread;

  return (
    <div className="app-layout">
      {showNavigation && <Navigation />}
      <main className="main-content">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
