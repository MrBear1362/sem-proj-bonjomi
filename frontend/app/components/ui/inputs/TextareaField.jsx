export default function TextareaField({
  id,
  name,
  label,
  showLabel = false,
  required = false,
  placeholder = "",
  minLenght,
  rows = 4,
  ...rest
}) {
  return (
    <>
      {label && (
        <label htmlFor={id}
          className={showLabel ? "" : "sr-only"}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        minLength={minLenght}
        rows={rows}
        {...rest}
      />
    </>
  );
}