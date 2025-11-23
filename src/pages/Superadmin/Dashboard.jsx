import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Superadmin Dashboard (copy-paste ready)
 * - Complete Add / View / Edit / ApiKey modals included
 * - Action buttons use type="button"
 * - Expects backend endpoints at /api/schools
 */

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://fees-mgmt-backend-1.onrender.com";
const TOKEN_KEY = "token";

function getAuthHeader() {
  const token = localStorage.getItem(TOKEN_KEY) || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatDate(s) {
  try { return new Date(s).toLocaleString(); } catch (e) { return s || "-"; }
}

/* ---------- Card ---------- */
function Card({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{title}</p>
          <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
        </div>
        <div className="flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-50 text-indigo-700 rounded-full p-2.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* Dummy usage bar data */
const DUMMY_USAGE = [50, 120, 90, 30, 200, 140, 80];

/* ---------- AddSchoolModal ---------- */
function AddSchoolModal({ onClose = () => {}, onCreate = async () => {} }) {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "", code: "", address: "", city: "", state: "", pin: "", contactEmail: "", contactPhone: ""
  });

  async function submit() {
    if (!form.name || !form.code || !form.address) { alert("Please fill name, code and address"); return; }
    setCreating(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        address: form.address,
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
        meta: { city: form.city || undefined, state: form.state || undefined, pin: form.pin || undefined }
      };
      await onCreate(payload);
      onClose();
    } catch (err) {
      alert("Create failed: " + (err?.message || err));
    } finally { setCreating(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl bg-white rounded-lg shadow-lg border">
        <div className="px-6 py-3 border-b"><h3 className="text-lg font-semibold">Create School</h3></div>
        <div className="p-6 overflow-auto max-h-[68vh]">
          <div className="grid gap-4">
            <div><label className="block text-sm mb-1">Name *</label><input className="w-full px-3 py-2 border rounded" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
            <div><label className="block text-sm mb-1">Code *</label><input className="w-full px-3 py-2 border rounded" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} /></div>
            <div><label className="block text-sm mb-1">Address *</label><input className="w-full px-3 py-2 border rounded" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">City</label><input className="w-full px-3 py-2 border rounded" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} /></div>
              <div><label className="block text-sm mb-1">State</label><input className="w-full px-3 py-2 border rounded" value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} /></div>
            </div>

            <div><label className="block text-sm mb-1">PIN</label><input className="w-full px-3 py-2 border rounded" value={form.pin} onChange={e=>setForm(f=>({...f,pin:e.target.value}))} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">Contact Email</label><input className="w-full px-3 py-2 border rounded" value={form.contactEmail} onChange={e=>setForm(f=>({...f,contactEmail:e.target.value}))} /></div>
              <div><label className="block text-sm mb-1">Contact Phone</label><input className="w-full px-3 py-2 border rounded" value={form.contactPhone} onChange={e=>setForm(f=>({...f,contactPhone:e.target.value}))} /></div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="button" onClick={submit} disabled={creating} className="px-4 py-2 bg-indigo-600 text-white rounded">{creating ? 'Creating...' : 'Create School'}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- ViewSchoolModal ---------- */
function ViewSchoolModal({ school = null, onClose = () => {} }) {
  if (!school) return null;
  const city = school.city || (school.meta && school.meta.city) || '-';
  const state = school.state || (school.meta && school.meta.state) || '-';
  const pin = school.pin || (school.meta && school.meta.pin) || '-';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg border overflow-auto">
        <div className="px-6 py-3 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">School Details</h3>
          <button type="button" onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="p-6 space-y-3">
          <div><strong>Name:</strong> {school.name}</div>
          <div><strong>Code:</strong> {school.code || '-'}</div>
          <div><strong>Address:</strong> {school.address || '-'}</div>
          <div><strong>City:</strong> {city}</div>
          <div><strong>State:</strong> {state}</div>
          <div><strong>PIN:</strong> {pin}</div>
          <div><strong>Contact Email:</strong> {school.contactEmail || '-'}</div>
          <div><strong>Contact Phone:</strong> {school.contactPhone || '-'}</div>
          <div><strong>Created:</strong> {formatDate(school.createdAt || school.created_at)}</div>
          
        </div>
      </div>
    </div>
  );
}

/* ---------- EditSchoolModal ---------- */
function EditSchoolModal({ school = null, onClose = () => {}, onSave = async () => {} }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', code: '', address: '', city: '', state: '', pin: '', contactEmail: '', contactPhone: ''
  });

  useEffect(() => {
    if (!school) return;
    setForm({
      name: school.name || '',
      code: school.code || '',
      address: school.address || '',
      city: school.city || (school.meta && school.meta.city) || '',
      state: school.state || (school.meta && school.meta.state) || '',
      pin: school.pin || (school.meta && school.meta.pin) || '',
      contactEmail: school.contactEmail || '',
      contactPhone: school.contactPhone || ''
    });
  }, [school]);

  async function save() {
    if (!form.name || !form.code) { alert('Name and code required'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        address: form.address,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        meta: { ...(school?.meta || {}), city: form.city, state: form.state, pin: form.pin }
      };
      await onSave(school._id || school.id, payload);
      onClose();
    } catch (err) {
      alert('Save failed: ' + (err?.message || err));
    } finally { setSaving(false); }
  }

  if (!school) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl bg-white rounded-lg shadow-lg border">
        <div className="px-6 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit School</h3>
          <button type="button" onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="p-6 overflow-auto max-h-[68vh]">
          <div className="grid gap-4">
            <div><label className="block text-sm mb-1">School Name</label><input className="w-full px-3 py-2 border rounded" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
            <div><label className="block text-sm mb-1">Code</label><input className="w-full px-3 py-2 border rounded" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} /></div>
            <div><label className="block text-sm mb-1">Address</label><input className="w-full px-3 py-2 border rounded" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">City</label><input className="w-full px-3 py-2 border rounded" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} /></div>
              <div><label className="block text-sm mb-1">State</label><input className="w-full px-3 py-2 border rounded" value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} /></div>
            </div>

            <div><label className="block text-sm mb-1">PIN</label><input className="w-full px-3 py-2 border rounded" value={form.pin} onChange={e=>setForm(f=>({...f,pin:e.target.value}))} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">Contact Email</label><input className="w-full px-3 py-2 border rounded" value={form.contactEmail} onChange={e=>setForm(f=>({...f,contactEmail:e.target.value}))} /></div>
              <div><label className="block text-sm mb-1">Contact Phone</label><input className="w-full px-3 py-2 border rounded" value={form.contactPhone} onChange={e=>setForm(f=>({...f,contactPhone:e.target.value}))} /></div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="button" onClick={save} disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded">{saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- ApiKeyModal (demo) ---------- */
function ApiKeyModal({ onClose = () => {}, onCreate = async () => {} }) {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ provider: "sensy", key: "", credits: 1000 });

  async function submit() {
    if (!form.key) { alert("Enter key"); return; }
    setCreating(true);
    try {
      await onCreate(form);
      onClose();
    } catch (err) {
      alert("API key create failed: " + (err?.message || err));
    } finally { setCreating(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg border">
        <div className="px-6 py-4 border-b"><h3 className="text-lg font-semibold">Create API Key</h3></div>
        <div className="p-6">
          <label className="block text-sm mb-1">Provider</label>
          <input className="w-full px-3 py-2 border rounded mb-2" value={form.provider} onChange={e=>setForm(f=>({...f,provider:e.target.value}))} />
          <label className="block text-sm mb-1">Key</label>
          <input className="w-full px-3 py-2 border rounded mb-2" value={form.key} onChange={e=>setForm(f=>({...f,key:e.target.value}))} />
          <label className="block text-sm mb-1">Credits</label>
          <input type="number" className="w-full px-3 py-2 border rounded mb-2" value={form.credits} onChange={e=>setForm(f=>({...f,credits:Number(e.target.value)}))} />
        </div>
        <div className="px-6 py-3 border-t flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
          <button type="button" onClick={submit} disabled={creating} className="px-4 py-2 bg-purple-600 text-white rounded-md">{creating ? "Creating..." : "Create Key"}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Dashboard Component ---------- */
export default function SuperadminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsPage, setSchoolsPage] = useState(1);
  const [schoolsLimit] = useState(10);
  const [schoolsTotal, setSchoolsTotal] = useState(0);
  const [schoolsSearch, setSchoolsSearch] = useState("");
  const [overview, setOverview] = useState({ totalSchools: 0, activeSchools: 0, totalCredits: 0, pendingInvoices: 0 });

  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddApiKey, setShowAddApiKey] = useState(false);
  const [viewingSchool, setViewingSchool] = useState(null);
  const [editingSchool, setEditingSchool] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    navigate("/login", { replace: true });
  }

  async function fetchSchools(page = 1, limit = schoolsLimit, search = "") {
    setSchoolsLoading(true);
    try {
      const params = new URLSearchParams();
      if (limit) params.set("limit", limit);
      if (page) params.set("page", page);
      if (search) params.set("search", search);
      const url = `${BASE_URL}/api/schools?${params.toString()}`;
      const res = await fetch(url, { headers: { "Content-Type": "application/json", ...getAuthHeader() } });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || `HTTP ${res.status}`);

      const arr = Array.isArray(body)
        ? body
        : (body.data && Array.isArray(body.data))
          ? body.data
          : (body.schools && Array.isArray(body.schools))
            ? body.schools
            : (body.items || []);
      const total = body.total ?? (Array.isArray(arr) ? arr.length : 0);

      setSchools(arr);
      setSchoolsTotal(total);

      const activeCount = arr.filter(s => s.isActive === true).length;
      setOverview(prev => ({ ...prev, totalSchools: total, activeSchools: activeCount }));
    } catch (err) {
      console.error("fetchSchools error", err);
      alert("Failed to load schools: " + (err?.message || err));
    } finally {
      setSchoolsLoading(false);
    }
  }

  useEffect(() => { fetchSchools(1, schoolsLimit, ""); }, []);

  async function handleCreateSchool(payload) {
    try {
      const res = await fetch(`${BASE_URL}/api/schools/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || JSON.stringify(body) || `HTTP ${res.status}`);
      await fetchSchools(1, schoolsLimit, schoolsSearch);
      setActiveTab("schools");
      return body;
    } catch (err) {
      console.error("Create school failed", err);
      alert("Error creating school: " + (err?.message || err));
      throw err;
    }
  }

  async function handleDeleteSchool(id) {
    if (!confirm("Delete this school? This cannot be undone.")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/schools/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getAuthHeader() }
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || `HTTP ${res.status}`);
      await fetchSchools(1, schoolsLimit, schoolsSearch);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed: " + (err?.message || err));
    }
  }

  async function handleSaveSchool(id, payload) {
    try {
      const res = await fetch(`${BASE_URL}/api/schools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || JSON.stringify(body) || `HTTP ${res.status}`);
      await fetchSchools(1, schoolsLimit, schoolsSearch);
      return body;
    } catch (err) {
      console.error("Save school failed", err);
      throw err;
    }
  }

  function handleSearchChange(q) {
    setSchoolsSearch(q);
    fetchSchools(1, schoolsLimit, q);
    setSchoolsPage(1);
  }

  async function handleCreateApiKey(payload) {
    // Demo placeholder — replace with real endpoint if available
    alert("Create API key demo — not wired to backend. Replace this with your POST /api/apikeys.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-gray-800">
      <div className="grid grid-cols-12 gap-0">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 bg-white border-r border-slate-100 px-6 py-6 flex flex-col">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-2xl font-semibold text-indigo-700 tracking-tight">School Management</span>
            </div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Superadmin</div>
          </div>

          <nav className="space-y-1 text-sm flex-1">
            <button type="button" onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${activeTab === "dashboard" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}><span>Dashboard</span></button>
            <button type="button" onClick={() => setActiveTab("schools")} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${activeTab === "schools" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}><span>Schools</span></button>
            <button type="button" onClick={() => setActiveTab("apikeys")} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${activeTab === "apikeys" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}><span>API Keys</span></button>
            <button type="button" onClick={() => setActiveTab("billing")} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${activeTab === "billing" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}><span>Usage & Billing</span></button>

            <div className="border-t border-slate-100 mt-6 pt-4">
              <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium">⎋ <span>Logout</span></button>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-9 px-6 py-6">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Search schools</label>
              <div className="relative max-w-xl">
                <input onChange={e => handleSearchChange(e.target.value)} placeholder="Search school name, code or city..." className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500 bg-white" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => { setShowAddSchool(true); setActiveTab("schools"); }} className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700">＋ <span>Add School</span></button>
              <button type="button" onClick={() => { setShowAddApiKey(true); setActiveTab("apikeys"); }} className="px-3.5 py-2 bg-white border border-indigo-100 rounded-lg text-sm text-indigo-700 hover:bg-indigo-50">Add API Key</button>
              
            </div>
          </div>

          {/* Stats */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card title="Total Schools" value={overview.totalSchools ?? 0} subtitle="Active / Total" />
              <Card title="Active Schools" value={overview.activeSchools ?? 0} subtitle="Accepting enrollments" />
              <Card title="Total API Credits" value={overview.totalCredits ?? 0} subtitle="Sensy credits remaining" />
              <Card title="Pending Invoices" value={overview.pendingInvoices ?? 0} subtitle="Requires billing action" />
            </div>
          )}

          {/* Make table take full width by removing right aside */}
          <div className="grid grid-cols-1 gap-6">
            {/* Main full-width column */}
            <div className="space-y-6">
              {(activeTab === "dashboard" || activeTab === "schools") && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">Schools</h3>
                    <div className="text-xs text-slate-500">
                      {schoolsTotal ? `${Math.min((schoolsPage - 1) * schoolsLimit + 1, schoolsTotal)}–${Math.min(schoolsPage * schoolsLimit, schoolsTotal)} of ${schoolsTotal}` : ""}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-separate border-spacing-0">
                        <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Address</th>
                            <th className="px-4 py-3">City</th>
                            <th className="px-4 py-3">State</th>
                            <th className="px-4 py-3">PIN</th>
                            <th className="px-4 py-3 whitespace-nowrap">Created</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>

                        <tbody className="text-slate-700">
                          {schoolsLoading ? (
                            <tr><td colSpan="8" className="py-10 text-center text-slate-400">Loading schools…</td></tr>
                          ) : schools.length === 0 ? (
                            <tr><td colSpan="8" className="py-10 text-center text-slate-400">No schools found.</td></tr>
                          ) : schools.map((s, idx) => {
                            const city = s.city || (s.meta && s.meta.city) || "-";
                            const state = s.state || (s.meta && s.meta.state) || "-";
                            const pin = s.pin || (s.meta && s.meta.pin) || "-";
                            const striped = idx % 2 === 1;
                            return (
                              <tr key={s._id || s.id} className={`${striped ? "bg-slate-50/40" : "bg-white"} border-t border-slate-100 hover:bg-indigo-50/40`}>
                                <td className="px-4 py-3 max-w-xs">
                                  <p className="font-medium text-slate-900 truncate">{s.name}</p>
                                  {s.contactEmail && <p className="text-[11px] text-slate-400 truncate">{s.contactEmail}</p>}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">{s.code || "-"}</td>
                                <td className="px-4 py-3 max-w-xs"><p className="line-clamp-2 text-slate-600">{s.address || "-"}</p></td>
                                <td className="px-4 py-3 whitespace-nowrap">{city}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{state}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{pin}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{formatDate(s.createdAt || s.created_at)}</td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-end gap-2 text-xs">
                                    <button type="button" onClick={() => setViewingSchool(s)} className="px-2 py-1 rounded border border-indigo-100 text-indigo-600 hover:bg-indigo-50">View</button>
                                    <button type="button" onClick={() => { setEditingSchool(s); setShowEditModal(true); }} className="px-2 py-1 rounded border border-emerald-100 text-emerald-600 hover:bg-emerald-50">Edit</button>
                                    <button type="button" onClick={() => handleDeleteSchool(s._id || s.id)} className="px-2 py-1 rounded border border-rose-100 text-rose-600 hover:bg-rose-50">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div />
                      <div className="space-x-2">
                        <button type="button" disabled={schoolsPage <= 1} onClick={() => { const next = Math.max(1, schoolsPage - 1); setSchoolsPage(next); fetchSchools(next, schoolsLimit, schoolsSearch); }} className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50">Prev</button>
                        <button type="button" disabled={schoolsPage * schoolsLimit >= (schoolsTotal || schools.length)} onClick={() => { const next = schoolsPage + 1; setSchoolsPage(next); fetchSchools(next, schoolsLimit, schoolsSearch); }} className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50">Next</button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "apikeys" && (
                <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                  <h3 className="text-base font-semibold mb-2 text-slate-900">API Keys & Sensy (demo)</h3>
                  <p className="text-sm text-slate-600">Add keys using the button above. API usage charts and key assignment go inside this view (demo placeholder).</p>
                </section>
              )}
            </div>

            {/* Right sidebar widgets removed to allow table full width */}

          </div>
        </main>
      </div>

      {/* Modals */}
      {showAddSchool && <AddSchoolModal onClose={() => setShowAddSchool(false)} onCreate={handleCreateSchool} />}
      {showAddApiKey && <ApiKeyModal onClose={() => setShowAddApiKey(false)} onCreate={handleCreateApiKey} />}
      {viewingSchool && <ViewSchoolModal school={viewingSchool} onClose={() => setViewingSchool(null)} />}
      {showEditModal && <EditSchoolModal school={editingSchool} onClose={() => { setShowEditModal(false); setEditingSchool(null); }} onSave={handleSaveSchool} />}
    </div>
  );
}
