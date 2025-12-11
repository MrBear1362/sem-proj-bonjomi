import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { supabase } from "../../library/supabase.js";
import { apiFetch } from "../../library/apiFetch.js";
import { ONBOARDING_STEPS } from "../../library/onboardingSteps.js";
import LoadingSpinner from "../ui/bits/LoadingSpinner.jsx";
import RadioCard from "../ui/inputs/RadioCard.jsx";
import InputField from "../ui/inputs/InputField.jsx";
import Button from "../ui/buttons/Button.jsx";
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

      <button className="btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            Continue <LoadingSpinner />
          </>
        ) : (
          "Continue"
        )}
      </button>
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

      {error && <div className="error-message">{error}</div>}

      <Button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={isSubmitting || !choice}
      >
        {isSubmitting ? (
          <>
            Continue <LoadingSpinner />
          </>
        ) : (
          "Continue"
        )}
      </Button>
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
    <div className="auth-form">
      <h2>I am looking to</h2>

      <div className="options-group">
        {options.map((option) => (
          <RadioCard
            key={option.id}
            value={option.id}
            selected={selectedOption}
            onChange={setSelectedOption}
            variant="vertical"
            title={option.label}
          />
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <Button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedOption}
      >
        {isSubmitting ? (
          <>
            Continue <LoadingSpinner />
          </>
        ) : (
          "Continue"
        )}
      </Button>

      <button className="skip-btn" onClick={handleSkip} disabled={isSubmitting}>
        Skip for now
      </button>
    </div>
  );
}

export function BusinessDetails({ onContinue }) {
  return (
    <div className="auth-form">
      <h2>Business details</h2>
      <Button className="btn-primary" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}

export function LineUpPro({ onContinue, onSkip }) {
  return (
    <div className="auth-form">
      <h1>Hello from lineup pro</h1>
      {/* <LineUpSubscription /> */}
      <Button className="btn-primary" onClick={onContinue}>
        Finish
      </Button>

      <button className="skip-btn" onClick={onSkip}>
        Skip
      </button>
    </div>
  );
}
