import "./InputField.css";

export default function InputField({
  type = "text",
  id,
  name,
  label,
  showLabel = false,
  required = false,
  placeholder = "",
  minLength,
  autoComplete,
  ...rest // allows extra props
}) {
  return (
    <>
      {label && (
        <label
          htmlFor="{id}"
          className={showLabel ? "" : "sr-only"}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        autoComplete={autoComplete}
        {...rest}
      />
    </>
  )
}
