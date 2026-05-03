// src/pages/admin/Onboarding/steps/Branches.jsx
import { useEffect, useState } from "react";
import api from "../../../../apis/axios";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineCheckCircle } from "react-icons/hi2";

const EMPTY_BRANCH = { name: "", code: "", address: "", contactPhone: "", contactEmail: "" };
const EMPTY_ADMIN  = { fullName: "", email: "", phone: "", password: "" };

export default function Branches({ schoolId }) {
  const [branches,   setBranches]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState(EMPTY_BRANCH);
  const [adminForm,  setAdminForm]  = useState(EMPTY_ADMIN);
  const [editingId,  setEditingId]  = useState(null);
  const [saving,     setSaving]     = useState(false);

  // per-branch admin state (fetched lazily when expanded)
  const [expandedBranch,  setExpandedBranch]  = useState(null);
  const [branchAdmin,     setBranchAdmin]     = useState(null); // existing admin for expanded branch
  const [adminLoading,    setAdminLoading]    = useState(false);

  // password reset modal
  const [resetModal,   setResetModal]   = useState(null);  // { userId, branchName }
  const [newPassword,  setNewPassword]  = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // show/hide password fields
  const [showPwd,      setShowPwd]      = useState(false);
  const [showResetPwd, setShowResetPwd] = useState(false);

  useEffect(() => { fetchBranches(); }, [schoolId]);

  async function fetchBranches() {
    try {
      const res = await api.get("/api/branches", { params: { schoolId } });
      setBranches(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load branches");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBranchAdmin(branchId) {
    setAdminLoading(true);
    setBranchAdmin(null);
    try {
      const res = await api.get(`/api/users/branch-admin/${branchId}`);
      setBranchAdmin(res.data.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  }

  function toggleExpand(branch) {
    if (expandedBranch === branch._id) {
      setExpandedBranch(null);
      setBranchAdmin(null);
    } else {
      setExpandedBranch(branch._id);
      setAdminForm(EMPTY_ADMIN);
      fetchBranchAdmin(branch._id);
    }
  }

  function startEdit(branch) {
    setEditingId(branch._id);
    setForm({
      name: branch.name || "", code: branch.code || "",
      address: branch.address || "", contactPhone: branch.contactPhone || "",
      contactEmail: branch.contactEmail || "",
    });
    setExpandedBranch(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_BRANCH);
    setAdminForm(EMPTY_ADMIN);
  }

  async function saveBranch() {
    if (!form.name.trim()) return alert("Branch name is required");
    setSaving(true);
    try {
      const payload = {
        name: form.name, code: form.code,
        address: form.address, contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
      };

      let savedBranch;
      if (editingId) {
        const res = await api.put(`/api/branches/${editingId}`, payload);
        savedBranch = res.data;
      } else {
        const res = await api.post("/api/branches", { ...payload, schoolId });
        savedBranch = res.data;

        // If admin details filled, create branch admin immediately after branch creation
        if (adminForm.fullName && adminForm.email && adminForm.password) {
          await createBranchAdmin(savedBranch._id);
        }
      }

      resetForm();
      fetchBranches();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save branch");
    } finally {
      setSaving(false);
    }
  }

  async function createBranchAdmin(branchId) {
    if (!adminForm.fullName || !adminForm.email || !adminForm.password)
      return alert("Admin name, email and password are required");

    try {
      await api.post("/api/users", {
        fullName: adminForm.fullName,
        email: adminForm.email,
        phone: adminForm.phone,
        password: adminForm.password,
        role: "branch_admin",
        branchId,
      });
      setAdminForm(EMPTY_ADMIN);
      fetchBranchAdmin(branchId);
      alert("Branch admin created successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create branch admin");
      throw err;
    }
  }

  async function handleCreateAdminForExisting(branchId) {
    setSaving(true);
    try {
      await createBranchAdmin(branchId);
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    if (!newPassword || newPassword.length < 6)
      return alert("Password must be at least 6 characters");
    setResetLoading(true);
    try {
      await api.patch(`/api/users/${resetModal.userId}/reset-password`, { password: newPassword });
      alert("Password reset successfully!");
      setResetModal(null);
      setNewPassword("");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  }

  async function deleteBranch(id) {
    if (!confirm("Deactivate this branch?")) return;
    try {
      await api.delete(`/api/branches/${id}`);
      fetchBranches();
    } catch {
      alert("Failed to deactivate branch");
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading branches...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Branch Setup</h2>
          <p className="text-sm text-slate-500 mt-1">Add branches and assign a branch admin to each</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-[#0b1f3a]/10 text-[#0b1f3a] font-medium">
          Step 6 of 6
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_14px_36px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0b1f3a] to-[#162e52]" />
        <div className="p-8 space-y-10">

          {/* ===== ADD / EDIT BRANCH ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a] uppercase tracking-wide mb-6">
              {editingId ? "Edit Branch" : "Add New Branch"}
            </h3>

            {/* Branch fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Branch Name *" name="name"         value={form.name}         onChange={e => setForm({...form, name: e.target.value})} />
              <Field label="Branch Code"   name="code"         value={form.code}         onChange={e => setForm({...form, code: e.target.value})} />
              <Field label="Contact Phone" name="contactPhone" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} />
              <Field label="Contact Email" name="contactEmail" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} />
              <div className="sm:col-span-2">
                <Field label="Address" name="address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
            </div>

            {/* Branch Admin — only show for NEW branch */}
            {!editingId && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-[#0b1f3a] mb-1">
                  Branch Admin <span className="text-slate-400 font-normal">(optional — can add later)</span>
                </h4>
                <p className="text-xs text-slate-500 mb-5">
                  The branch admin will have full access to this branch — all modules except creating new branches.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Admin Full Name" value={adminForm.fullName} onChange={e => setAdminForm({...adminForm, fullName: e.target.value})} />
                  <Field label="Admin Email"     value={adminForm.email}    onChange={e => setAdminForm({...adminForm, email: e.target.value})} type="email" />
                  <Field label="Admin Phone"     value={adminForm.phone}    onChange={e => setAdminForm({...adminForm, phone: e.target.value})} />
                  <PasswordField
                    label="Admin Password"
                    value={adminForm.password}
                    show={showPwd}
                    onToggle={() => setShowPwd(v => !v)}
                    onChange={e => setAdminForm({...adminForm, password: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveBranch}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg font-medium bg-[#0b1f3a] text-white hover:bg-[#091a30] transition disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Branch" : "Add Branch"}
              </button>
              {editingId && (
                <button onClick={resetForm} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition">
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* ===== BRANCH LIST ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a] uppercase tracking-wide mb-6">
              Existing Branches
            </h3>

            {branches.length === 0 ? (
              <p className="text-sm text-slate-500">No branches created yet.</p>
            ) : (
              <div className="space-y-4">
                {branches.map(b => (
                  <div key={b._id} className="rounded-xl border border-slate-200 overflow-hidden">
                    {/* Branch row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{b.name}
                          {b.code && <span className="ml-2 text-xs text-slate-400">({b.code})</span>}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{b.address || "No address"}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => toggleExpand(b)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-[#0b1f3a] text-[#0b1f3a] hover:bg-[#0b1f3a]/5 transition"
                        >
                          {expandedBranch === b._id ? "Hide Admin" : "Manage Admin"}
                        </button>
                        <button onClick={() => startEdit(b)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-100 transition">
                          Edit
                        </button>
                        <button onClick={() => deleteBranch(b._id)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition">
                          Deactivate
                        </button>
                      </div>
                    </div>

                    {/* Admin panel — expanded */}
                    {expandedBranch === b._id && (
                      <div className="px-5 py-5 border-t border-slate-200 bg-white">
                        {adminLoading ? (
                          <p className="text-sm text-slate-500">Loading admin info...</p>
                        ) : branchAdmin ? (
                          /* Existing admin — show info + reset password */
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <HiOutlineCheckCircle className="text-green-600 text-xl shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-slate-800">{branchAdmin.fullName}</p>
                                <p className="text-xs text-slate-500">{branchAdmin.email} · Branch Admin</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setResetModal({ userId: branchAdmin._id, branchName: b.name })}
                              className="px-4 py-2 text-sm rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition"
                            >
                              Reset Password
                            </button>
                          </div>
                        ) : (
                          /* No admin yet — create one */
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-4">No admin assigned yet. Create one:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Full Name *" value={adminForm.fullName} onChange={e => setAdminForm({...adminForm, fullName: e.target.value})} />
                              <Field label="Email *"     value={adminForm.email}    onChange={e => setAdminForm({...adminForm, email: e.target.value})} type="email" />
                              <Field label="Phone"       value={adminForm.phone}    onChange={e => setAdminForm({...adminForm, phone: e.target.value})} />
                              <PasswordField
                                label="Password *"
                                value={adminForm.password}
                                show={showPwd}
                                onToggle={() => setShowPwd(v => !v)}
                                onChange={e => setAdminForm({...adminForm, password: e.target.value})}
                              />
                            </div>
                            <button
                              onClick={() => handleCreateAdminForExisting(b._id)}
                              disabled={saving}
                              className="mt-4 px-5 py-2.5 rounded-lg bg-[#0b1f3a] text-white text-sm font-medium hover:bg-[#091a30] transition disabled:opacity-60"
                            >
                              {saving ? "Creating..." : "Create Branch Admin"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ===== RESET PASSWORD MODAL ===== */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-[#0a1a44] mb-1">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-5">
              Set a new password for the admin of <strong>{resetModal.branchName}</strong>
            </p>
            <PasswordField
              label="New Password"
              value={newPassword}
              show={showResetPwd}
              onToggle={() => setShowResetPwd(v => !v)}
              onChange={e => setNewPassword(e.target.value)}
            />
            <div className="flex gap-3 mt-5 justify-end">
              <button
                onClick={() => { setResetModal(null); setNewPassword(""); }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="px-5 py-2 bg-[#0b1f3a] text-white rounded-lg text-sm font-medium hover:bg-[#091a30] transition disabled:opacity-60"
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== REUSABLE FIELD ===== */
function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#0b1f3a] focus:border-[#0b1f3a] outline-none transition"
      />
    </div>
  );
}

/* ===== PASSWORD FIELD WITH EYE TOGGLE ===== */
function PasswordField({ label, value, show, onToggle, onChange }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Min 6 characters"
          className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#0b1f3a] focus:border-[#0b1f3a] outline-none transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
        </button>
      </div>
    </div>
  );
}
