import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import FeeDetails from "../parent/FeeDetails";

const NAVY = "#0a1a44";

const ParentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [feeData, setFeeData] = useState({});
  const [totalFee, setTotalFee] = useState(0);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch student linked to parent
        const studentRes = await api.get("/api/students/by-parent");
        const s = studentRes.data.data;
        setStudent(s);

        // Fetch fee details
        const feeRes = await api.get(`/api/fees/student/${s._id}`);
        setFeeData(feeRes.data.data.feeData);
        setTotalFee(feeRes.data.data.totalFee);

        // Fetch payments
        const payRes = await api.get(`/api/payments/student/${s._id}`);
        setPayments(payRes.data.data || []);
      } catch (err) {
        console.error("Failed to load parent dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60 text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="space-y-8">

      {/* ================= STUDENT PROFILE ================= */}
      <div
        className="rounded-2xl p-6 text-white shadow-md
                   bg-gradient-to-r from-[#0a1a44] to-[#122b6b]"
      >
        <div className="flex items-center gap-6">

          {/* Avatar */}
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt="Student"
              className="w-24 h-24 rounded-full object-cover
                         border-4 border-white shadow"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center
                         bg-white/20 border-4 border-white/30 text-sm"
            >
              No Photo
            </div>
          )}

          {/* Info */}
          <div>
            <h2 className="text-2xl font-semibold">
              {student.firstName} {student.lastName}
            </h2>

            <p className="text-white/80 text-sm mt-1">
              Admission No: {student.admissionNo}
            </p>

            <p className="text-white/80 text-sm">
              Class: {student.classId?.name} {student.section} {student.stream}
            </p>
          </div>
        </div>
      </div>

      {/* ================= FEES & PAYMENTS ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-[#0a1a44] mb-4">
          Fee & Payment Details
        </h3>

        <FeeDetails
          student={student}
          feeData={feeData}
          totalFee={totalFee}
          payments={payments}
        />
      </div>

    </div>
  );
};

export default ParentDashboard;
