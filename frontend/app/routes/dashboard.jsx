import ProtectedRoute from "../components/ProtectedRoute";

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
