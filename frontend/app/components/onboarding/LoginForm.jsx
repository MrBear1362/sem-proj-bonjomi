import ButtonLink from "../ui/ButtonLink";
// TODO: find icon library and IMPORT here pls

export default function LoginForm() {
  return (
    <div>
      <ButtonLink to="/auth" query={{ step: "signup" }}>
        Sign up
      </ButtonLink>

      <ButtonLink to="/auth" query={{ step: "login" }}>
        Log in
      </ButtonLink>
    </div>
  );
}
