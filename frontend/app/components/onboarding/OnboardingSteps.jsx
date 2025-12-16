import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { supabase } from "../../library/supabase.js";
import { apiFetch } from "../../library/apiFetch.js";
import { ONBOARDING_STEPS } from "../../library/onboardingSteps.js";
import LoadingSpinner from "../ui/bits/LoadingSpinner.jsx";
import RadioCard from "../ui/inputs/RadioCard.jsx";
import InputField from "../ui/inputs/InputField.jsx";
import Button from "../ui/buttons/Button.jsx";
import ToggleSwitch from "../ui/buttons/ToggleSwitch.jsx";
import LineUpSubscription from "../LineUpSubscription.jsx";

export default function OnboardingSteps() {
	// start step at user details after initial signup
	// const [step, setStep] = useState(ONBOARDING_STEPS.USER_DETAILS);
	const [step, setStep] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	// stores "musician" or "business"
	const [userType, setUserType] = useState(null);

	useEffect(() => {
		let cancelled = false;

		async function init() {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (cancelled) return;

			// no session - send to signup
			if (!session || error) {
				window.location.href = "/auth?step=signup";
				return;
			}

			// session exists - continue
			try {
				const response = await apiFetch("/api/onboarding-state");
				if (cancelled) return;

				if (response.ok) {
					const data = await response.json();
					setStep(data.onboarding_step || ONBOARDING_STEPS.USER_DETAILS);
					setUserType(data.manage_business ? "business" : "musician");
				} else if (response.status === 404) {
					setStep(ONBOARDING_STEPS.USER_DETAILS);
				} else {
					setError("Failed to load after checking onboarding state");
				}
			} catch (error) {
				console.error(error);
				setError("Failed to load onboarding state in catch block");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		init();
		return () => {
			cancelled = true;
		};
	}, []);

	const nextStep = async (payload = {}) => {
		if (step === ONBOARDING_STEPS.USER_DETAILS) {
			// store locally
			setStep(ONBOARDING_STEPS.USER_SELECTION);
			return;
		}

		if (step === ONBOARDING_STEPS.USER_SELECTION) {
			const manage_business = !!payload.manage_business;
			setUserType(manage_business ? "business" : "musician");
			if (manage_business) {
				setStep(ONBOARDING_STEPS.BUSINESS_DETAILS);
			} else {
				setStep(ONBOARDING_STEPS.LOOKING_FOR);
			}
			return;
		}

		if (step === ONBOARDING_STEPS.LOOKING_FOR) {
			setStep(ONBOARDING_STEPS.LINE_UP_PRO);
			return;
		}

		if (
			step === ONBOARDING_STEPS.BUSINESS_DETAILS ||
			step === ONBOARDING_STEPS.LINE_UP_PRO
		) {
			await finishOnboarding();
		}
	};

	const skip = async () => {
		if (step === ONBOARDING_STEPS.LINE_UP_PRO) {
			await finishOnboarding();
			return;
		}
		// generic skip advances
		nextStep();
	};

	const finishOnboarding = async () => {
		setLoading(true);
		try {
			await apiFetch("/api/onboarding-step", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ step: "finished" }),
			});
			// is apifetch throwing before catch?
			console.log("after fetch");
			window.location.href = "/";
		} catch (error) {
			console.error(error);
			setError("Failed to finish onboarding");
			setLoading(false);
		}
	};

	if (loading) return <LoadingSpinner />;
	if (error) return <div className="error-message">{error}</div>;
	if (step === ONBOARDING_STEPS.FINISHED) return <Navigate to="/" replace />;

	return (
		<section className="onboarding-container">
			{step === ONBOARDING_STEPS.USER_DETAILS && (
				<UserDetails onContinue={(data) => nextStep(data)} />
			)}
			{step === ONBOARDING_STEPS.USER_SELECTION && (
				<UserSelection
					onContinue={(manage_business) =>
						nextStep({ manage_business: manage_business })
					}
				/>
			)}
			{step === ONBOARDING_STEPS.BUSINESS_DETAILS &&
				userType === "business" && (
					<BusinessDetails onContinue={finishOnboarding} />
				)}
			{step === ONBOARDING_STEPS.LOOKING_FOR && userType === "musician" && (
				<LookingFor onContinue={nextStep} onSkip={skip} />
			)}
			{step === ONBOARDING_STEPS.LINE_UP_PRO && (
				<LineUpPro onContinue={finishOnboarding} onSkip={finishOnboarding} />
			)}
		</section>
	);
}

export function UserDetails({ onContinue }) {
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const formData = new FormData(e.target);

		const payload = {
			first_name: formData.get("firstName"),
			last_name: formData.get("lastName"),
			phone: formData.get("phone"),
			city: formData.get("location"),
			birth_year: String(formData.get("yearOfBirth")),
		};

		// validation
		const { first_name, last_name, phone, birth_year, city } = payload;

		if (!first_name || !last_name || !phone || !birth_year || !city) {
			setError("All fields are required");
			setIsSubmitting(false);
			return;
		}

		if (birth_year.length !== 4) {
			setError("Year of birth must be 4 digits");
			setIsSubmitting(false);
			return;
		}

		// submit
		try {
			const response = await apiFetch("/api/signup/user-details", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Something went wrong");
				setIsSubmitting(false);
				return;
			}

			// continue to next onboarding step
			onContinue();
			setIsSubmitting(false);
			return { success: true };
		} catch (error) {
			console.error(error);
			setError("Network error");
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="auth-form">
			{/* input field for first name */}
			<InputField
				type="text"
				id="firstName"
				name="firstName"
				label="First name"
				showLabel={true}
				required
				placeholder="Enter your first name"
				minLength={2}
			/>
			{/* input field for last name */}
			<InputField
				type="text"
				id="lastName"
				name="lastName"
				label="Last name"
				showLabel={true}
				required
				placeholder="Enter your last name"
				minLength={2}
			/>
			{/* input field for phone number */}
			<InputField
				type="tel"
				id="phone"
				name="phone"
				label="Phone number"
				showLabel={true}
				required
				placeholder="Phone number"
				minLength={8}
			/>
			{/* input field for year of birth */}
			<InputField
				type="number"
				id="yearOfBirth"
				name="yearOfBirth"
				label="Year of birth"
				showLabel={true}
				required
				placeholder="Enter your year of birth"
				minLength={4}
				maxLength={4}
			/>
			{/* input field for location */}
			<InputField
				type="text"
				id="location"
				name="location"
				label="Location"
				showLabel={true}
				required
				placeholder="Enter your city"
			/>
			{/* // TODO: design error message */}
			{error && <div className="error-message">{error}</div>}
			<div className="flex justify-center">
				<button className="btn-primary" type="submit" disabled={isSubmitting}>
					{isSubmitting ?
						<>
							Continue <LoadingSpinner />
						</>
					:	"Continue"}
				</button>
			</div>
		</form>
	);
}

export function UserSelection({ onContinue }) {
	const [choice, setChoice] = useState("musician"); // "musician" or "business"
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		setError(null);

		// validation
		if (!choice) {
			setError("Please select an option");
			return;
		}

		setIsSubmitting(true);

		const payload = {
			manage_business: choice === "business",
		};

		try {
			const response = await apiFetch("/api/signup/user-selection", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Something went wrong");
				setIsSubmitting(false);
				return;
			}

			// continue to next step
			onContinue(choice === "business");
			return { success: true };
		} catch (error) {
			console.error(error);
			setError("Network error updating user selection");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="auth-form">
			<img
				src="https://plus.unsplash.com/premium_photo-1758836220128-533dcee38fa2?q=80&w=1211&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="LineUp Logo"
				className="element-xs flex justify-center"
			/>
			<div className="choice flex-clm justify-center">
				<RadioCard
					value="musician"
					selected={choice}
					onChange={setChoice}
					variant="vertical"
					title="I am a musician"
					subtitle="I am a musician looking for collaborations and services"
				/>
				<RadioCard
					value="business"
					selected={choice}
					onChange={setChoice}
					variant="vertical"
					title="Not a musician"
					subtitle="I want to provide services for musicians"
				/>
			</div>
			{error && <div className="error-message">{error}</div>}
			<div className="flex justify-center">
				<Button
					className="btn-primary"
					onClick={handleSubmit}
					disabled={isSubmitting || !choice}
				>
					{isSubmitting ?
						<>
							Continue <LoadingSpinner />
						</>
					:	"Continue"}
				</Button>
			</div>
		</div>
	);
}

// TODO: create db connection
// temporary setup using localStorage for testing
export function LookingFor({ onContinue, onSkip }) {
	const [selectedOption, setSelectedOption] = useState(() => {
		return localStorage.getItem("temp_looking_for") || null;
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const options = [
		{ id: "connect", label: "Connect to fellow musicians" },
		{ id: "promote", label: "Promote my music" },
		{ id: "band", label: "Find a band to play with" },
		{ id: "services", label: "Find services for my music" },
	];

	const handleSubmit = async () => {
		if (!selectedOption) {
			setError("Please select an option");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		// save to localStorage
		localStorage.setItem("temp_looking_for", selectedOption);

		try {
			// TODO: implement looking for endpoint and backend handling
			// const response = await apiFetch("/api/onboarding/looking-for", {
			//   method: "PATCH",
			//   headers: { "Content-Type": "application/json" },
			//   body: JSON.stringify({ looking_for: selectedOption }),
			// });

			// if (!response.ok) {
			//   const data = await response.json();
			//   setError(data.error || "Something went wrong");
			//   setIsSubmitting(false);
			//   return;
			// }

			// continue to next step
			onContinue();
		} catch (error) {
			console.error(error);
			setError("Network error");
			setIsSubmitting(false);
		}
	};

	const handleSkip = async () => {
		localStorage.removeItem("temp_looking_for");
		onSkip();
		// setIsSubmitting(true);
		// setError(null);

		// try {
		//   const response = await apiFetch("/api/onboarding/looking-for", {
		//     method: "PATCH",
		//     headers: { "Content-Type": "application/json" },
		//     body: JSON.stringify({ looking_for: null }),
		//   });

		//   if (!response.ok) {
		//     const data = await response.json();
		//     setError(data.error || "Something went wrong");
		//     setIsSubmitting(false);
		//     return;
		//   }

		//   onContinue();
		// } catch (error) {
		//   console.error(error);
		//   setError("Network error");
		//   setIsSubmitting(false);
		// }
	};

	return (
		<div className="auth-form spacing-4">
			<h2 className="l-heading looking-for">I am looking to</h2>
			<div className="spacing-2 flex-clm justify-center gap-1">
				{options.map((option) => (
					<RadioCard
						key={option.id}
						value={option.id}
						selected={selectedOption}
						onChange={setSelectedOption}
						variant="horizontal"
						title={option.label}
					/>
				))}
			</div>
			{error && <div className="error-message">{error}</div>}
			<div className="flex justify-center">
				<Button
					className="btn-primary"
					onClick={handleSubmit}
					disabled={isSubmitting || !selectedOption}
				>
					{isSubmitting ?
						<>
							Continue <LoadingSpinner />
						</>
					:	"Continue"}
				</Button>
			</div>
			<button
				className="btn-skip flex justify-center spacing-1"
				onClick={handleSkip}
				disabled={isSubmitting}
			>
				Skip for now
			</button>
		</div>
	);
}

export function BusinessDetails({ onContinue }) {
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRemote, setIsRemote] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const formData = new FormData(e.target);

		const payload = {
			name: formData.get("name"),
			phone: formData.get("phone"),
			location: isRemote ? null : formData.get("location"),
			is_remote: isRemote,
		};

		// validation
		const { name, phone, location } = payload;

		if (!name || !phone) {
			setError("Name and phone are required");
			setIsSubmitting(false);
			return;
		}

		if (!isRemote && !location) {
			setError("Location is required if not remote");
			setIsSubmitting(false);
			return;
		}

		// submit
		try {
			const response = await apiFetch("/api/businesses", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Something went wrong");
				setIsSubmitting(false);
				return;
			}

			// continue to next onboarding step
			setIsSubmitting(false);
			onContinue();
		} catch (error) {
			console.error(error);
			setError("Network error");
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="auth-form auth-form-business">
			{/* input field for business name */}
			<InputField
				type="text"
				id="name"
				name="name"
				label="Name of your business"
				showLabel={true}
				required
				placeholder="Enter the name of your business"
				minLength={2}
			/>

			{/* input field for phone number */}
			<label htmlFor="phone">Phone number</label>
			<div className="phone-container">
				<p className="country">🇩🇰</p>
				<InputField
					type="tel"
					id="phone"
					name="phone"
					label="Phone number"
					showLabel={false}
					required
					placeholder="Phone number"
					minLength={8}
				/>
			</div>

			<label htmlFor="location">Where are you located</label>
			{/* toggle switch for remote option */}
			<ToggleSwitch label="Remote" onChange={setIsRemote} />

			{/* input field for location - only show when not remote */}
			{!isRemote && (
				<InputField
					type="text"
					id="location"
					name="location"
					label="Where are you located"
					showLabel={false}
					required
					placeholder="Enter your location"
				/>
			)}

			{/* error message */}
			{error && <div className="error-message">{error}</div>}

			<button className="btn-primary" type="submit" disabled={isSubmitting}>
				{isSubmitting ?
					<>
						Continue <LoadingSpinner />
					</>
				:	"Continue"}
			</button>
		</form>
	);
}

export function LineUpPro({ onContinue, onSkip }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  return (
    <div className="auth-form flex-clm justify-center">
      <img src="" alt="LineUp logo" className="element-xl" />
      <h1>Get full access to LineUp</h1>
      <p className="checklist-item">Unlimited collabs</p>
      <p className="checklist-item">unlimited connections</p>
      <p className="checklist-item">Advanced insights</p>
      <p className="checklist-item">See detailed reviews</p>

      <RadioCard
        value="Monthly"
        selected={selectedPlan}
        onChange={setSelectedPlan}
        variant="pricing"
        title="Monthly"
        subtitle="58 kr. / month"
        price="58 kr."
      />
      <RadioCard
        value="Yearly"
        selected={selectedPlan}
        onChange={setSelectedPlan}
        variant="pricing"
        title="Yearly"
        subtitle="29 kr. / month"
        price="348 kr."
        discount="save 50%"
      />
      {/* <LineUpSubscription /> */}
      <Button
        className="btn-primary"
        onClick={onContinue}
        disabled={!selectedPlan}
      >
        Start my 7-day trial
      </Button>

      <p className="xs-text">Terms of use and Privacy Policy</p>

      <button className="btn-skip" onClick={onSkip}>
        Skip for now
      </button>
    </div>
  );
}
