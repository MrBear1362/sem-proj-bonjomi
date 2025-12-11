import { useState } from "react";
import "./ToggleSwitch.css";

export default function ToggleSwitch() {
	const [isToggled, setIsToggled] = useState(false);

	return (
		<button
			className={`toggle ${isToggled ? "toggleActive" : ""}`}
			onClick={() => setIsToggled(!isToggled)}
			role="switch"
			aria-checked={isToggled}
		>
			<span className="toggleCircle" />
		</button>
	);
}
