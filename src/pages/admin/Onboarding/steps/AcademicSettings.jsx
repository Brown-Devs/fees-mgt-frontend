import { useState } from "react";
import api from "../../../../apis/axios";

export default function AcademicSettings({ school }) {
  const [sessions, setSessions] = useState(school.sessions || []);
  const [timezone, setTimezone] = useState(school.timezone || "Asia/Kolkata");
  const [currency, setCurrency] = useState(school.currency || "INR");

  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const [saving, setSaving] = useState(false);

  async function saveAcademicSettings() {
    setSaving(true);

    let updatedSessions = [...sessions];

    if (label && startDate && endDate) {
      if (isCurrent) {
        updatedSessions = updatedSessions.map(s => ({
          ...s,
          isCurrent: false
        }));
      }

      updatedSessions.push({
        label,
        startDate,
        endDate,
        isCurrent
      });
    }

    await api.put(`/api/schools/${school._id}/settings`, {
      sessions: updatedSessions,
      timezone,
      currency
    });

    setSessions(updatedSessions);
    setLabel("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setSaving(false);

    alert("Academic settings saved");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Academic Settings</h2>

      {/* Existing Sessions */}
      <div>
        <h3 className="text-sm font-medium mb-2">Existing Sessions</h3>
        <div className="space-y-2">
          {sessions.length === 0 && (
            <p className="text-sm text-slate-500">No sessions added yet</p>
          )}
          {sessions.map((s, i) => (
            <div
              key={i}
              className={`border p-3 rounded flex justify-between ${
                s.isCurrent ? "bg-emerald-50 border-emerald-300" : ""
              }`}
            >
              <div>
                <div className="font-medium">{s.label}</div>
                <div className="text-xs text-slate-500">
                  {s.startDate} → {s.endDate}
                </div>
              </div>
              {s.isCurrent && (
                <span className="text-xs text-emerald-600 font-semibold">
                  CURRENT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Session */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3">Add New Session</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Session label (e.g. 2024–25)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
          />
          <span className="text-sm">Set as current session</span>
        </label>
      </div>

      {/* Timezone & Currency */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3">General Settings</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
          </select>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      {/* Save */}
      <div className="pt-4">
        <button
          disabled={saving}
          onClick={saveAcademicSettings}
          className="bg-emerald-600 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Academic Settings"}
        </button>
      </div>
    </div>
  );
}
