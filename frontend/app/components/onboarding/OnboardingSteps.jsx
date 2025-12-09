import { useState } from "react";
import { supabase } from "../../library/supabase.js";
import { apiFetch } from "../../library/apiFetch.js";
import LineUpPRO from "../LineUpPRO";
import RadioCard from "../ui/RadioCard";
import InputField from "../ui/InputField";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import Button from "../ui/Button.jsx";


export default function OnboardingSteps() {
  // set initial step
  const [step, setStep] = useState("userDetails");
  // stores "musician" or "business"
  const [userType, setUserType] = useState(null);

  const nextStep = (payload) => {
    switch (step) {
      case "userDetails":
        setStep("userSelection");
        break;

      case "userSelection":
        setUserType(payload)
        if (payload === "business") {
          setStep("businessDetails");
        } else {
          setStep("lookingFor");
        }
        break;

      case "lookingFor":
        setStep("lineUpPro");
        break;

      case "businessDetails":
      case "lineUpPro":
        // redirect to dashboard
        setStep("finished");
        break;
    }
  };

  if (step === "finished") {
    // go to dashboard
    window.location.href = "/";
    return null;
  }

  return (
    <section className="onboarding-steps">
      {step === "userDetails" && (<UserDetails onContinue={nextStep} />)}
      {step === "userSelection" && (<UserSelection onContinue={nextStep} />)}
      {step === "lookingFor" && (<LookingFor onContinue={nextStep} />)}
      {step === "businessDetails" && (<BusinessDetails onContinue={nextStep} />)}
      {step === "lineUpPro" && (<LineUpPro onContinue={nextStep} />)}
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
      birth_year: formData.get("yearOfBirth"),
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
      const response = await apiFetch("/api/signup", {
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
      onContinue();
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

      <button
        className="btn-primary"
        type="submit"
        disabled={isSubmitting}
      >
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
  const [choice, setChoice] = useState(null); // "musician" or "business"

  const handleContinue = () => {
    onContinue(choice);
  };

  return (
    <div>
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

      <Button className="btn-primary" onClick={() => onContinue(choice)} disabled={!choice}>
        Continue
      </Button>
    </div>
  );
}

export function LookingFor() {
  return <div>User is looking for</div>
}

export function BusinessDetails() {
  return <div>They chose business</div>
}

export function LineUpPro() {
  return <div>This should call on <LineUpPRO /></div>
}