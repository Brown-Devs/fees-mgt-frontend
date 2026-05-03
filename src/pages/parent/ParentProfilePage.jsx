// src/pages/parent/ParentProfilePage.jsx
import React from "react";
import { useStudentByParent } from "./hooks/useStudentByParent";
import { PageShell, Card, CardTitle, HeroCard, Spinner, ErrorBox } from "./components/ui";

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-[#0a1a44] font-medium">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">{children}</div>
    </Card>
  );
}

export default function ParentProfilePage() {
  const { student, loading, error } = useStudentByParent();

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} />;
  if (!student) return <ErrorBox message="Student not found." />;

  const s = student;

  return (
    <PageShell title="Student Profile" subtitle="Complete academic and personal details">
      <HeroCard student={s} />

      <Section title="🎓 Academic Information">
        <InfoRow label="Class"           value={s.classId?.name} />
        <InfoRow label="Section"         value={s.section} />
        <InfoRow label="Stream"          value={s.stream} />
        <InfoRow label="Roll Number"     value={s.rollNo} />
        <InfoRow label="Admission No"    value={s.admissionNo} />
        <InfoRow label="Session"         value={s.admissionSession} />
        <InfoRow label="Admission Date"  value={s.admissionDate ? new Date(s.admissionDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"} />
        <InfoRow label="Date of Birth"   value={s.dob ? new Date(s.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"} />
        <InfoRow label="Gender"          value={s.gender} />
      </Section>

      <Section title="👨‍👩‍👦 Parent / Guardian">
        <InfoRow label="Father's Name"   value={s.fatherName} />
        <InfoRow label="Father's Mobile" value={s.fatherMobile} />
        <InfoRow label="Mother's Name"   value={s.motherName} />
        <InfoRow label="Mother's Mobile" value={s.motherMobile} />
        {!s.fatherName && !s.motherName && (
          <>
            <InfoRow label="Guardian"          value={s.guardianName} />
            <InfoRow label="Guardian Mobile"   value={s.guardianMobile} />
            <InfoRow label="Relation"          value={s.guardianRelation} />
          </>
        )}
      </Section>

      <Section title="📞 Contact & Address">
        <InfoRow label="Student Mobile"     value={s.mobile} />
        <InfoRow label="Email"              value={s.email} />
        <InfoRow label="Emergency Contact"  value={s.emergencyContact} />
        <div className="col-span-2 sm:col-span-3">
          <InfoRow label="Address" value={s.address} />
        </div>
      </Section>

      {s.usesTransport && (
        <Section title="🚌 Transport">
          <InfoRow label="Route"          value={s.transportRoute} />
          <InfoRow label="Transport Fee"  value={s.transportFee ? `₹${Number(s.transportFee).toLocaleString()}` : "—"} />
        </Section>
      )}

      {(s.photoUrl || s.idProofUrl) && (
        <Card>
          <CardTitle>📄 Documents</CardTitle>
          <div className="flex gap-6 flex-wrap">
            {s.photoUrl && (
              <div>
                <p className="text-xs text-slate-500 mb-2 font-semibold">Photo</p>
                <img src={s.photoUrl} alt="Student" className="w-24 h-24 rounded-xl object-cover border" />
              </div>
            )}
            {s.idProofUrl && (
              <div>
                <p className="text-xs text-slate-500 mb-2 font-semibold">ID Proof</p>
                <img src={s.idProofUrl} alt="ID Proof" className="w-24 h-24 rounded-xl object-cover border" />
              </div>
            )}
          </div>
        </Card>
      )}
    </PageShell>
  );
}
