import React, { useState } from "react";
import api from "../../../apis/axios";

const CreateParentForm = ({ studentId, onSuccess }) => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/api/students/${studentId}/parent/create`, form);
      onSuccess(); // reload parent details
    } catch (err) {
      console.error("Failed to create parent:", err);
      alert("Error creating parent account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="border p-2 w-full" />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 w-full" />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 w-full" />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-[#0a1a44] text-white rounded">
        {loading ? "Creating..." : "Create Parent"}
      </button>
    </form>
  );
};

export default CreateParentForm;
