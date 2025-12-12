import Button from "../../components/ui/buttons/Button";
import InputField from "../../components/ui/inputs/InputField";
import TextareaField from "../../components/ui/inputs/TextareaField";
import { UserPreview, UserIdentifier } from "../../components/ui/bits/UserIdentifier";

const user = {
  img: "https://plus.unsplash.com/premium_photo-1739581523378-e77ed23dc10e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  firstName: "Brandy",
  lastName: "Hellrider",
  skills: "Violinist"
}

export default function CreateNote() {
  return (
    <section className="post-content">
      <header className="post-content-header flex-row">
        <UserIdentifier user={user} />
        <button className="btn-primary">+ Add people</button>
      </header>

      <form className="post-form flex-clm">
        <button type="button" className="btn-text">+ Add tags</button>

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

        <button type="button" className="btn-outline">+ Add Media</button>

        <TextareaField
          id="description"
          name="description"
          placeholder="Write a description..."
          rows={6}
          className="text-input"
        />

        <Button type="submit" className="btn-primary">Post</Button>
      </form>

    </section>
  )
}