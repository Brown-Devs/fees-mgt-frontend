import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStudentById } from "../api/studentApi";

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await fetchStudentById(studentId);
        setStudent(res.data);
      } catch (err) {
        console.error("Failed to load student:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading student details...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center text-red-500">
        Student not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Student Details
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/students/${studentId}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => navigate("/admin/students")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-xl p-6 flex gap-6">
        <div>
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt="Student"
              className="w-32 h-32 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800">
            {student.firstName} {student.lastName}
          </h3>

          <p className="text-gray-600">
            Admission No: {student.admissionNo}
          </p>

          <p className="text-gray-600">
            Gender: {student.gender}
          </p>

          <p className="text-gray-600">
            DOB: {new Date(student.dob).toLocaleDateString()}
          </p>

          <p className="text-gray-600">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded text-sm ${
                student.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {student.status}
            </span>
          </p>
        </div>
      </div>

      {/* Academic Info */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Academic Information
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <p><strong>Class:</strong> {student.classId?.name}</p>
          <p><strong>Section:</strong> {student.section || "-"}</p>
          <p><strong>Stream:</strong> {student.stream || "-"}</p>
          <p><strong>Roll No:</strong> {student.rollNo}</p>
          <p><strong>Admission Session:</strong> {student.admissionSession}</p>
          <p><strong>Admission Date:</strong> {new Date(student.admissionDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Parent Details */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Parent / Guardian Details
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <p><strong>Father:</strong> {student.fatherName || "-"}</p>
          <p><strong>Father Mobile:</strong> {student.fatherMobile || "-"}</p>
          <p><strong>Mother:</strong> {student.motherName || "-"}</p>
          <p><strong>Mother Mobile:</strong> {student.motherMobile || "-"}</p>

          {(!student.fatherName && !student.motherName) && (
            <>
              <p><strong>Guardian:</strong> {student.guardianName}</p>
              <p><strong>Guardian Mobile:</strong> {student.guardianMobile}</p>
              <p><strong>Relation:</strong> {student.guardianRelation}</p>
            </>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Contact Information
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <p><strong>Mobile:</strong> {student.mobile || "-"}</p>
          <p><strong>Email:</strong> {student.email || "-"}</p>
          <p><strong>Emergency Contact:</strong> {student.emergencyContact || "-"}</p>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Address
        </h4>
        <p className="text-gray-700">{student.address || "No address provided"}</p>
      </div>

      {/* Transport */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Transport Information
        </h4>

        <p><strong>Uses Transport:</strong> {student.usesTransport ? "Yes" : "No"}</p>

        {student.usesTransport && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <p><strong>Route:</strong> {student.transportRoute}</p>
            <p><strong>Transport Fee:</strong> ₹{student.transportFee}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailPage;
