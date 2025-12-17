import { Form, Link, redirect, useActionData } from "react-router";
import { apiFetch } from "../library/apiFetch.js";
import { useEffect, useState } from "react";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const participantIds = formData.getAll("participantIds");
  const title = formData.get("title");

  if (participantIds.length === 0)
    return { error: "Please select at least one user" };

  try {
    const response = await apiFetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantIds,
        title: title || undefined,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create conversation");
    }

    const conversation = await response.json();
    if (!conversation?.id) {
      throw new Error("Conversation id missing in response");
    }

    return redirect(`/messages/${conversation.id}`);
  } catch (error) {
    return { error: error.message };
  }
}

export default function ConversationNew() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const actionData = useActionData();

  const toggleUser = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      return exists ? prev.filter((u) => u.id !== user.id) : [...prev, user];
    });
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await apiFetch(
          `/api/users/search?query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
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
        {selectedUsers.map((u) => (
          <input key={u.id} type="hidden" name="participantIds" value={u.id} />
        ))}

        {searchError && <div className="error-message">{searchError}</div>}
        {actionData?.error && (
          <div className="error-message">{actionData.error}</div>
        )}

        {selectedUsers.length > 0 && (
          <div className="new-convo-selected">
            {selectedUsers.map((user) => (
              <div key={user.id} className="new-convo-chip">
                {user.image_url && (
                  <img
                    src={user.image_url}
                    alt=""
                    className="new-convo-avatar"
                  />
                )}
                <div className="new-convo-result-text">
                  <span className="new-convo-result-name">
                    {user.first_name} {user.last_name}
                  </span>
                  {user.alias && (
                    <span className="new-convo-result-alias">
                      @{user.alias}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="new-convo-chip-remove"
                  aria-label="Remove user"
                  onClick={() => toggleUser(user)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {selectedUsers.length > 1 && (
          <div className="new-convo-title-input">
            <input
              type="text"
              name="title"
              placeholder="Group chat name..."
              className="new-convo-search-input"
              required
            />
          </div>
        )}
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
            {results.map((user) => {
              const isSelected = selectedUsers.some((u) => u.id === user.id);
              return (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => toggleUser(user)}
                    className={`new-convo-result-item ${isSelected ? "is-selected" : ""}`}
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
              );
            })}
          </ul>
        )}
        {query.trim().length >= 2 && results.length === 0 && !loading && (
          <div className="no-results">No users found</div>
        )}
        <div className="new-convo-actions">
          <button
            type="submit"
            disabled={selectedUsers.length === 0}
            className="new-convo-create-btn"
          >
            Start Chat
          </button>
        </div>
      </Form>
    </div>
  );
}
