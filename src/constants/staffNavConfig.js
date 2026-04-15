import {
  HiOutlineSquares2X2,
  HiOutlineCreditCard,
  HiOutlineClipboardDocumentList,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineBanknotes,
  HiOutlineReceiptPercent,
  HiOutlineSpeakerWave,
  HiOutlineCalendarDays,
  HiOutlineClipboard,
  HiOutlineIdentification,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

// Each item: { label, to, icon, permission }
// permission: the "view" permission required to see this nav item
export const STAFF_NAV = [
  {
    label: "Dashboard",
    to: "dashboard",
    icon: HiOutlineSquares2X2,
    permission: "dashboard.view",
  },
  {
    label: "Attendance",
    to: "attendance",
    icon: HiOutlineClipboardDocumentList,
    permission: "attendance.view",
  },
  {
    label: "Students",
    to: "students",
    icon: HiOutlineAcademicCap,
    permission: "student.view",
  },
  {
    label: "Fees",
    to: "fees",
    icon: HiOutlineReceiptPercent,
    permission: "fees.view",
  },
  {
    label: "Payments",
    to: "payments/verify",
    icon: HiOutlineCreditCard,
    permission: "payment.view",
  },
  {
    label: "Income",
    to: "income",
    icon: HiOutlineBanknotes,
    permission: "income.view",
  },
  {
    label: "Expenses",
    to: "expenses",
    icon: HiOutlineBanknotes,
    permission: "expenses.view",
  },
  {
    label: "Announcements",
    to: "announcements",
    icon: HiOutlineSpeakerWave,
    permission: "announcements.view",
  },
  {
    label: "Admission Enquiry",
    to: "admissions",
    icon: HiOutlineIdentification,
    permission: "admission_enquiry.view",
  },
  {
    label: "Visitors",
    to: "visitors",
    icon: HiOutlineUsers,
    permission: "visitors.view",
  },
  {
    label: "Complaints",
    to: "complaints",
    icon: HiOutlineClipboard,
    permission: "complaints.view",
  },
  {
    label: "Marksheets",
    to: "marksheets",
    icon: HiOutlineClipboardDocumentList,
    permission: "marksheets.view",
  },
  {
    label: "School Diary",
    to: "diary",
    icon: HiOutlineClipboard,
    permission: "school_diary.view",
  },
  {
    label: "Holiday Calendar",
    to: "holidays",
    icon: HiOutlineCalendarDays,
    permission: "holiday_calendar.view",
  },
  {
    label: "Class",
    to: "class",
    icon: HiOutlineUserGroup,
    permission: "class.view",
  },
  {
    label: "Branches",
    to: "branches",
    icon: HiOutlineUserGroup,
    permission: "branches.view",
  },
  {
    label: "Settings",
    to: "settings",
    icon: HiOutlineCog6Tooth,
    permission: "settings.view",
  },
];