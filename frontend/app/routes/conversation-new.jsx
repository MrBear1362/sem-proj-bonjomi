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
        <div className="user-chip">
          {selectedUser.image_url && (
            <img src={selectedUser.image_url} alt="" className="user-chip-avatar" />
          )}
          <div className="user-chip-info">
            <span className="user-chip-name">
              {selectedUser.first_name} {selectedUser.last_name}
            </span>
            {selectedUser.alias && (
              <span className="user-chip-alias">@{selectedUser.alias}</span>
            )}
          </div>
          <button type="button" onClick={() => setSelectedUser(null)} className="user-chip-remove">
            ✕
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
          />
          {loading && <div>Searching...</div>}
          {results.length > 0 && (
            <ul className="user-results">
              {results.map((user) => (
                <li key={user.id}>
                  <button type="button" onClick={() => setSelectedUser(user)} className="user-result-button">
                    {user.image_url && (
                      <img src={user.image_url} alt="" className="result-avatar" />
                    )}
                    <div className="result-info">
                      <div className="result-name">
                        {user.first_name} {user.last_name}
                      </div>
                      {user.alias && (
                        <div className="result-alias">@{user.alias}</div>
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

      <button type="submit" disabled={!selectedUser}>
        {" "}
        Start new conversation
      </button>
    </Form>
  );
}
