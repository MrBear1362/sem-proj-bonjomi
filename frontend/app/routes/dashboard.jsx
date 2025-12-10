import { useNavigate } from "react-router";
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
    const {data: {subscription}} = supabase.auth.onAuthStateChange((e) => {
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
      <h1>This is das Board 👍</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </ProtectedRoute>
  );
}
