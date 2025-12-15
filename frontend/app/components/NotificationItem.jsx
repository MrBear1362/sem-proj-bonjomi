import React from "react";
import Like from "./ui/buttons/Like";
import Repost from "./ui/buttons/Repost";
import Time from "./Time";
import Preview from "./ui/Preview";

export default function NotificationItem({ notification }) {
  const name =
    `${notification?.first_name ?? ""} ${notification?.last_name ?? ""}`.trim();
  const alt = name || "User";

  switch (notification.type) {
    case "connection":
      return (
        <div>
          {notification?.img_url && (
            <img src={notification.img_url} alt={alt} />
          )}
          <div>
            <p>{name || "Someone"} wants to connect</p>
            <Time />
          </div>
          <button>Accept</button>
        </div>
      );
    case "collab":
      return (
        <div>
          <div>
            {notification?.img_url && (
              <img src={notification.img_url} alt={alt} />
            )}
            <p>{name || "Someone"} wants to collaborate</p>
            <Time />
          </div>
          <div>
            <Preview />
          </div>
          <button>Reply</button>
        </div>
      );
    case "like":
      return (
        <div>
          <div>
            {notification?.img_url && (
              <img src={notification.img_url} alt={alt} />
            )}
            <p>{name || "Someone"} liked your note</p>
            <Time />
            <Like type="static" />
          </div>
        </div>
      );
    case "comment":
      return (
        <div>
          <div>
            {notification?.img_url && (
              <img src={notification.img_url} alt={alt} />
            )}
            <p>{name || "Someone"} commented on your note</p>
            <Time />
          </div>
          <div>
            <Preview />
            <button>See note</button>
          </div>
        </div>
      );
    case "repost":
      return (
        <div>
          <div>
            {notification?.img_url && (
              <img src={notification.img_url} alt={alt} />
            )}
            <p>{name || "Someone"} reposted your note</p>
            <Time />
            <Repost type="static" />
          </div>
          <div>
            <Preview />
            <button>See note</button>
          </div>
        </div>
      );
    default:
      return null;
  }
}
