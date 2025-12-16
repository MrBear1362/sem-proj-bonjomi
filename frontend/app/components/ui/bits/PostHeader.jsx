import { apiFetch } from "../../../library/apiFetch";
import { getTimeSince } from "../../../library/timeUtils";
import UserIdentifier from "./UserIdentifier";
import Bookmark from "../buttons/Bookmark";

export default function PostHeader({
  user,
  action,
  tag,
  timestamp,
  showBookmark = true,
  className = ""
}) {

  return (
    <section className={`post-header flex-row ${className}`}>
      <div className="user-details flex-row">
        <UserIdentifier user={{
          img: user?.image_url || user?.img || "",
          firstName: user?.first_name || user?.firstName || "User"
        }} />
        {action && <p className="post-action">{action}</p>}
        {tag && <p className="post-tag">#{tag}</p>}
      </div>

      <div className="post-header-right flex-row">
        {timestamp && <p className="post-timestamp">{getTimeSince(timestamp)}</p>}
        {showBookmark && (
          <Bookmark />
        )}
      </div>
    </section>
  );
}