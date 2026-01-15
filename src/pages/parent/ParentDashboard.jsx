import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import FeeDetails from "../parent/FeeDetails";

const ParentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [feeData, setFeeData] = useState({});
  const [totalFee, setTotalFee] = useState(0);
  const [payments, setPayments] = useState([]);

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
      }
    };
    loadData();
  }, []);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Student Profile */}
      <div className="bg-[#0a1a44] text-white rounded-xl p-6 flex items-center gap-6">
        {student.photoUrl ? (
          <img
            src={student.photoUrl}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
            No Photo
          </div>
        )}
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

      {/* Fee + Payment Details */}
      <FeeDetails
        student={student}
        feeData={feeData}
        totalFee={totalFee}
        payments={payments}
      />
    </div>
  );
};

export default ParentDashboard;
