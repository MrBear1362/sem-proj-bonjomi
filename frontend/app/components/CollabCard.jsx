import React from "react";
import Tag from "./ui/buttons/Tag";
import { NavLink } from "react-router";
import { getTimeSince } from "../library/timeUtils";

export default function CollabCard({ collab }) {
  return (
    <div className="collab__card">
      <div className="flex collab__nav">
        <img
          src={
            collab.image_url ||
            "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={collab.first_name}
          className="collab__nav--pic"
        />
        <p className="s-text">{collab.first_name}</p>
        {collab.tags && (
          <Tag type="static" withBorder="false" label={collab.tags} />
        )}
      </div>
      <div className="divider"></div>
      <div>
        <h2 className="s-text">{collab.title}</h2>
        <p className="s-text"> {collab.content}</p>
      </div>
      <div className="collab-interactions flex-space">
        <NavLink to={`/posts/${collab.id}`} aria-label="Collab request">
          Read more
        </NavLink>
        <div className="flex">
          <p>{collab.location}</p>
          {collab.created_at && (
            <p className="post-timestamp">
              {" "}
              - {getTimeSince(collab.created_at)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
