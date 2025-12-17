import React from "react";

const StudentTable = ({
  loading,
  students,
  onView,
  onEdit,
  onDelete,
  onUpgrade,
  onFees,
  onAttendance,
}) => {
  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading students...
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="py-10 text-center text-gray-500">
        No students found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded-xl mt-4">
      <table className="min-w-full border-collapse">
        {/* Table Header */}
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Photo</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Admission No</th>
            <th className="px-4 py-3 text-left">Class</th>
            <th className="px-4 py-3 text-left">Section</th>
            <th className="px-4 py-3 text-left">Stream</th>
            <th className="px-4 py-3 text-left">Roll No</th>
            <th className="px-4 py-3 text-left">Mobile</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-sm text-gray-700">
          {students.map((s) => (
            <tr
              key={s._id}
              className="border-b hover:bg-gray-50 transition"
            >
              {/* Photo */}
              <td className="px-4 py-3">
                {s.photoUrl ? (
                  <img
                    src={s.photoUrl}
                    alt={s.firstName}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    N/A
                  </div>
                )}
              </td>

              {/* Name */}
              <td className="px-4 py-3 font-medium">
                {s.firstName} {s.lastName || ""}
              </td>

              {/* Admission No */}
              <td className="px-4 py-3">{s.admissionNo}</td>

              {/* Class */}
              <td className="px-4 py-3">{s.classId?.name || "-"}</td>

              {/* Section */}
              <td className="px-4 py-3">{s.section || "-"}</td>

              {/* Stream */}
              <td className="px-4 py-3">{s.stream || "-"}</td>

              {/* Roll No */}
              <td className="px-4 py-3">{s.rollNo}</td>

              {/* Mobile */}
              <td className="px-4 py-3">{s.mobile || "-"}</td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    s.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onView(s)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    View
                  </button>

                  <button
                    onClick={() => onEdit(s)}
                    className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onUpgrade(s)}
                    className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    Upgrade
                  </button>

                  <button
                    onClick={() => onFees(s)}
                    className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  >
                    Fees
                  </button>

                  <button
                    onClick={() => onAttendance(s)}
                    className="px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded hover:bg-teal-200"
                  >
                    Attendance
                  </button>

                  <button
                    onClick={() => onDelete(s)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
