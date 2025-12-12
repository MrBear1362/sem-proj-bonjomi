import React from "react";
import { Form } from "react-router";

export default function CreateNote() {
  return (
    <div className="create-note__container">
      <Form method="post">
        {/* need to GET user info maybe make component? */}
        {/* tag people */}
        <textarea name="tags" placeholder="Select your tags here..." rows="1" />
        <textarea
          name="title"
          placeholder="Write a title..."
          rows="1"
          required
        />
        <input type="image" name="mediaUrl" placeholder=" + Add Media"></input>
        <textarea
          name="content"
          placeholder="Write a description..."
          rows="6"
        />
        <button className="send-button" type="submit">
          Post
        </button>
      </Form>
    </div>
  );
}
