export default function Button({ type = "button", icon: Icon, children, className, ...rest }) {
  return (
    <button type={type} className={`btn ${className || ""}`} {...rest}>
      {Icon && <Icon className="btn-icon" />}
      {children}
    </button>
  );
}