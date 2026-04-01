import React, { useState } from "react";
import api from "../../../apis/axios";

export default function ExamTypeForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/exam-types", form);
      alert("Exam type created successfully!");
      setForm({ name: "", description: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Error creating exam type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      <input name="name" placeholder="Exam Type Name" value={form.name} onChange={handleChange} className="border p-2 w-full" required />
      <input name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} className="border p-2 w-full" />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? "Saving..." : "Create Exam Type"}
      </button>
    </form>
  );
}
