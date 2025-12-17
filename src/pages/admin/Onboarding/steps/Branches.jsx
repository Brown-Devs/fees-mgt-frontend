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

  if (loading) return <div>Loading branches...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Branch Setup</h2>

      {/* Add / Edit Branch */}
      <div className="border rounded-lg p-4 bg-slate-50">
        <h3 className="text-sm font-medium mb-3">
          {editingId ? "Edit Branch" : "Add New Branch"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Branch Name *" name="name" value={form.name} onChange={handleChange} />
          <Input label="Branch Code" name="code" value={form.code} onChange={handleChange} />
          <Input label="Contact Phone" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
          <Input label="Contact Email" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
          <div className="sm:col-span-2">
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={saveBranch}
            disabled={saving}
            className="bg-emerald-600 text-white px-6 py-2 rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Branch" : "Add Branch"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Branch List */}
      <div className="space-y-3">
        {branches.length === 0 && (
          <p className="text-sm text-slate-500">No branches created yet.</p>
        )}

        {branches.map((b) => (
          <div
            key={b._id}
            className="border rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="font-medium">{b.name}</div>
              <div className="text-xs text-slate-500">
                {b.address || "No address"}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(b)}
                className="px-3 py-1 text-sm border rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBranch(b._id)}
                className="px-3 py-1 text-sm border border-rose-200 text-rose-600 rounded"
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-slate-600">{label}</label>
      <input
        {...props}
        className="w-full border px-3 py-2 rounded text-sm"
      />
    </div>
  );
}
