import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

const TransportManagementPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    fee: "",
    pickupPoints: "",
    busNumber: "",
    driverName: "",
  });

  const loadRoutes = async () => {
    try {
      const schoolId = localStorage.getItem("schoolId");
      const res = await api.get("/api/transport/routes", {
        params: { schoolId },
      });
      setRoutes(res.data?.data || []);
    } catch {
      alert("Failed to load routes");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolId = localStorage.getItem("schoolId");

    await api.post("/api/transport/routes", { ...form, schoolId });

    setForm({
      name: "",
      fee: "",
      pickupPoints: "",
      busNumber: "",
      driverName: "",
    });

    setShowModal(false);
    loadRoutes();
  };

  const handleUpdate = async () => {
    await api.put(`/api/transport/routes/${editing._id}`, editing);
    setEditing(null);
    loadRoutes();
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/transport/routes/${id}`);
    loadRoutes();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Page Header */}
          <PageHeader
            title="Transport Management"
            subtitle="Manage transport routes, fees and vehicle details."
            buttonText="+ Add Route"
            onButtonClick={() => setShowModal(true)}
          />

          {/* Table Section */}
          <TableCard title="Route List">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Route
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Pickup
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Bus
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Driver
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : routes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                        No routes found
                      </td>
                    </tr>
                  ) : (
                    routes.map((r) => (
                      <tr key={r._id} className="hover:bg-[#001f3f]/[0.02]">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {r.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          ₹{r.fee}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {r.pickupPoints || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {r.busNumber || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {r.driverName || "-"}
                        </td>
                        <td className="px-6 py-4 text-center space-x-3">
                          <button
                            onClick={() => setEditing(r)}
                            className="text-[#001f3f] font-medium hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="text-rose-600 font-medium hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TableCard>

        </div>
      </div>

      {/* ================= ADD ROUTE MODAL ================= */}
      {showModal && (
        <Modal
          title="Add Route"
          form={form}
          setForm={setForm}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* ================= EDIT ROUTE MODAL ================= */}
      {editing && (
        <Modal
          title="Edit Route"
          form={editing}
          setForm={setEditing}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
};

/* ================= REUSABLE MODAL ================= */

const Modal = ({ title, form, setForm, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
        <h3 className="text-xl font-semibold text-[#001f3f]">
          {title}
        </h3>

        <input
          type="text"
          placeholder="Route Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />

        <input
          type="number"
          placeholder="Fee"
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />

        <textarea
          placeholder="Pickup Points"
          value={form.pickupPoints}
          onChange={(e) => setForm({ ...form, pickupPoints: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />

        <input
          type="text"
          placeholder="Bus Number"
          value={form.busNumber}
          onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />

        <input
          type="text"
          placeholder="Driver Name"
          value={form.driverName}
          onChange={(e) => setForm({ ...form, driverName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />

        <div className="flex justify-end gap-3 pt-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportManagementPage;
