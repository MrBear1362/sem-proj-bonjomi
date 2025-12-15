import { useState } from "react";
import "./ToggleSwitch.css";

export default function ToggleSwitch({ label, onChange }) {
	const [isToggled, setIsToggled] = useState(false);

	const handleToggle = () => {
		const newValue = !isToggled;
		setIsToggled(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};

	return (
		<div className="switchContainer">
			<button
				className={`toggle ${isToggled ? "toggleActive" : ""}`}
				onClick={handleToggle}
				role="switch"
				aria-checked={isToggled}
				aria-label={label}
			>
				<span className="toggleCircle" />
			</button>
			<label className="switchLabel">{label}</label>
		</div>
	);
}
