import React from "react";

const StudentAttendanceDrawer = ({
  open,
  student,
  attendance,
  loading,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="w-full max-w-md bg-white shadow-xl h-full overflow-y-auto animate-slideLeft p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Attendance Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Student Info */}
        {student && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-lg font-medium text-gray-800">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-sm text-gray-600">
              Class: {student.classId?.name || "-"}
            </p>
            <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading attendance...
          </div>
        )}

        {/* Attendance List */}
        {!loading && attendance?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No attendance records found.
          </div>
        )}

        {!loading && attendance?.length > 0 && (
          <div className="space-y-3">
            {attendance.map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              >
                <span className="text-gray-700">
                  {new Date(entry.date).toLocaleDateString()}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      entry.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : entry.status === "Absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceDrawer;
