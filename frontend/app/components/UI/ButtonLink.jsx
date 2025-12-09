import { Link } from "react-router";
import "./Buttons.css";

export default function ButtonLink({ to, query, icon: Icon, children, className }) {
  // construct URL with query params
  const url = query ? `${to}?${new URLSearchParams(query).toString()}` : to;

  return (
    <Link to={url} className={`btn ${className || ""}`}>
      {Icon && <Icon className="btn-icon" />}
      {children}
    </Link>
  );
}