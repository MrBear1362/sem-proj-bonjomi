export default function RadioCard({
  value,
  selected,
  onChange,
  variant = "vertical", // "vertical" | "horizontal" | "pricing"
  title,
  subtitle,
  price,
  discount,
  children,
}) {

  return (
    <label className={`radio-card radio-${variant} ${selected === value ? "selected" : ""}`}>

      <input
        type="radio"
        hidden
        value={value}
        checked={selected === value}
        onChange={() => onChange(value)}
      />

      {variant === "vertical" && (
        <div className="vertical-wrap">
          <h3>{title}</h3>
          {subtitle && <p className="subtitle">{subtitle}</p>}
          <div className="radio-align">
            <span className="radio-dot" />
          </div>
        </div>
      )}

      {variant === "horizontal" && (
        <div className="horizontal-wrap">
          <span className="radio-dot" />
          <span className="radio-text">{title}</span>
        </div>
      )}

      {variant === "pricing" && (
        <div className="pricing-wrap">
          <div className="col-radio">
            <span className="radio-dot" />
          </div>

          <div className="col-info">
            <h4>{title}</h4>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <div className="col-price">
            <div className="price">{price}</div>
            {discount && <div className="discount-box">{discount}</div>}
          </div>
        </div>
      )}

      {/* fallback slot */}
      {children}
    </label>
  );
}