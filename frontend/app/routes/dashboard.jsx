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
  return (
    <ProtectedRoute>
      <h1>This is das Board 👍</h1>
    </ProtectedRoute>
  );
}
