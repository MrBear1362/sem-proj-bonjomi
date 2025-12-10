import { useState } from "react";
import Button from "../components/ui/buttons/Button";
import ButtonLink from "../components/ui/buttons/ButtonLink";
import InputField from "../components/ui/inputs/InputField";
import RadioCard from "../components/ui/inputs/RadioCard";
import LoadingSpinner from "../components/ui/bits/LoadingSpinner";

export default function StyleGuide() {
  const [verticalChoice, setVerticalChoice] = useState("musician");
  const [lookingForChoice, setLookingForChoice] = useState("connect");

  return (
    <div className="styleguide">
      <h1>Component Style Guide</h1>

      <section>
        <h2>Buttons</h2>
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button disabled>Disabled Button</Button>
      </section>

      <section>
        <h2>Button Links</h2>
        <ButtonLink to="/dashboard">Dashboard Link</ButtonLink>
        <ButtonLink to="/auth" className="btn-secondary">Auth Link</ButtonLink>
      </section>

      <section>
        <h2>Skip/Text Buttons</h2>
        <ButtonLink to="#" className="skip-btn">Skip for now</ButtonLink>
        <ButtonLink to="#" className="skip-btn">Skip</ButtonLink>
      </section>

      <section>
        <h2>Inputs</h2>
        <InputField label="Email" type="email" placeholder="Enter your email" />
        <InputField label="Password" type="password" placeholder="Enter your password" />
      </section>

      <section>
        <h2>Radio Cards - Vertical with Subtitle</h2>
        <RadioCard
          value="musician"
          selected={verticalChoice}
          onChange={setVerticalChoice}
          variant="vertical"
          title="I am a musician"
          subtitle="I am a musician looking for collaborations and services"
        />

        <RadioCard
          value="business"
          selected={verticalChoice}
          onChange={setVerticalChoice}
          variant="vertical"
          title="Not a musician"
          subtitle="I want to provide services for musicians"
        />
      </section>

      <section>
        <h2>Radio Cards - Vertical without Subtitle</h2>
        <RadioCard
          value="connect"
          selected={lookingForChoice}
          onChange={setLookingForChoice}
          variant="vertical"
          title="Connect to fellow musicians"
        />

        <RadioCard
          value="promote"
          selected={lookingForChoice}
          onChange={setLookingForChoice}
          variant="vertical"
          title="Promote my music"
        />

        <RadioCard
          value="band"
          selected={lookingForChoice}
          onChange={setLookingForChoice}
          variant="vertical"
          title="Find a band to play with"
        />
      </section>

      <section>
        <h2>Loading</h2>
        <LoadingSpinner />
      </section>
    </div>
  );
}