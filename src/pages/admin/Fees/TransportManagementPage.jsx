import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const TransportManagementPage = () => {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    fee: "",
    pickupPoints: "",
    busNumber: "",
    driverName: "",
  });

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadRoutes = async () => {
    const schoolId = localStorage.getItem("schoolId");
    const res = await api.get("/api/transport/routes", { params: { schoolId } });
    setRoutes(res.data.data);
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolId = localStorage.getItem("schoolId");

    await api.post("/api/transport/routes", { ...form, schoolId });
    setForm({ name: "", fee: "", pickupPoints: "", busNumber: "", driverName: "" });
    loadRoutes();
  };

  const handleUpdate = async () => {
    await api.put(`/api/transport/routes/${editing._id}`, editForm);
    setEditing(null);
    loadRoutes();
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-[#001f3f]">
          Transport Fee Setup
        </h1>
        <p className="text-gray-500 mt-1">
          Manage transport routes, fees and vehicle details.
        </p>
      </div>

      {/* Add Route Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-5"
      >
        <div className="flex items-center gap-2 pb-4 border-b">
          <div className="w-1 h-6 bg-[#001f3f] rounded-full" />
          <h2 className="text-lg font-semibold text-[#001f3f]">
            Add New Route
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Route Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
          />

          <input
            type="number"
            placeholder="Fee *"
            value={form.fee}
            onChange={(e) => setForm({ ...form, fee: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
          />
        </div>

        <textarea
          placeholder="Pickup Points (optional)"
          value={form.pickupPoints}
          onChange={(e) => setForm({ ...form, pickupPoints: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Bus Number (optional)"
            value={form.busNumber}
            onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
          />

          <input
            type="text"
            placeholder="Driver Name (optional)"
            value={form.driverName}
            onChange={(e) => setForm({ ...form, driverName: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
          />
        </div>

        <div className="flex justify-end">
          <button
            className="px-6 py-2.5 bg-[#001f3f] hover:bg-[#001933]
                       text-white font-semibold rounded-xl
                       shadow-md hover:shadow-lg transition-all"
          >
            Add Route
          </button>
        </div>
      </form>

      {/* Routes Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center gap-2 pb-4 border-b mb-6">
          <div className="w-1 h-6 bg-[#001f3f] rounded-full" />
          <h2 className="text-lg font-semibold text-[#001f3f]">
            Existing Routes
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Route</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Fee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Pickup</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Bus</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Driver</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {routes.map((r) => (
                <tr key={r._id} className="hover:bg-[#001f3f]/[0.02]">
                  <td className="px-6 py-4 font-medium text-gray-800">{r.name}</td>
                  <td className="px-6 py-4 text-gray-600">₹{r.fee}</td>
                  <td className="px-6 py-4 text-gray-600">{r.pickupPoints}</td>
                  <td className="px-6 py-4 text-gray-600">{r.busNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{r.driverName}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="px-3 py-1.5 bg-[#001f3f] text-white rounded-lg hover:bg-[#001933]"
                      onClick={() => {
                        setEditing(r);
                        setEditForm(r);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      onClick={async () => {
                        await api.delete(`/api/transport/routes/${r._id}`);
                        loadRoutes();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#001f3f]">
              Edit Route
            </h3>

            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <input
              type="number"
              value={editForm.fee}
              onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <textarea
              value={editForm.pickupPoints}
              onChange={(e) => setEditForm({ ...editForm, pickupPoints: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              value={editForm.busNumber}
              onChange={(e) => setEditForm({ ...editForm, busNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              value={editForm.driverName}
              onChange={(e) => setEditForm({ ...editForm, driverName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <div className="flex justify-end gap-3 pt-3">
              <button
                className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
                onClick={handleUpdate}
              >
                Save
              </button>

              <button
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
);

};

export default TransportManagementPage;
