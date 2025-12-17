// src/modules/students/pages/StudentListPage.jsx
import React, { useEffect, useState } from "react";
import {
  fetchStudents,
  deactivateStudent,
  fetchStudentFeesInfo,
  fetchStudentAttendance,
} from "../api/studentApi";
import StudentFilters from "../components/StudentFilters";
import StudentTable from "../components/StudentTable";
import StudentUpgradeModal from "../components/StudentUpgradeModal";
import StudentAttendanceDrawer from "../components/StudentAttendanceDrawer";
import { useNavigate } from "react-router-dom";

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    admissionSession: "",
    classId: "",
    section: "",
    gender: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [attendanceStudent, setAttendanceStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const navigate = useNavigate();

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetchStudents(filters);
      setStudents(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to deactivate this student?")) {
      return;
    }
    try {
      await deactivateStudent(studentId);
      await loadStudents();
    } catch (err) {
      console.error("Failed to deactivate student:", err);
    }
  };

  const handleUpgradeClick = (student) => {
    setSelectedStudent(student);
    setShowUpgradeModal(true);
  };

  const handleAttendanceClick = async (student) => {
    try {
      setAttendanceLoading(true);
      setAttendanceStudent(student);
      const res = await fetchStudentAttendance(student._id);
      setAttendanceData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleFeesClick = async (student) => {
    try {
      const res = await fetchStudentFeesInfo(student._id);
      console.log("Fees info:", res.data);
      // you can open a modal later
    } catch (err) {
      console.error("Failed to fetch fees info:", err);
    }
  };

  return (
    <div className="student-list-page">
      <div className="page-header">
        <h2>Student Management</h2>
        <div className="header-actions">
          <span>Total Students: {total}</span>
          <button onClick={() => navigate("/students/new")}>
            Add New Admission
          </button>
        </div>
      </div>

      <StudentFilters filters={filters} setFilters={setFilters} />

      <StudentTable
        loading={loading}
        students={students}
        onView={(s) => navigate(`/students/${s._id}`)}
        onEdit={(s) => navigate(`/students/${s._id}/edit`)}
        onDelete={(s) => handleDelete(s._id)}
        onUpgrade={handleUpgradeClick}
        onFees={handleFeesClick}
        onAttendance={handleAttendanceClick}
      />

      {showUpgradeModal && selectedStudent && (
        <StudentUpgradeModal
          student={selectedStudent}
          onClose={() => setShowUpgradeModal(false)}
          onUpgraded={loadStudents}
        />
      )}

      <StudentAttendanceDrawer
        open={!!attendanceStudent}
        student={attendanceStudent}
        loading={attendanceLoading}
        attendance={attendanceData}
        onClose={() => {
          setAttendanceStudent(null);
          setAttendanceData([]);
        }}
      />
    </div>
  );
};

export default StudentListPage;
