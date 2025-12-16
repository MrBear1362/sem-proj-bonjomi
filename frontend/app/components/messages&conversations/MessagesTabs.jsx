export function MessagesTabs({ activeTab, onTabChange }) {
  return (
    <div className="messages-tabs">
      <button
        className={`tab ${activeTab === "chats" ? "tab-active" : ""}`}
        onClick={() => onTabChange("chats")}
      >
        Chats
      </button>
      <button
        className={`tab ${activeTab === "groups" ? "tab-active" : ""}`}
        onClick={() => onTabChange("groups")}
      >
        Groups
      </button>
    </div>
  );
}
