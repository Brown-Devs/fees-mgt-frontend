import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import CreateParentForm from "./ParentForm";
import LinkParentForm from "./LinkParentForm";

const ParentDetails = ({ studentId }) => {
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const loadParent = async () => {
    try {
      const res = await api.get(`/api/students/${studentId}/parent`);
      setParent(res.data.data);
    } catch (err) {
      console.error("Failed to load parent details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadParent(); }, [studentId]);

  const unlinkParent = async () => {
    if (!window.confirm("Unlink this parent account?")) return;
    try {
      await api.delete(`/api/students/${studentId}/parent`);
      loadParent();
    } catch (err) {
      console.error("Failed to unlink parent:", err);
    }
  };

  if (loading) return <p>Loading parent details...</p>;

  if (!parent) {
    return (
      <div>
        <p>No parent login linked.</p>
        <div className="flex gap-4 mt-4">
          <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-green-600 text-white rounded">
            {showCreate ? "Cancel" : "Create Parent"}
          </button>
          <button onClick={() => setShowLink(!showLink)} className="px-4 py-2 bg-blue-600 text-white rounded">
            {showLink ? "Cancel" : "Link Existing"}
          </button>
        </div>
        {showCreate && <CreateParentForm studentId={studentId} onSuccess={loadParent} />}
        {showLink && <LinkParentForm studentId={studentId} onSuccess={loadParent} />}
      </div>
    );
  }

  return (
    <div>
      <p><strong>Name:</strong> {parent.fullName}</p>
      <p><strong>Email:</strong> {parent.email}</p>
      <p><strong>Phone:</strong> {parent.phone || "-"}</p>
      <button onClick={unlinkParent} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
        Unlink Parent
      </button>
    </div>
  );
};

export default ParentDetails;
