import { useEffect, useState } from "react";
import api from "../../../../apis/axios";

export default function Branches({ schoolId }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    contactPhone: "",
    contactEmail: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, [schoolId]);

  async function fetchBranches() {
    try {
      const res = await api.get("/api/branches", {
        params: { schoolId },
      });
      setBranches(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load branches");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(branch) {
    setEditingId(branch._id);
    setForm({
      name: branch.name || "",
      code: branch.code || "",
      address: branch.address || "",
      contactPhone: branch.contactPhone || "",
      contactEmail: branch.contactEmail || "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      code: "",
      address: "",
      contactPhone: "",
      contactEmail: "",
    });
  }

  async function saveBranch() {
    if (!form.name.trim()) {
      alert("Branch name is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        address: form.address,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
      };

      if (editingId) {
        await api.put(`/api/branches/${editingId}`, payload);
      } else {
        await api.post("/api/branches", {
          ...payload,
          schoolId,
        });
      }

      resetForm();
      fetchBranches();
    } catch (err) {
      console.error(err);
      alert("Failed to save branch");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBranch(id) {
    if (!confirm("Deactivate this branch?")) return;
    try {
      await api.delete(`/api/branches/${id}`);
      fetchBranches();
    } catch (err) {
      console.error(err);
      alert("Failed to deactivate branch");
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading branches...</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Branch Setup
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Add and manage branch campuses
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full
                         bg-[#0b1f3a]/10 text-[#0b1f3a] font-medium">
          Step 5 of 5
        </span>
      </div>

      {/* Premium Card */}
      <div className="bg-white rounded-2xl
                      shadow-[0_14px_36px_rgba(0,0,0,0.08)]
                      border border-slate-200 overflow-hidden">

        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r
                        from-[#0b1f3a] to-[#162e52]" />

        <div className="p-8 space-y-12">

          {/* ===== Add / Edit Branch ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a]
                           uppercase tracking-wide mb-6">
              {editingId ? "Edit Branch" : "Add New Branch"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Branch Name *"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                label="Branch Code"
                name="code"
                value={form.code}
                onChange={handleChange}
              />
              <Input
                label="Contact Phone"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
              />
              <Input
                label="Contact Email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={saveBranch}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg font-medium
                           bg-[#0b1f3a] text-white
                           hover:bg-[#091a30] transition
                           disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Branch"
                    : "Add Branch"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-lg border border-slate-300
                             text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* ===== Branch List ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a]
                           uppercase tracking-wide mb-6">
              Existing Branches
            </h3>

            {branches.length === 0 ? (
              <p className="text-sm text-slate-500">
                No branches created yet.
              </p>
            ) : (
              <div className="space-y-4">
                {branches.map((b) => (
                  <div
                    key={b._id}
                    className="flex flex-col sm:flex-row sm:items-center
                               justify-between gap-4
                               rounded-xl border border-slate-200
                               bg-slate-50 px-5 py-4"
                  >
                    <div>
                      <div className="font-medium text-slate-900">
                        {b.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {b.address || "No address provided"}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(b)}
                        className="px-4 py-1.5 text-sm rounded-lg
                                   border border-slate-300
                                   hover:bg-slate-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBranch(b._id)}
                        className="px-4 py-1.5 text-sm rounded-lg
                                   border border-rose-200 text-rose-600
                                   hover:bg-rose-50 transition"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl
                   border border-slate-200 bg-slate-50 text-sm
                   focus:ring-2 focus:ring-[#0b1f3a]
                   focus:border-[#0b1f3a]
                   outline-none transition"
      />
    </div>
  );
}
