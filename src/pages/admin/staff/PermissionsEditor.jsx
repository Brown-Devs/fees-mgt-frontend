import React, { useState } from "react";
import api from "../../../apis/axios";
import { PERMISSIONS, PERMISSION_LABELS } from "../../../constants/permissions";
import PermissionGroup from "../../../components/PermissionGroup";

export default function PermissionsEditor({ staff, onClose, onSuccess }) {
  const [permissions, setPermissions] = useState(staff.permissions || []);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch(`/api/users/${staff._id}/permissions`, { permissions });
      alert("Permissions updated!");
      onSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b shrink-0">
          <div>
            <h3 className="text-lg font-bold text-[#0a1a44]">Edit Permissions</h3>
            <p className="text-sm text-gray-500">{staff.fullName} · {staff.role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(PERMISSIONS).map(([key, options]) => (
              <PermissionGroup
                key={key}
                title={PERMISSION_LABELS[key] || key}
                options={options}
                values={permissions}
                onChange={setPermissions}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex gap-3 justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-[#0a1a44] text-white rounded text-sm hover:bg-[#132b6b] transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Permissions"}
          </button>
        </div>
      </div>
    </div>
  );
}