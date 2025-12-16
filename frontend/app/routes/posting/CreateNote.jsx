import Button from "../../components/ui/buttons/Button";
import InputField from "../../components/ui/inputs/InputField";
import TextareaField from "../../components/ui/inputs/TextareaField";
import {
  UserPreview,
  UserIdentifier,
} from "../../components/ui/bits/UserIdentifier";
import { apiFetch } from "../../library/apiFetch";
import { supabase } from "../../library/supabase";
import { useLoaderData } from "react-router";

export async function clientLoader() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error loading user:", error);
    return { user: null, profile: null };
  }

  try {
    // user data fetch based on collab req user id
    const profile = await apiFetch(`/api/users/${user.id}`).then((r) =>
      r.ok ? r.json() : null
    );

    return { profile };
  } catch (error) {
    console.error("Error loading user:", error);
    throw error;
  }
}

export default function CreateNote() {
  const { profile } = useLoaderData();

  return (
    <section className="post-content">
      <header className="post-content-header flex-row">
        <UserIdentifier user={profile} />
        <button
          className="btn-primary"
          type="button"
          onClick={() => alert("Add people functionality not implemented yet.")}
        >
          + Add people
        </button>
      </header>

      <form className="post-form flex-clm">
        <button type="button" className="btn-text">
          + Add tags
        </button>

        <InputField
          type="text"
          id="title"
          name="title"
          label="Title"
          required
          placeholder="Write a title..."
          autoComplete="off"
          className="text-input"
        />

        <button type="button" className="btn-outline">
          + Add Media
        </button>

        <TextareaField
          id="description"
          name="description"
          placeholder="Write a description..."
          rows={6}
          className="text-input"
        />

        <Button type="submit" className="btn-primary">
          Post
        </Button>
      </form>
    </section>
  );
}
