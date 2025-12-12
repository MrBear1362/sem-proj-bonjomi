import React from "react";
import { apiFetch } from "../lib/apiFetch.js";
import { supabase } from "../lib/supabase.js";
import { useLoaderData } from "react-router";
import NotificationItem from "./NotificationItem.jsx";

export async function clientLoader() {
  const response = await apiFetch("/api/notifications");

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  const notifications = await response.json();

  return { notifications };
}

export default function NotificationFeed({ notifications }) {
  const { notifications } = useLoaderData();

  const grouped = notifications.reduce((acc, n) => {
    (acc[n.type] ||= []).push(n);
    return acc;
  }, {});

  Object.values(grouped).forEach((list) =>
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  );

  return (
    <>
      <Section title="Connection requests" items={grouped.connection ?? []} />
      <Section title="Collaboration requests" items={grouped.collab ?? []} />
      <Section
        title="Profile interactions"
        items={grouped.like ?? grouped.comment ?? grouped.repost ?? []}
      />
    </>
  );
}

function Section({ title, items }) {
  if (!items.length) return null;
  return (
    <div>
      <h3>{title}</h3>
      {items.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
