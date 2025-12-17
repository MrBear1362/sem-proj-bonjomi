export function MessagesTabs({ activeTab, onTabChange }) {
  return (
    <div className="messages-tabs flex">
      <button
        className={`tab ${activeTab === "chats" ? "tab-active" : ""}`}
        onClick={() => onTabChange("chats")}
      >
        Chats
      </button>
      <div className="messages-tab-separator"></div>
      <button
        className={`tab ${activeTab === "groups" ? "tab-active" : ""}`}
        onClick={() => onTabChange("groups")}
      >
        Groups
      </button>
    </div>
  );
}
