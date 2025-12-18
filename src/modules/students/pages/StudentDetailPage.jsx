import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStudent } from "../api/studentApi";
import FeeDetails from "../components/FeeDetails";
import api from "../../../apis/axios";

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [feeData, setFeeData] = useState({});
  const [payments, setPayments] = useState([]);
  const [paymentModal, setPaymentModal] = useState(false);

  // ✅ Load student
  useEffect(() => {
    if (!studentId || studentId === "new" || studentId === "create") {
      setLoading(false);
      return;
    }

    const loadStudent = async () => {
      try {
        const res = await fetchStudent(studentId);
        setStudent(res.data.data);
      } catch (err) {
        console.error("Failed to load student:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentId]);

  // ✅ Load fee structure AFTER student loads
  useEffect(() => {
    if (!student?._id) return;

    const loadFeeStructure = async () => {
      try {
        const res = await api.get("/api/fees/structure", {
          params: {
            classId: student.classId?._id,
            session: student.admissionSession,
          },
        });

        const structure = res.data.data;

        const feeObj = {};
        structure?.items?.forEach((item) => {
          feeObj[item.feeHeadId.name] = item.amount;
        });

        setFeeData(feeObj);
      } catch (err) {
        console.error("Failed to load fee structure", err);
      }
    };

    loadFeeStructure();
  }, [student]);

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
    <div className="p-6 max-w-6xl mx-auto print-area">

      {/* NAVY PROFILE HEADER */}
      <div className="bg-[#0a1a44] text-white rounded-xl p-6 mb-6 shadow-md flex justify-between items-center no-print">
        <div className="flex items-center gap-6">

          {/* Back Button */}
          <button
            onClick={() => navigate("/admin/students")}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
          >
            ← Back
          </button>

          {/* Student Photo + Info */}
          <div className="flex items-center gap-6">
            <div>
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white">
                  No Photo
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-semibold">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Admission No: {student.admissionNo}
              </p>
              <p className="text-white/80 text-sm">
                Class: {student.classId?.name} {student.section}
              </p>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white text-[#0a1a44] rounded-lg shadow hover:bg-gray-100"
        >
          Print Profile
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b mb-6 no-print">
        {["profile", "attendance", "fees"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-4 border-[#0a1a44] text-[#0a1a44] font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="space-y-6">

          {/* Academic Info */}
          <div className="bg-white shadow rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
              Academic Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <p><strong>Class:</strong> {student.classId?.name}</p>
              <p><strong>Section:</strong> {student.section || "-"}</p>
              <p><strong>Stream:</strong> {student.stream || "-"}</p>
              <p><strong>Roll No:</strong> {student.rollNo}</p>
              <p><strong>Session:</strong> {student.admissionSession}</p>
              <p><strong>Admission Date:</strong> {new Date(student.admissionDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Parent Details */}
          <div className="bg-white shadow rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
              Parent / Guardian Details
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <p><strong>Father:</strong> {student.fatherName || "-"}</p>
              <p><strong>Father Mobile:</strong> {student.fatherMobile || "-"}</p>
              <p><strong>Mother:</strong> {student.motherName || "-"}</p>
              <p><strong>Mother Mobile:</strong> {student.motherMobile || "-"}</p>

              {!student.fatherName && !student.motherName && (
                <>
                  <p><strong>Guardian:</strong> {student.guardianName}</p>
                  <p><strong>Guardian Mobile:</strong> {student.guardianMobile}</p>
                  <p><strong>Relation:</strong> {student.guardianRelation}</p>
                </>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white shadow rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
              Contact Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <p><strong>Mobile:</strong> {student.mobile || "-"}</p>
              <p><strong>Email:</strong> {student.email || "-"}</p>
              <p><strong>Emergency Contact:</strong> {student.emergencyContact || "-"}</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white shadow rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
              Address
            </h4>
            <p className="text-gray-700">{student.address || "No address provided"}</p>
          </div>

          {/* Transport */}
          <div className="bg-white shadow rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
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

          {/* Documents */}
          <div className="bg-white shadow rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
              Documents
            </h4>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-medium">Photo</p>
                {student.photoUrl ? (
                  <img
                    src={student.photoUrl}
                    className="w-24 h-24 rounded-lg object-cover border mt-2"
                  />
                ) : (
                  <p className="text-gray-500">No photo uploaded</p>
                )}
              </div>

              <div>
                <p className="font-medium">ID Proof</p>
                {student.idProofUrl ? (
                  <img
                    src={student.idProofUrl}
                    className="w-24 h-24 rounded-lg object-cover border mt-2"
                  />
                ) : (
                  <p className="text-gray-500">No ID proof uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE TAB */}
      {activeTab === "attendance" && (
        <div className="bg-white shadow rounded-xl p-6">
          <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
            Attendance
          </h4>
          <p className="text-gray-500">Attendance module coming soon.</p>
        </div>
      )}

      {/* FEES TAB */}
      {/* FEES TAB */}
{activeTab === "fees" && (
  <FeeDetails
    student={student}
    feeData={feeData}
    payments={payments}
    onRecordPayment={() => setPaymentModal(true)}
  />
)}

    </div>
  );
};

export default StudentDetailPage;
