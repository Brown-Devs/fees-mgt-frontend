// src/pages/parent/ParentHolidaysPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import { PageShell, Card, CardTitle, StatCard, Badge, Spinner, ErrorBox, EmptyState } from "./components/ui";

export default function ParentHolidaysPage() {
  const [holidays, setHolidays] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    api.get("/api/holidays")
      .then(res => setHolidays(res.data.data || []))
      .catch(err => setError(err?.response?.data?.message || "Failed to load holidays"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} />;

  const sorted   = [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date));
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = sorted.filter(h => new Date(h.date) >= today);
  const past     = sorted.filter(h => new Date(h.date) < today);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const HolidayRow = ({ h }) => {
    const d = new Date(h.date);
    return (
      <div className="flex gap-4 items-start py-3 border-b border-slate-50 last:border-0">
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-center flex-shrink-0 min-w-[52px]">
          <p className="text-base font-bold text-[#0a1a44] leading-none">{d.getDate()}</p>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">{MONTHS[d.getMonth()]}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-semibold text-[#0a1a44] text-sm">{h.name}</p>
            {h.type && <Badge status={h.type} />}
          </div>
          <p className="text-xs text-slate-400">
            {d.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            {h.endDate && (
              <> – {new Date(h.endDate).toLocaleDateString("en-IN", { day:"numeric", month:"long" })}</>
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <PageShell title="Holiday Calendar" subtitle="School holidays and vacation schedule">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Holidays" value={sorted.length}   colorClass="text-[#0a1a44]" />
        <StatCard label="Upcoming"        value={upcoming.length} colorClass="text-indigo-600" />
        <StatCard label="Past"            value={past.length}     colorClass="text-slate-500" />
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Card>
          <CardTitle>📅 Upcoming Holidays</CardTitle>
          {upcoming.map(h => <HolidayRow key={h._id} h={h} />)}
        </Card>
      )}

      {/* Past */}
      {past.length > 0 && (
        <Card className="opacity-70">
          <CardTitle>✅ Past Holidays</CardTitle>
          {past.map(h => <HolidayRow key={h._id} h={h} />)}
        </Card>
      )}

      {sorted.length === 0 && (
        <Card><EmptyState message="No holidays have been added yet." /></Card>
      )}
    </PageShell>
  );
}
