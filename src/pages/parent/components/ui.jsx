// src/pages/parent/components/ui.jsx
import React from "react";

export function PageShell({ title, subtitle, children }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#0a1a44]">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return (
    <p className="text-sm font-semibold text-[#0a1a44] uppercase tracking-wide mb-4">
      {children}
    </p>
  );
}

export function StatCard({ label, value, sub, colorClass = "bg-[#0a1a44]" }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export function Badge({ status }) {
  const map = {
    Verified:    "bg-green-100 text-green-700",
    Pending:     "bg-yellow-100 text-yellow-700",
    Rejected:    "bg-red-100 text-red-700",
    Resolved:    "bg-green-100 text-green-700",
    "In Progress":"bg-blue-100 text-blue-700",
    National:    "bg-red-100 text-red-700",
    Festival:    "bg-yellow-100 text-yellow-700",
    School:      "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center h-52">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0a1a44] rounded-full animate-spin" />
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
      {message || "Something went wrong."}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <p className="text-center text-slate-400 py-10 text-sm">{message}</p>
  );
}

export function HeroCard({ student }) {
  if (!student) return null;
  return (
    <div className="bg-gradient-to-r from-[#0a1a44] to-[#1a3a8f] rounded-2xl p-6 text-white flex items-center gap-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
      {student.photoUrl ? (
        <img src={student.photoUrl} alt="Student" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 flex-shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
          {student.firstName?.[0]}{student.lastName?.[0]}
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold">{student.firstName} {student.lastName}</h2>
        <p className="text-white/70 text-sm mt-1">
          {student.classId?.name} • Section {student.section}
          {student.stream ? ` • ${student.stream}` : ""}
          {" • "}Roll No. {student.rollNo}
        </p>
        <p className="text-white/60 text-xs mt-0.5">
          Admission No: {student.admissionNo} • {student.admissionSession}
        </p>
      </div>
    </div>
  );
}
