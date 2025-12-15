import { useLoaderData } from "react-router";
import { useState } from "react";
import { apiFetch } from "../../library/apiFetch";
import PostHeader from "../../components/ui/bits/PostHeader";

export async function clientLoader({ params }) {
  // get collab request id from params
  const { requestId } = params;

  try {
    // call GET - specific req based on id to retrieve needed data from db
    const response = await apiFetch(`/api/collab-requests/${requestId}`);
    const coreq = await response.json();

    // user data fetch based on collab req user id
    const userResponse = await apiFetch(`/api/users/${coreq.user_id}`);
    const user = userResponse.ok ? await userResponse.json() : null;

    return { coreq, user };
  } catch (error) {
    console.error("Error loading collaboration request:", error);
    throw error;
  }
}

// collab request also needs a preview card component, for the feed, before a user clicks read more

export default function CollabRequest() {
  const { coreq, user } = useLoaderData();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // validate coreq data
  if (!coreq) {
    return <div className="error">Collaboration request not found.</div>;
  }

  const handleBookmark = async () => {
    try {
      const response = await apiFetch(`/api/collab-request/${coreq.id}/bookmark`, {
        method: isBookmarked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // get tag name from tag_id (needs fetching from db or passing from backend)
  // placeholder tag / replace with actual tag lookup later
  const tagName = "guitarist";

  return (
    <article className="collab-request-card">
      <PostHeader
        user={{
          img: user?.image_url || "",
          firstName: user?.first_name || "User"
        }}
        action="is looking for a"
        tag={tagName}
        timestamp={coreq.created_at}
        onBookmark={handleBookmark}
        isBookmarked={isBookmarked}
      />

      <header>
        <h2>{coreq.title || "Untitled request"}</h2>
        {coreq.media_url && (
          <img src={coreq.media_url} alt="Request media" />
        )}
      </header>

      {coreq.content && (
        <section className="description">{coreq.content}</section>
      )}

      <section className="request-details">
        {/* this should just say remote if coreq.location is remote */}
        {coreq.location && (
          <p><strong>Location:</strong> {coreq.location}</p>
        )}
        {coreq.due_date && (
          <p><strong>Due date:</strong> {new Date(coreq.due_date).toLocaleDateString()}</p>
        )}
        {coreq.created_at && (
          <p><strong>Posted:</strong> {new Date(coreq.created_at).toLocaleDateString()}</p>
        )}
        {coreq.is_paid && <span className="badge">Paid</span>}  
      </section>


    </article>
  )
}