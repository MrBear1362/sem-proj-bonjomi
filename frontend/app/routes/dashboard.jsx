import { useNavigate, NavLink } from "react-router";
import { useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../library/supabase";
import Button from "../components/ui/buttons/Button";

export function meta({ }) {
  return [
    { title: "LineUp - Find your place in the LineUp" },
    { name: "description", content: "Welcome to LineUp!" },
  ];
}

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_OUT") {
        navigate("/auth?step=login");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ProtectedRoute>
      <header className="dashboard-header">Linup [search icon] | [search icon] | [notification icon] | [burgermenu icon]</header>

      <div>
        <h1>This is das Board 👍</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <section className="stories-container">There are stories here</section>

      <section className="collab-requests-container">
        <h5>Collaboration requests</h5>
        <section className="collab-feed"></section>
      </section>

      <section className="notes-feed-container">
        <h3>Notes feed is here</h3>
      </section>

      <button >
        <NavLink to="create-posts">
          Create +
        </NavLink>
      </button>
    </ProtectedRoute>
  );
}
