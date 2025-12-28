import React, { useState } from "react";
import api from "../../../apis/axios";

const LinkParentForm = ({ studentId, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/api/students/${studentId}/parent/link`, { parentEmail: email });
      onSuccess();
    } catch (err) {
      console.error("Failed to link parent:", err);
      alert("Error linking parent account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Parent Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-[#0a1a44] text-white rounded">
        {loading ? "Linking..." : "Link Parent"}
      </button>
    </form>
  );
};

export default LinkParentForm;
