import React, { useState } from "react";
import api from "../../../apis/axios";
import { PERMISSIONS, PERMISSION_LABELS } from "../../../constants/permissions";
import PermissionGroup from "../../../components/PermissionGroup";

const StaffForm = ({ role, staff, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: staff?.fullName || "",
    email: staff?.email || "",
    phone: staff?.phone || "",
    password: "",
    permissions: staff?.permissions || [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!staff && !form.password) return alert("Password is required for new staff");
    setLoading(true);
    try {
      if (staff) {
        await api.put(`/api/users/${staff._id}`, {
          fullName: form.fullName,
          phone: form.phone,
          permissions: form.permissions,
        });
      } else {
        await api.post("/api/users", {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role,
          permissions: form.permissions,
        });
      }
      alert("Staff saved successfully!");
      onSuccess();
    } catch (err) {
      console.error("Failed to save staff:", err);
      alert(err?.response?.data?.message || "Error saving staff");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "border border-gray-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1a44]";

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-bold text-[#0a1a44] mb-4">
        {staff ? "Edit" : "Create"} {role.charAt(0).toUpperCase() + role.slice(1)}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name" value={form.fullName}
            onChange={handleChange} className={inputCls} required />
          <input name="email" placeholder="Email" value={form.email} type="email"
            onChange={handleChange} className={inputCls} required disabled={!!staff} />
          <input name="phone" placeholder="Phone" value={form.phone}
            onChange={handleChange} className={inputCls} />
          {!staff && (
            <input name="password" type="password" placeholder="Password"
              value={form.password} onChange={handleChange} className={inputCls} />
          )}
        </div>

        {/* Permissions */}
        <div>
          <h4 className="font-semibold text-[#0a1a44] mb-3 text-sm tracking-wide uppercase">
            Permissions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(PERMISSIONS).map(([key, options]) => (
              <PermissionGroup
                key={key}
                title={PERMISSION_LABELS[key] || key}
                options={options}
                values={form.permissions}
                onChange={(vals) => setForm((prev) => ({ ...prev, permissions: vals }))}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#0a1a44] text-white rounded hover:bg-[#132b6b] transition text-sm font-medium"
          >
            {loading ? "Saving..." : staff ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onSuccess}
            className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;