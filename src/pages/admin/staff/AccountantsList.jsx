import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import StaffForm from "./CreateStaff";

const AccountantList = () => {
  const [accountants, setAccountants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAccountant, setEditAccountant] = useState(null);

  const loadAccountants = async () => {
    try {
      const res = await api.get("/api/staff/accountants");
      setAccountants(res.data.data);
    } catch (err) {
      console.error("Failed to load accountants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccountants();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading accountants...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-[#0a1a44]">Accountants</h2>

      {/* Create button */}
      <button
        onClick={() => {
          setEditAccountant(null);
          setShowForm(true);
        }}
        className="mb-4 px-5 py-2 bg-[#0a1a44] text-white rounded hover:bg-[#132b6b] transition"
      >
        + Create Accountant
      </button>

      {/* Form for create/edit */}
      {showForm && (
        <StaffForm
          role="accountant"
          staff={editAccountant}
          onSuccess={() => {
            setShowForm(false);
            loadAccountants();
          }}
        />
      )}

      {/* Table */}
      {accountants.length === 0 ? (
        <p className="text-gray-500">No accountants found.</p>
      ) : (
        <table className="w-full border border-[#0a1a44] rounded overflow-hidden">
          <thead>
            <tr className="bg-[#0a1a44] text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accountants.map((acc, idx) => (
              <tr
                key={acc._id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-3">{acc.fullName}</td>
                <td className="p-3">{acc.email}</td>
                <td className="p-3">{acc.phone || "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      acc.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {acc.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setEditAccountant(acc);
                      setShowForm(true);
                    }}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountantList;
