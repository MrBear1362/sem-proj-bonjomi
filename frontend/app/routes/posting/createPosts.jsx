import { Outlet, NavLink } from "react-router";

export default function CreatePostsLayout() {
  return (
    <div className="posting-container">
      <nav className="posting-tab-nav flex-row">
        <NavLink
          to=""
          end
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          Note
        </NavLink>

        <NavLink
          to="story"
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          Story
        </NavLink>

        <NavLink
          to="request"
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          Request
        </NavLink>
      </nav>

      <section className="tab-content">
        <Outlet />
      </section>
    </div>
  );
}
