import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    section: "",
    stream: "Regular",
  });

  const [editing, setEditing] = useState(null);

  // Fetch classes
  const fetchClasses = async () => {
  setLoading(true);
  try {
    const res = await api.get("/api/classes");
    setClasses(res.data.data);
  } catch (err) {
    console.error("Failed to load classes", err);
    alert("Failed to load classes");
  }
  setLoading(false);
};


  useEffect(() => {
    fetchClasses();
  }, []);

  // Create class
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const schoolId = user?.schoolId;
      const branchId = user?.branchId;

      const res = await api.post("/api/classes", {
        schoolId,
        branchId,
        name: form.name,
        section: form.section,
        stream: form.stream,
      });

      setClasses((prev) => [...prev, res.data.data]);
      setForm({ name: "", section: "", stream: "Regular" });
    } catch (err) {
      console.error(err);
      alert("Failed to create class");
    }

    setSubmitting(false);
  };

  // Delete class
  const deleteClass = async (id) => {
    if (!confirm("Delete this class?")) return;

    try {
      await api.delete(`/api/classes/${id}`);
      setClasses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete class");
    }
  };

  // Update class
  const updateClass = async () => {
    try {
      const res = await api.put(`/api/classes/${editing._id}`, editing);

      setClasses((prev) =>
        prev.map((c) => (c._id === editing._id ? res.data.data : c))
      );

      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update class");
    }
  };

  return (
    <div>
      <h2 style={{ color: "navy", marginBottom: "20px" }}>Class Management</h2>

      {/* Create Class Form */}
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
        <label>Class Name *</label>
        <input
          type="text"
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

        <label>Section</label>
        <input
          type="text"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <label>Stream *</label>
        <select
          value={form.stream}
          onChange={(e) => setForm({ ...form, stream: e.target.value })}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="Regular">Regular</option>
          <option value="Science">Science</option>
          <option value="Arts">Arts</option>
          <option value="Commerce">Commerce</option>
        </select>

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
          {submitting ? "Saving..." : "Add Class"}
        </button>
      </form>

      {/* Class Table */}
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
            <th style={{ padding: "10px" }}>Class</th>
            <th style={{ padding: "10px" }}>Section</th>
            <th style={{ padding: "10px" }}>Stream</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : classes.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
                No classes found
              </td>
            </tr>
          ) : (
            classes.map((cls) => (
              <tr key={cls._id}>
                <td style={{ padding: "10px" }}>{cls.name}</td>
                <td style={{ padding: "10px" }}>{cls.section || "-"}</td>
                <td style={{ padding: "10px" }}>{cls.stream}</td>

                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => setEditing(cls)}
                    style={{
                      background: "navy",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      marginRight: "10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteClass(cls._id)}
                    style={{
                      background: "red",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h3>Edit Class</h3>

            <label>Name</label>
            <input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />

            <label>Section</label>
            <input
              value={editing.section}
              onChange={(e) =>
                setEditing({ ...editing, section: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />

            <label>Stream</label>
            <select
              value={editing.stream}
              onChange={(e) =>
                setEditing({ ...editing, stream: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <option value="Regular">Regular</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
            </select>

            <button
              onClick={updateClass}
              style={{
                background: "navy",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Save
            </button>

            <button
              onClick={() => setEditing(null)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;
