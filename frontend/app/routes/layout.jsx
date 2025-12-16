import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="app-layout">
      <main className="main-content">
        <Navigation />
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
