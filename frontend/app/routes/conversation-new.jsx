import { Form, Link, redirect, useActionData } from "react-router";
import { apiFetch } from "../lib/apiFetch.js";
import { useEffect, useState } from "react";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const participantId = formData.get("participantId");

  if (!participantId) return { error: "Please select a user" };

  try {
    const conversation = await apiFetch("/api/conversations", {
      method: "POST",
      body: JSON.stringify({
        participantId,
      }),
    });

    return redirect(`/messages/${conversation.id}`);
  } catch (error) {
    return { error: error.message };
  }
}

export default function ConversationNew() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const actionData = useActionData();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await apiFetch(
          `/api/users/search?query=${encodeURIComponent(query)}`
        );
        setResults(data);
      } catch (err) {
        setSearchError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="new-convo-page">
      <div className="new-convo-header">
        <h1 className="new-convo-header-title">Start Conversation</h1>
        <Link to="/messages" aria-label="Back" className="icon-btn">
          ←
        </Link>
      </div>
      <Form method="post">
        <input
          type="hidden"
          name="participantId"
          value={selectedUser?.id || ""}
        />

        {searchError && <div className="error-message">{searchError}</div>}
        {actionData?.error && (
          <div className="error-message">{actionData.error}</div>
        )}

        {selectedUser ? (
          <div className="new-convo-selected">
            <div className="new-convo-chip">
              {selectedUser.image_url && (
                <img
                  src={selectedUser.image_url}
                  alt=""
                  className="new-convo-avatar"
                />
              )}
              <div className="new-convo-result-text">
                <span className="new-convo-result-name">
                  {selectedUser.first_name} {selectedUser.last_name}
                </span>
                {selectedUser.alias && (
                  <span className="new-convo-result-alias">
                    @{selectedUser.alias}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="new-convo-chip-remove"
                aria-label="Remove selected user"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="new-convo-search">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users..."
                className="new-convo-search-input"
                aria-label="Search users"
              />
            </div>
            {loading && <div>Searching...</div>}
            {results.length > 0 && (
              <ul className="new-convo-results">
                {results.map((user) => (
                  <li key={user.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="new-convo-result-item"
                    >
                      {user.image_url && (
                        <img
                          src={user.image_url}
                          alt=""
                          className="new-convo-avatar"
                        />
                      )}
                      <div className="new-convo-result-text">
                        <div className="new-convo-result-name">
                          {user.first_name} {user.last_name}
                        </div>
                        {user.alias && (
                          <div className="new-convo-result-alias">
                            @{user.alias}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.trim().length >= 2 && results.length === 0 && !loading && (
              <div className="no-results">No users found</div>
            )}
          </>
        )}
        <div className="new-convo-actions">
          <button
            type="submit"
            disabled={!selectedUser}
            className="new-convo-create-btn"
          >
            Start Chat
          </button>
        </div>
      </Form>
    </div>
  );
}
