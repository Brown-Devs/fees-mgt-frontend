import React, { useState } from "react";
import api from "../../../apis/axios";
import { PERMISSIONS } from "../../../constants/permissions";
import PermissionGroup from "../../../components/PermissionGroup";

const StaffForm = ({ role, staff, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: staff?.fullName || "",
    email: staff?.email || "",
    phone: staff?.phone || "",
    password: "",
    permissions: staff?.permissions || []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (staff) {
        await api.put(`/api/users/${staff._id}`, form);
      } else {
        if (!form.password) {
          alert("Password is required for new staff");
          return;
        }
        await api.post("/api/users", {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role,
          permissions: form.permissions,
        });
      }
      alert("User saved successfully!");
      onSuccess();
    } catch (err) {
      console.error("Failed to save staff:", err);
      alert("Error saving staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="border p-2 w-full" />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 w-full" />
      {!staff && (
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 w-full" />
      )}


      <PermissionGroup
        title="Dashboard"
        options={PERMISSIONS.DASHBOARD}
        values={form.permissions}
        onChange={(vals) => setForm({ ...form, permissions: vals })}
      />
      <PermissionGroup
        title="School Details"
        options={PERMISSIONS.SCHOOL_DETAILS}
        values={form.permissions}
        onChange={(vals) => setForm({ ...form, permissions: vals })}
      />
      <PermissionGroup
        title="Fees Management"
        options={PERMISSIONS.FEES}
        values={form.permissions}
        onChange={(vals) => setForm({ ...form, permissions: vals })}
      />


      <button type="submit" disabled={loading} className="px-4 py-2 bg-[#0a1a44] text-white rounded">
        {loading ? "Saving..." : staff ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default StaffForm;
