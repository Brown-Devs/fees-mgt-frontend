// src/pages/parent/ParentComplaintsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import { PageShell, Card, CardTitle, Badge, Spinner, ErrorBox, EmptyState } from "./components/ui";

const COMPLAINT_TYPES = ["School", "Teacher", "Accountant", "Transport", "Canteen", "Other"];

export default function ParentComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErr,    setFormErr]    = useState(null);

  const [form, setForm] = useState({
    title: "", description: "", complaintType: "", phone: "",
  });

  const load = () => {
    setLoading(true);
    // GET /api/complaints — the backend filters by schoolId and returns
    // complaints. Parent sees all complaints they submitted.
    api.get("/api/complaints")
      .then(res => setComplaints(res.data.data || []))
      .catch(err => setError(err?.response?.data?.message || "Failed to load complaints"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.complaintType) {
      return setFormErr("Title and complaint type are required.");
    }
    setFormErr(null);
    setSubmitting(true);
    try {
      await api.post("/api/complaints", form);
      setForm({ title: "", description: "", complaintType: "", phone: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setFormErr(err?.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} />;

  return (
    <PageShell title="Complaints" subtitle="Submit and track your complaints">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""} found</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#0a1a44] text-white rounded-lg text-sm font-semibold hover:bg-[#122b6b] transition"
        >
          {showForm ? "Cancel" : "+ New Complaint"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-[#0a1a44]">
          <CardTitle>Submit a Complaint</CardTitle>
          {formErr && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{formErr}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Title *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Brief title"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0a1a44]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Phone</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="Contact number"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0a1a44]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Complaint Against *</label>
              <select
                value={form.complaintType}
                onChange={e => setForm({ ...form, complaintType: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#0a1a44]"
              >
                <option value="">Select type</option>
                {COMPLAINT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0a1a44] resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 bg-[#0a1a44] text-white rounded-lg text-sm font-semibold hover:bg-[#122b6b] transition disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Complaint"}
            </button>
          </div>
        </Card>
      )}

      {/* List */}
      {complaints.length === 0 ? (
        <Card><EmptyState message="No complaints submitted yet." /></Card>
      ) : (
        complaints.map(c => (
          <Card key={c._id}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-[#0a1a44] text-sm">{c.title}</p>
                  <Badge status={c.complaintStatus || "Pending"} />
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{c.description}</p>
                <div className="flex gap-4 mt-2 flex-wrap">
                  <span className="text-xs text-slate-400">Type: {c.complaintType}</span>
                  {c.phone && <span className="text-xs text-slate-400">📞 {c.phone}</span>}
                  {c.targetName && <span className="text-xs text-slate-400">Against: {c.targetName}</span>}
                  {c.createdAt && (
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </PageShell>
  );
}
