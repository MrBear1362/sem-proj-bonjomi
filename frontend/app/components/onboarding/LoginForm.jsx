import ButtonLink from "../UI/ButtonLink";
// TODO: find icon library and IMPORT here pls

export default function LoginForm() {
  return (
    <div>
      <ButtonLink to="/auth" query={{ step: "signup" }} icon={ }>
        Sign up
      </ButtonLink>

      <ButtonLink to="/auth" query={{ step: "login" }}>
        Log in
      </ButtonLink>
    </div>
  );
}
