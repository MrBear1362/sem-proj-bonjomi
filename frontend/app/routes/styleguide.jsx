import { useState } from "react";
import Button from "../components/ui/buttons/Button";
import ButtonLink from "../components/ui/buttons/ButtonLink";
import InputField from "../components/ui/inputs/InputField";
import RadioCard from "../components/ui/inputs/RadioCard";
import LoadingSpinner from "../components/ui/bits/LoadingSpinner";

export default function StyleGuide() {
  const [verticalChoice, setVerticalChoice] = useState("musician");
  const [horizontalChoice, setHorizontalChoice] = useState("option1");
  const [pricingChoice, setPricingChoice] = useState("free");
  const [lookingForChoice, setLookingForChoice] = useState("connect");

  return (
    <div className="styleguide">
      <h1>Component Style Guide</h1>

      <section>
        <h2>Buttons</h2>
        <Button className="btn-primary">Primary Button</Button>
        <Button variant="secondary" className="btn-secondary">Secondary Button</Button>
        <Button disabled className="btn-outline">Disabled Button</Button>
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
        <h2>Radio Cards - Horizontal</h2>
        <RadioCard
          value="option1"
          selected={horizontalChoice}
          onChange={setHorizontalChoice}
          variant="horizontal"
          title="Option 1"
        />

        <RadioCard
          value="option2"
          selected={horizontalChoice}
          onChange={setHorizontalChoice}
          variant="horizontal"
          title="Option 2"
        />

        <RadioCard
          value="option3"
          selected={horizontalChoice}
          onChange={setHorizontalChoice}
          variant="horizontal"
          title="Option 3"
        />
      </section>

      <section>
        <h2>Radio Cards - Pricing</h2>
        <RadioCard
          value="free"
          selected={pricingChoice}
          onChange={setPricingChoice}
          variant="pricing"
          title="Free Plan"
          subtitle="Basic features for getting started"
          price="$0/month"
        />

        <RadioCard
          value="pro"
          selected={pricingChoice}
          onChange={setPricingChoice}
          variant="pricing"
          title="Pro Plan"
          subtitle="Advanced features for professionals"
          price="$29/month"
          discount="Save 20%"
        />

        <RadioCard
          value="business"
          selected={pricingChoice}
          onChange={setPricingChoice}
          variant="pricing"
          title="Business Plan"
          subtitle="Complete solution for businesses"
          price="$99/month"
        />
      </section>

      <section>
        <h2>Loading</h2>
        <LoadingSpinner />
      </section>
    </div>
  );
}