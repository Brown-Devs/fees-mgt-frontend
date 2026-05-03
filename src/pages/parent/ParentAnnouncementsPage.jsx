// src/pages/parent/ParentAnnouncementsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import { PageShell, Card, Spinner, ErrorBox, EmptyState } from "./components/ui";

export default function ParentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    api.get("/api/announcements")
      .then(res => setAnnouncements(res.data.data || []))
      .catch(err => setError(err?.response?.data?.message || "Failed to load announcements"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} />;

  const icons = ["📢", "📌", "📋", "📄", "🔔"];

  return (
    <PageShell title="Announcements" subtitle="Latest notices and news from school">
      {announcements.length === 0 ? (
        <Card><EmptyState message="No announcements at the moment." /></Card>
      ) : (
        announcements.map((a, i) => (
          <Card key={a._id} className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
              {icons[i % icons.length]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#0a1a44] text-sm">{a.title}</p>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{a.content}</p>
              <div className="flex gap-3 items-center mt-2 flex-wrap">
                {a.date && (
                  <span className="text-xs text-slate-400">
                    📅 {new Date(a.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium capitalize">
                  {a.targetDashboards?.[0] === "all" ? "Everyone" : a.targetDashboards?.[0] || "All"}
                </span>
              </div>
            </div>
          </Card>
        ))
      )}
    </PageShell>
  );
}
