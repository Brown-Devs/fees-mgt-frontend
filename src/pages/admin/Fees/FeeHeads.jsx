import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const FeeHeads = () => {
  const [feeHeads, setFeeHeads] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeeHeads = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/fees/heads");
      setFeeHeads(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load fee heads");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeHeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("api/fees/heads", form);
      setFeeHeads((prev) => [...prev, res.data]);
      setForm({ name: "", code: "", description: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create fee head");
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h3 style={{ color: "navy" }}>Fee Heads</h3>

      {/* Create Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <button
          type="submit"
          disabled={submitting || !form.name}
          style={{
            background: submitting ? "#999" : "navy",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Saving..." : "Add Fee Head"}
        </button>
      </form>

      {/* Table */}
      <table
        style={{
          width: "100%",
          background: "white",
          borderCollapse: "collapse",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ background: "navy", color: "white" }}>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Code</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Active</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : feeHeads.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
                No fee heads found
              </td>
            </tr>
          ) : (
            feeHeads.map((head) => (
              <tr key={head._id}>
                <td style={{ padding: "10px" }}>{head.name}</td>
                <td style={{ padding: "10px" }}>{head.code}</td>
                <td style={{ padding: "10px" }}>{head.description}</td>
                <td style={{ padding: "10px" }}>
                  {head.isActive ? "Yes" : "No"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FeeHeads;
