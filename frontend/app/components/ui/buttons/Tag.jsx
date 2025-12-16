import { useState } from "react";
import "./Tag.css";

export default function Tag({
	label = "Tag",
	type = "toggle",
	isActive = false,
	withBorder = false,
	onClick,
}) {
	const [internalActive, setInternalActive] = useState(false);

	const isTagActive = type === "static" ? isActive : internalActive;

	const handleClick = () => {
		if (type === "toggle") {
			setInternalActive(!internalActive);
		} /* else if (type === "controlled" && onClick) {
      onClick();
    } */
	};

	const displayLabel = type === "static" ? `#${label}` : label;

	return (
		<button
			className={`tag ${isTagActive ? "tagActive" : ""} ${withBorder ? "with--border" : ""}`}
			disabled={type === "static"}
			onClick={handleClick}
		>
			{displayLabel}
		</button>
	);
}
