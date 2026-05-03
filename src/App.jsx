// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ParentLayout from "./pages/parent/ParentLayout";
import StaffLayout from "./pages/staff/StaffLayout";

import Unauthorized from "./pages/Unauthorized";
import AttendancePage from "./pages/admin/Attendance/AttendancePage";
import AnnouncementPage from "./pages/admin/Announcement/announcement";
import HolidayCalendar from "./pages/admin/Holiday/HolidayCalendar";
import EnquiryList from "./pages/admin/Enquiries/EnquiryList";
import VisitorList from "./pages/admin/Visitors/VisitorList";
import IncomeList from "./pages/admin/Income/IncomeList";
import ExpenseList from "./pages/admin/Expenses/ExpenseList";
import ComplaintList from "./pages/admin/Complaints/ComplaintList";

import SuperadminDashboard from "./pages/Superadmin/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import SchoolOnboarding from "./pages/admin/Onboarding/SchoolOnboarding";
import BranchesList from "./pages/admin/Branches/BranchesList";
import FeeSetup from "./pages/admin/Fees/FeeSetup";
import UserList from "./pages/admin/Users/UserList";
import ClassList from "./pages/admin/Class/ClassList";

import StudentListPage from "./modules/students/pages/StudentListPage";
import StudentCreatePage from "./modules/students/pages/StudentCreatePage";
import StudentEditPage from "./modules/students/pages/StudentEditPage";
import StudentDetailPage from "./modules/students/pages/StudentDetailPage";

import TeacherList from "./pages/admin/staff/TeacherList";
import AccountantList from "./pages/admin/staff/AccountantsList";
import TeacherAttendanceAdmin from "./pages/admin/Staff/TeacherAttendanceAdmin";

import AdminMakePaymentPage from "./pages/admin/Payments/MakePaymentPage";
import VerifyPaymentPage from "./pages/admin/Payments/VerifyPaymentPage";
import MarksheetDashboard from "./pages/admin/Marksheet/MarksheetDashboard";
import DiaryDashboard from "./pages/admin/Diary/DiaryDashboard";

// ── Staff dashboards & pages ───────────────────────────────────
import TeacherDashboard       from "./pages/staff/TeacherDashboard";
import AccountantDashboard    from "./pages/staff/AccountantDashboard";
import TeacherAttendancePage  from "./pages/staff/TeacherAttendancePage";  // teacher's own attendance
import StudentAttendancePage  from "./pages/staff/StudentAttendancePage";   // teacher marks student attendance

// ── Parent pages ───────────────────────────────────────────────
import ParentDashboard         from "./pages/parent/ParentDashboard";
import ParentProfilePage       from "./pages/parent/ParentProfilePage";
import ParentAttendancePage    from "./pages/parent/ParentAttendancePage";
import ParentFeePage           from "./pages/parent/ParentFeePage";
import ParentMakePaymentPage   from "./pages/parent/MakePaymentPage";
import ParentAnnouncementsPage from "./pages/parent/ParentAnnouncementsPage";
import ParentDiaryPage         from "./pages/parent/ParentDiaryPage";
import ParentComplaintsPage    from "./pages/parent/ParentComplaintsPage";
import ParentMarksheetPage     from "./pages/parent/ParentMarksheetPage";
import ParentHolidaysPage      from "./pages/parent/ParentHolidaysPage";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* SUPERADMIN */}
      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedRoute allowRoles={["superadmin"]}>
            <SuperadminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ─────────────── ADMIN + BRANCH_ADMIN PANEL ─────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowRoles={["admin", "superadmin", "branch_admin"]}>  {/* ← branch_admin added */}
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index                   element={<AdminDashboard />} />
        <Route path="dashboard"        element={<AdminDashboard />} />
        <Route path="onboarding"       element={<SchoolOnboarding />} />
        <Route path="class"            element={<ClassList />} />
        <Route path="branches"         element={<BranchesList />} />  {/* hidden in sidebar for branch_admin, but route exists */}
        <Route path="fees"             element={<FeeSetup />} />
        <Route path="announcements"    element={<AnnouncementPage />} />
        <Route path="holidays"         element={<HolidayCalendar />} />
        <Route path="admissions"       element={<EnquiryList />} />
        <Route path="visitors"         element={<VisitorList />} />
        <Route path="income"           element={<IncomeList />} />
        <Route path="expenses"         element={<ExpenseList />} />
        <Route path="complaints"       element={<ComplaintList />} />
        <Route path="marksheets"       element={<MarksheetDashboard />} />
        <Route path="diary"            element={<DiaryDashboard />} />
        <Route path="payments/make"    element={<AdminMakePaymentPage />} />
        <Route path="payments/verify"  element={<VerifyPaymentPage />} />
        <Route path="staff/teachers"   element={<TeacherList />} />
        <Route path="staff/accountants" element={<AccountantList />} />
        <Route path="staff/teacher-attendance" element={<TeacherAttendanceAdmin />} />  {/* ← admin view of teacher attendance */}
        <Route path="attendance"       element={<AttendancePage />} />
        <Route path="users"            element={<UserList />} />
        <Route path="students"         element={<StudentListPage />} />
        <Route path="students/new"     element={<StudentCreatePage />} />
        <Route path="students/:studentId/edit" element={<StudentEditPage />} />
        <Route path="students/:studentId"      element={<StudentDetailPage />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ─────────────── PARENT PANEL ─────────────── */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowRoles={["parent"]}>
            <ParentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ParentDashboard />} />
        <Route path="dashboard"     element={<ParentDashboard />} />
        <Route path="profile"       element={<ParentProfilePage />} />
        <Route path="attendance"    element={<ParentAttendancePage />} />
        <Route path="fees"          element={<ParentFeePage />} />
        <Route path="payments/make" element={<ParentMakePaymentPage />} />
        <Route path="announcements" element={<ParentAnnouncementsPage />} />
        <Route path="diary"         element={<ParentDiaryPage />} />
        <Route path="complaints"    element={<ParentComplaintsPage />} />
        <Route path="marksheet"     element={<ParentMarksheetPage />} />
        <Route path="holidays"      element={<ParentHolidaysPage />} />
      </Route>

      {/* ─────────────── TEACHER PANEL ─────────────── */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowRoles={["teacher"]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"       element={<TeacherDashboard />} />
        <Route path="attendance"      element={<StudentAttendancePage />} />   {/* mark student attendance */}
        <Route path="myattendance"    element={<TeacherAttendancePage />} />   {/* teacher's own check-in/out */}
        <Route path="students"        element={<StudentListPage />} />
        <Route path="fees"            element={<FeeSetup />} />
        <Route path="announcements"   element={<AnnouncementPage />} />
        <Route path="holidays"        element={<HolidayCalendar />} />
        <Route path="admissions"      element={<EnquiryList />} />
        <Route path="visitors"        element={<VisitorList />} />
        <Route path="income"          element={<IncomeList />} />
        <Route path="expenses"        element={<ExpenseList />} />
        <Route path="complaints"      element={<ComplaintList />} />
        <Route path="marksheets"      element={<MarksheetDashboard />} />
        <Route path="diary"           element={<DiaryDashboard />} />
        <Route path="class"           element={<ClassList />} />
        <Route path="branches"        element={<BranchesList />} />
        <Route path="payments/verify" element={<VerifyPaymentPage />} />
        <Route path="payments/make"   element={<AdminMakePaymentPage />} />
      </Route>

      {/* ─────────────── ACCOUNTANT PANEL ─────────────── */}
      <Route
        path="/accountant"
        element={
          <ProtectedRoute allowRoles={["accountant"]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"       element={<AccountantDashboard />} />
        <Route path="attendance"      element={<TeacherAttendancePage />} />   {/* accountant's own attendance */}
        <Route path="students"        element={<StudentListPage />} />
        <Route path="fees"            element={<FeeSetup />} />
        <Route path="announcements"   element={<AnnouncementPage />} />
        <Route path="holidays"        element={<HolidayCalendar />} />
        <Route path="admissions"      element={<EnquiryList />} />
        <Route path="visitors"        element={<VisitorList />} />
        <Route path="income"          element={<IncomeList />} />
        <Route path="expenses"        element={<ExpenseList />} />
        <Route path="complaints"      element={<ComplaintList />} />
        <Route path="marksheets"      element={<MarksheetDashboard />} />
        <Route path="diary"           element={<DiaryDashboard />} />
        <Route path="class"           element={<ClassList />} />
        <Route path="branches"        element={<BranchesList />} />
        <Route path="payments/verify" element={<VerifyPaymentPage />} />
        <Route path="payments/make"   element={<AdminMakePaymentPage />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
