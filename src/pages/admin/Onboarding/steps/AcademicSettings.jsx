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
        updatedSessions = updatedSessions.map((s) => ({
          ...s,
          isCurrent: false,
        }));
      }

      updatedSessions.push({
        label,
        startDate,
        endDate,
        isCurrent,
      });
    }

    await api.put(`/api/schools/${school._id}/settings`, {
      sessions: updatedSessions,
      timezone,
      currency,
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
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Academic Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure academic sessions and general preferences
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full
                         bg-[#0b1f3a]/10 text-[#0b1f3a] font-medium">
          Step 2 of 5
        </span>
      </div>

      {/* Premium Card */}
      <div className="bg-white rounded-2xl
                      shadow-[0_14px_36px_rgba(0,0,0,0.08)]
                      border border-slate-200 overflow-hidden">

        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r
                        from-[#0b1f3a] to-[#162e52]" />

        <div className="p-8 space-y-10">

          {/* ===== Existing Sessions ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a]
                           uppercase tracking-wide mb-6">
              Academic Sessions
            </h3>

            {sessions.length === 0 ? (
              <p className="text-sm text-slate-500">
                No academic sessions added yet
              </p>
            ) : (
              <div className="space-y-4">
                {sessions.map((s, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border px-5 py-4 flex items-center justify-between
                      ${s.isCurrent
                        ? "border-[#0b1f3a] bg-[#0b1f3a]/5"
                        : "border-slate-200 bg-slate-50"
                      }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">
                        {s.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {s.startDate} → {s.endDate}
                      </div>
                    </div>

                    {s.isCurrent && (
                      <span className="text-xs px-3 py-1 rounded-full
                                       bg-[#0b1f3a]/10 text-[#0b1f3a] font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== Add Session ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a]
                           uppercase tracking-wide mb-6">
              Add New Session
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                placeholder="Session label (e.g. 2024–25)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />

              <div className="flex gap-4">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 mt-5 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="accent-[#0b1f3a]"
              />
              <span className="text-sm text-slate-700">
                Set as current academic session
              </span>
            </label>
          </div>

          {/* ===== General Settings ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a]
                           uppercase tracking-wide mb-6">
              General Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="Asia/Kolkata">Asia / Kolkata</option>
                <option value="UTC">UTC</option>
              </Select>

              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
              </Select>
            </div>
          </div>

          {/* ===== Save ===== */}
          <div className="pt-2">
            <button
              disabled={saving}
              onClick={saveAcademicSettings}
              className="px-6 py-2.5 rounded-lg font-medium
                         bg-[#0b1f3a] text-white
                         hover:bg-[#091a30] transition
                         disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Academic Settings"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE INPUTS ================= */

function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-slate-200
                 bg-slate-50 text-sm
                 focus:ring-2 focus:ring-[#0b1f3a]
                 focus:border-[#0b1f3a]
                 outline-none transition"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-slate-200
                 bg-slate-50 text-sm
                 focus:ring-2 focus:ring-[#0b1f3a]
                 focus:border-[#0b1f3a]
                 outline-none transition"
    />
  );
}
