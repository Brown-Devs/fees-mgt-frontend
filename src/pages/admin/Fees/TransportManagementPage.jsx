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
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-[#0a1a44] mb-6">
        Transport Fee Setup
      </h3>

      {/* Add Route Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-xl mb-10 space-y-4"
      >
        <h4 className="text-lg font-semibold text-gray-700">Add New Route</h4>

        <input
          type="text"
          placeholder="Route Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Fee *"
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Pickup Points (optional)"
          value={form.pickupPoints}
          onChange={(e) => setForm({ ...form, pickupPoints: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Bus Number (optional)"
          value={form.busNumber}
          onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Driver Name (optional)"
          value={form.driverName}
          onChange={(e) => setForm({ ...form, driverName: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        />

        <button className="bg-[#0a1a44] text-white px-4 py-2 rounded-md hover:bg-[#081233] transition">
          Add Route
        </button>
      </form>

      {/* Routes Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Existing Routes</h4>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0a1a44] text-white">
              <th className="p-3 text-left">Route</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Pickup Points</th>
              <th className="p-3 text-left">Bus</th>
              <th className="p-3 text-left">Driver</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {routes.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{r.name}</td>
                <td className="p-3">₹{r.fee}</td>
                <td className="p-3">{r.pickupPoints}</td>
                <td className="p-3">{r.busNumber}</td>
                <td className="p-3">{r.driverName}</td>

                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      setEditing(r);
                      setEditForm(r);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-xl font-semibold">Edit Route</h3>

            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            <input
              type="number"
              value={editForm.fee}
              onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            <textarea
              value={editForm.pickupPoints}
              onChange={(e) => setEditForm({ ...editForm, pickupPoints: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            <input
              type="text"
              value={editForm.busNumber}
              onChange={(e) => setEditForm({ ...editForm, busNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            <input
              type="text"
              value={editForm.driverName}
              onChange={(e) => setEditForm({ ...editForm, driverName: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            <div className="flex justify-end space-x-3">
              <button
                className="bg-[#0a1a44] text-white px-4 py-2 rounded hover:bg-[#081233]"
                onClick={handleUpdate}
              >
                Save
              </button>

              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportManagementPage;
