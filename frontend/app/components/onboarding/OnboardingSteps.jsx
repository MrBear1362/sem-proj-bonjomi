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
		<section className="onboarding-container flex-clm">
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
		<form onSubmit={handleSubmit} className="auth-form flex-clm">
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
						: "Continue"}
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
		<div className="auth-form flex-clm">
			<div className="logo-container element-xs flex justify-center">
				<svg width="47" height="30" viewBox="0 0 47 30" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M8.66895 0C13.6554 0.000107772 16.6054 3.64288 16.6055 9.84473C16.6055 14.4879 14.8523 19.0066 11.8604 22.6494C12.5584 23.0328 13.2985 23.3157 14.0879 23.4824C14.4287 23.5491 14.9936 23.6494 15.6914 23.6494C16.0903 23.6494 16.5058 23.6494 17.0459 23.5244C17.7108 23.366 18.1853 23.108 18.418 22.9746C18.5594 22.8912 18.9913 22.6235 19.4482 22.1484C19.7309 21.8482 20.3045 21.1808 21.0439 19.1309C21.1291 18.8961 21.2177 18.6268 21.3125 18.3271C21.3445 18.1794 21.3796 18.0307 21.417 17.8809L25.7559 0.533203H31.5488L27.1191 18.3223C26.8532 19.4225 26.8367 20.3979 27.0859 21.2314C27.3353 22.0651 27.7839 22.7241 28.4238 23.1992C29.0886 23.6576 29.8863 23.8906 30.8252 23.8906C32.0718 23.8906 33.1361 23.5077 34.0088 22.7324C34.9063 21.9405 35.5133 20.8985 35.8457 19.6064L40.5908 0.533203H46.2012L41.2812 20.29C40.5749 23.1075 39.2532 25.3082 37.3252 26.917C35.4137 28.5008 33.0528 29.293 30.252 29.293H30.2441C28.0417 29.293 26.1796 28.7923 24.667 27.792C24.1197 27.43 23.6315 27.0209 23.2021 26.5654C23.0044 26.7317 22.7947 26.8943 22.5811 27.0586C22.2983 27.2754 21.1019 28.1928 19.1074 28.8096C18.2265 29.0847 17.4782 29.2174 16.9795 29.3008L16.9629 29.293H15.3672C12.2922 29.2929 9.58283 28.3759 7.30566 26.7754C5.75159 27.8173 4.07295 28.6594 2.23633 29.293L0 24.6084C1.23834 24.1249 2.43569 23.4909 3.50781 22.7656C1.48825 19.6896 0.366233 15.6885 0.366211 11.1621C0.366211 4.04311 3.68233 0 8.66895 0ZM8.54395 5.63477C7.26416 5.63486 6.34969 7.23566 6.34961 10.7197C6.34961 13.5623 6.90643 16.1639 7.94531 18.2812C9.62407 15.7972 10.58 12.8794 10.5801 9.83691C10.5801 7.11936 9.82384 5.63477 8.54395 5.63477Z" fill="#FFCF70" />
				</svg>
			</div>

			<div className="choice-container flex-clm">
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
						: "Continue"}
				</Button>
			</div>
		</div>
	);
}

// TODO: create db connection
// temporary setup using localStorage for testing
export function LookingFor({ onContinue, onSkip }) {
	const [selectedOption, setSelectedOption] = useState(() => {
		return localStorage.getItem("temp_looking_for") || "connect";
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
		<div className="auth-form flex-clm spacing-4">
			<h2 className="l-heading looking-for flex justify-center">I am looking to</h2>
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
						: "Continue"}
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
		<form
			onSubmit={handleSubmit}
			className="auth-form auth-form-business flex-clm"
		>
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
					: "Continue"}
			</button>
		</form>
	);
}

export function LineUpPro({ onContinue, onSkip }) {
	const [selectedPlan, setSelectedPlan] = useState(null);
	return (
		<div className="auth-form flex-clm justify-center">
			<div className="icon-container">
				<svg width="172" height="32" viewBox="0 0 172 32" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M93.668 10.1689C94.817 10.1689 95.8428 10.4582 96.751 11.0293C97.659 11.5866 98.3746 12.3504 98.8975 13.3203C99.4203 14.2904 99.6885 15.3916 99.6885 16.6162C99.6884 17.765 99.4541 18.8518 98.9932 19.8906C98.5322 20.9089 97.8996 21.8172 97.1084 22.6152C96.3309 23.4133 95.4362 24.04 94.4316 24.501C93.4274 24.948 92.3817 25.1679 91.3018 25.168C90.5037 25.168 89.7467 25.0367 89.0312 24.7822C88.3157 24.5277 87.6755 24.17 87.1182 23.709L85.0127 32H80.8643L86.2373 10.499H89.8223L89.5127 11.7168C90.0836 11.256 90.7233 10.8777 91.4248 10.5957C92.1265 10.3068 92.8768 10.169 93.668 10.1689ZM70.1104 16.9326C69.904 17.7787 69.8973 18.5146 70.083 19.1543C70.2756 19.794 70.6191 20.2965 71.1074 20.6611C71.6166 21.012 72.2298 21.1846 72.9453 21.1846C73.9015 21.1845 74.7136 20.8884 75.3809 20.3037C76.0619 19.6983 76.5365 18.8998 76.791 17.916L80.4238 3.34375H84.7236L80.9463 18.4395C80.4027 20.5859 79.3913 22.2783 77.9121 23.5029C76.4467 24.7137 74.6376 25.3193 72.4912 25.3193L72.498 25.3125C70.8124 25.3125 69.3805 24.9268 68.2178 24.1631C67.0552 23.3994 66.2431 22.3607 65.7822 21.0605C65.335 19.7395 65.3216 18.246 65.7344 16.5947L69.0576 3.33691H73.502L70.1104 16.9326ZM7.17578 0.660156C11.3039 0.660156 13.7471 3.66723 13.7471 8.78613C13.7471 12.6184 12.2952 16.3478 9.81836 19.3545C10.1899 19.5953 10.761 19.9045 11.5107 20.0352C13.2514 20.3447 15.2812 19.5883 16.1963 18.1504H16.1895C17.0082 16.8638 16.9874 14.9228 16.9668 13.7119C16.9668 13.4773 16.955 13.1306 16.9805 12.9902V8.33203H21.8037C21.7937 12.0352 21.7864 15.7383 21.7783 19.4414C21.7794 19.4446 21.7825 19.447 21.7832 19.4502L21.7783 19.4473C21.7782 19.5117 21.7785 19.5762 21.7783 19.6406C21.7988 20.0032 21.8696 20.5944 22.0508 20.957C22.4774 21.8859 23.8814 22.0235 24.2598 21.8652C24.2682 21.8632 24.9783 21.6895 25.5049 21.0127C25.5626 20.9485 25.6848 20.7603 25.8086 20.5645C25.9022 20.0937 25.9475 19.5902 25.9385 19.4922C25.9591 18.8661 25.973 16.499 25.918 13.2793V8.3252H30.7344V9.97656C34.8556 5.86234 42.3753 8.18055 42.4307 14.4619C42.4307 14.4619 42.4307 18.7997 42.4307 18.8311C42.4307 19.1682 42.5195 19.4439 42.6709 19.6641C42.9667 20.0768 43.4694 20.1794 43.6758 20.2207C43.9509 20.2757 44.4806 20.3932 44.9209 20.1045C45.2213 19.8761 45.3935 19.5931 45.4922 19.2871C43.8446 14.2033 46.7075 7.68822 54.0791 7.5957C59.7549 7.51339 64.0001 12.4188 63.0303 17.957H50.1504C50.9347 21.5072 55.9641 22.1883 57.7461 19.333H62.8994C61.6472 22.9244 58.2757 25.2363 54.1133 25.2363V25.2295C51.3095 25.1976 49.1564 24.2392 47.6523 22.7852C46.572 24.1714 44.7115 24.7815 42.7607 24.8311C38.2817 24.7416 37.5179 21.9135 37.6143 19.8838V15.9551C37.6142 13.9049 36.3134 12.584 34.3389 12.584C34.1513 12.584 32.6737 12.5986 31.6699 13.6299C30.9269 14.3936 31.0231 15.2053 30.4727 20.1865C30.4245 20.6337 30.3347 21.3629 29.915 22.1816C29.4541 23.0692 28.8144 23.6541 28.374 23.9844C27.9887 24.2252 27.1426 24.7211 26.0762 24.9688C24.9962 25.1958 24.6658 25.168 24.0674 25.168C24.0658 25.1654 24.0641 25.1627 24.0625 25.1602C24.0194 25.162 23.9752 25.1669 23.9297 25.168C23.4618 25.1748 20.4755 25.2225 18.5215 22.9727C18.3175 22.7439 18.1391 22.5152 17.9834 22.2861C17.2587 22.9967 16.4262 23.4985 16.1963 23.627C12.5704 25.5465 9.3297 24.9064 6.04785 22.7529C4.76125 23.613 3.37112 24.3082 1.85059 24.8311L0 20.9639C1.02513 20.5648 2.01579 20.0419 2.90332 19.4434C1.23151 16.9115 0.302734 13.6089 0.302734 9.87305C0.302765 3.99753 3.04783 0.660323 7.17578 0.660156ZM92.5195 13.8086C91.7559 13.8086 91.0539 14.015 90.4141 14.4277C89.7742 14.8268 89.2651 15.3503 88.8867 16.0039C88.5015 16.6575 88.3154 17.3663 88.3154 18.1299C88.3155 18.7696 88.4534 19.3406 88.7217 19.8496C89.0106 20.3448 89.3954 20.7442 89.8906 21.0469C90.3998 21.3358 90.9715 21.4736 91.6113 21.4736L91.6182 21.4873C92.3818 21.4873 93.0839 21.2877 93.7168 20.8887C94.3566 20.4759 94.8658 19.9387 95.2441 19.2852C95.6293 18.6316 95.8145 17.9295 95.8145 17.1797C95.8144 16.54 95.6707 15.9757 95.3887 15.4805C95.1203 14.9713 94.7346 14.5654 94.2393 14.2627C93.744 13.96 93.173 13.8086 92.5195 13.8086ZM7.07324 5.31152C6.01369 5.31152 5.25684 6.63285 5.25684 9.50879C5.25687 11.8548 5.71716 14.0015 6.57715 15.749C7.96694 13.6987 8.75877 11.2905 8.75879 8.7793C8.75879 6.53659 8.13258 5.3118 7.07324 5.31152ZM54.0791 11.4766C52.1664 11.4766 50.7075 12.6668 50.1846 14.5176H58.0146C57.4849 12.6669 55.9985 11.4767 54.0859 11.4766H54.0791ZM19.3125 0C20.998 0 22.3191 1.25202 22.3193 2.9375C22.3193 4.62316 21.0326 5.91016 19.3125 5.91016C17.627 5.90999 16.3408 4.65745 16.3408 2.9375C16.341 1.21775 17.6271 0.000161183 19.3125 0Z" fill="#4D3F54" />
					<path d="M109.256 28.4999V4.7499H116.434C118.087 4.7499 119.486 4.9962 120.629 5.48879C121.791 5.98138 122.723 6.63231 123.427 7.44157C124.13 8.23324 124.641 9.10407 124.957 10.0541C125.292 10.9865 125.459 11.9101 125.459 12.8249C125.459 13.7221 125.3 14.6457 124.984 15.5957C124.667 16.5281 124.148 17.399 123.427 18.2082C122.723 18.9999 121.799 19.642 120.656 20.1346C119.512 20.6272 118.105 20.8735 116.434 20.8735H113.848V28.4999H109.256ZM113.848 16.7568H116.17C117.296 16.7568 118.184 16.5633 118.835 16.1763C119.504 15.7717 119.979 15.2703 120.26 14.6721C120.559 14.074 120.709 13.4582 120.709 12.8249C120.709 12.2092 120.568 11.6022 120.286 11.0041C120.005 10.3883 119.53 9.87814 118.861 9.47351C118.21 9.06888 117.313 8.86657 116.17 8.86657H113.848V16.7568Z" fill="#FFCF70" />
					<path d="M127.855 28.4999V4.7499H135.112C136.836 4.7499 138.305 5.09296 139.518 5.77907C140.75 6.46518 141.691 7.38 142.342 8.52351C142.993 9.64944 143.318 10.8897 143.318 12.2443C143.318 13.4758 143.046 14.593 142.5 15.5957C141.973 16.5985 141.216 17.4254 140.231 18.0763L146.512 28.4999H141.313L136.035 19.4749H132.446V28.4999H127.855ZM132.446 15.5166H135.006C135.868 15.5166 136.572 15.3582 137.117 15.0416C137.662 14.7073 138.067 14.2939 138.331 13.8013C138.595 13.2911 138.727 12.7721 138.727 12.2443C138.727 11.3119 138.384 10.5467 137.698 9.94851C137.012 9.33277 136.114 9.0249 135.006 9.0249H132.446V15.5166Z" fill="#FFCF70" />
					<path d="M158.564 28.9749C156.822 28.9749 155.195 28.6582 153.682 28.0249C152.169 27.374 150.832 26.4856 149.671 25.3596C148.528 24.2337 147.63 22.923 146.979 21.4277C146.328 19.9323 146.003 18.3314 146.003 16.6249C146.003 14.9184 146.328 13.3175 146.979 11.8221C147.63 10.3268 148.528 9.01611 149.671 7.89018C150.832 6.76425 152.169 5.88462 153.682 5.25129C155.195 4.60037 156.822 4.2749 158.564 4.2749C160.306 4.2749 161.933 4.60037 163.446 5.25129C164.959 5.88462 166.287 6.76425 167.431 7.89018C168.592 9.01611 169.498 10.3268 170.149 11.8221C170.8 13.3175 171.125 14.9184 171.125 16.6249C171.125 18.3314 170.8 19.9323 170.149 21.4277C169.498 22.923 168.592 24.2337 167.431 25.3596C166.287 26.4856 164.959 27.374 163.446 28.0249C161.933 28.6582 160.306 28.9749 158.564 28.9749ZM158.564 24.3832C159.989 24.3832 161.273 24.0402 162.417 23.3541C163.56 22.6504 164.466 21.7092 165.135 20.5305C165.821 19.3518 166.164 18.0499 166.164 16.6249C166.164 15.1823 165.821 13.8805 165.135 12.7193C164.466 11.5406 163.56 10.6082 162.417 9.92212C161.273 9.21842 159.989 8.86657 158.564 8.86657C157.139 8.86657 155.846 9.21842 154.685 9.92212C153.541 10.6082 152.635 11.5406 151.967 12.7193C151.298 13.8805 150.964 15.1823 150.964 16.6249C150.964 18.0499 151.298 19.3518 151.967 20.5305C152.635 21.7092 153.541 22.6504 154.685 23.3541C155.846 24.0402 157.139 24.3832 158.564 24.3832Z" fill="#FFCF70" />
				</svg>
			</div>
			<div className="pro-benefits flex-clm">
				<h1>Get full access to LineUp</h1>
				<p className="checklist-item">Unlimited collabs</p>
				<p className="checklist-item">unlimited connections</p>
				<p className="checklist-item">Advanced insights</p>
				<p className="checklist-item">See detailed reviews</p>
			</div>

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
