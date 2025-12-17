import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const FeeRules = () => {
  const [feeHeads, setFeeHeads] = useState([]);
  const [classes, setClasses] = useState([]);
  const [rules, setRules] = useState([]);

  const [form, setForm] = useState({
    academicYear: "2024-25",
    feeHeadId: "",
    amount: "",
    frequency: "monthly",
    scope: "class",
    scopeRefId: "",
    dueDateDay: 10,
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Fee Heads
  const fetchFeeHeads = async () => {
    try {
      const res = await api.get("/api/fees/heads");
      setFeeHeads(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Classes
  const fetchClasses = async () => {
    try {
      const res = await api.get("/api/classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Fee Rules
  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/fees/rules");
      setRules(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeHeads();
    fetchClasses();
    fetchRules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post("/api/fees/rules", form);
      setRules((prev) => [...prev, res.data]);
      alert("Fee rule created successfully");

      setForm({
        academicYear: "2024-25",
        feeHeadId: "",
        amount: "",
        frequency: "monthly",
        scope: "class",
        scopeRefId: "",
        dueDateDay: 10,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create rule");
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h3 style={{ color: "navy" }}>Fee Structure</h3>

      {/* Create Rule Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: "30px",
          maxWidth: "600px",
        }}
      >
        {/* Academic Year */}
        <label>Academic Year</label>
        <input
          type="text"
          value={form.academicYear}
          onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
          className="input"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        {/* Fee Head */}
        <label>Fee Head *</label>
        <select
          value={form.feeHeadId}
          onChange={(e) => setForm({ ...form, feeHeadId: e.target.value })}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="">Select Fee Head</option>
          {feeHeads.map((fh) => (
            <option key={fh._id} value={fh._id}>
              {fh.name}
            </option>
          ))}
        </select>

        {/* Amount */}
        <label>Amount *</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        {/* Frequency */}
        <label>Frequency *</label>
        <select
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
          <option value="one-time">One Time</option>
        </select>

        {/* Scope */}
        <label>Scope *</label>
        <select
          value={form.scope}
          onChange={(e) => setForm({ ...form, scope: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="class">Class</option>
          <option value="global">Global</option>
        </select>

        {/* Class Dropdown (only if scope = class) */}
        {form.scope === "class" && (
          <>
            <label>Class *</label>
            <select
              value={form.scopeRefId}
              onChange={(e) => setForm({ ...form, scopeRefId: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Due Date */}
        <label>Due Date Day</label>
        <input
          type="number"
          value={form.dueDateDay}
          onChange={(e) => setForm({ ...form, dueDateDay: e.target.value })}
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
          disabled={submitting}
          style={{
            background: submitting ? "#999" : "navy",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Saving..." : "Create Rule"}
        </button>
      </form>

      {/* Rules Table */}
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
            <th style={{ padding: "10px" }}>Fee Head</th>
            <th style={{ padding: "10px" }}>Amount</th>
            <th style={{ padding: "10px" }}>Frequency</th>
            <th style={{ padding: "10px" }}>Scope</th>
            <th style={{ padding: "10px" }}>Class</th>
            <th style={{ padding: "10px" }}>Year</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ padding: "20px", textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : rules.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: "20px", textAlign: "center" }}>
                No rules found
              </td>
            </tr>
          ) : (
            rules.map((rule) => (
              <tr key={rule._id}>
                <td style={{ padding: "10px" }}>{rule.feeHead?.name}</td>
                <td style={{ padding: "10px" }}>{rule.amount}</td>
                <td style={{ padding: "10px" }}>{rule.frequency}</td>
                <td style={{ padding: "10px" }}>{rule.scope}</td>
                <td style={{ padding: "10px" }}>
                  {rule.scope === "class" ? rule.class?.name : "-"}
                </td>
                <td style={{ padding: "10px" }}>{rule.academicYear}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FeeRules;
