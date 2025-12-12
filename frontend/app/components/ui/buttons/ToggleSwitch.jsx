import { useState } from "react";
import styles from "./ToggleSwitch.module.css";

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
		<div className={styles.switchContainer}>
			<button
				className={`${styles.toggle} ${isToggled ? styles.toggleActive : ""}`}
				onClick={handleToggle}
				role="switch"
				aria-checked={isToggled}
				aria-label={label}
			>
				<span className={styles.toggleCircle} />
			</button>
			<label className={styles.switchLabel}>{label}</label>
		</div>
	);
}
