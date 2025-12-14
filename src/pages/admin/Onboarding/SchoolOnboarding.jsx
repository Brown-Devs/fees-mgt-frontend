import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const steps = [
  "School Profile",
  "Academic Settings",
  "Bank Details",
  "School Settings",
  "Branches",
];

export default function SchoolOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasBranches, setHasBranches] = useState(false);

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH SCHOOL ---------------- */

  useEffect(() => {
    async function fetchSchool() {
      try {
        const res = await api.get("/api/schools/me");
        setSchool(res.data.data);
      } catch (err) {
        console.error("Failed to fetch school", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchool();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading school details...
      </div>
    );
  }

  if (!school) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load school details
      </div>
    );
  }

  /* ---------------- STEP NAVIGATION ---------------- */

  function next() {
    if (currentStep < steps.length - 1) {
      if (steps[currentStep + 1] === "Branches" && !hasBranches) {
        setCurrentStep(currentStep + 2);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  }

  function back() {
    if (currentStep > 0) {
      if (steps[currentStep - 1] === "Branches" && !hasBranches) {
        setCurrentStep(currentStep - 2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          School Onboarding
        </h1>
        <p className="text-sm text-slate-500">
          Complete your school setup to start using the system
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {steps.map((label, index) => {
          if (label === "Branches" && !hasBranches) return null;

          const active = index === currentStep;
          const completed = index < currentStep;

          return (
            <div key={label} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                  ${
                    completed
                      ? "bg-emerald-600 text-white"
                      : active
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-600"
                      : "bg-slate-200 text-slate-500"
                  }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm ${
                  active
                    ? "text-emerald-700 font-medium"
                    : "text-slate-500"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-slate-300 mx-3" />
              )}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white border rounded-xl shadow-sm p-6 min-h-[360px]">
        {currentStep === 0 && <SchoolProfile school={school} />}
        {currentStep === 1 && <AcademicSettings school={school} />}
        {currentStep === 2 && <BankDetails school={school} />}
        {currentStep === 3 && (
          <SchoolSettings
            hasBranches={hasBranches}
            setHasBranches={setHasBranches}
          />
        )}
        {currentStep === 4 && hasBranches && <Branches />}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-6">
        <button
          onClick={back}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded border text-sm disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={next}
          className="px-6 py-2 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700"
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- STEP COMPONENTS ---------------- */

function SchoolProfile({ school }) {
  return (
    <Section title="School Profile">
      <ReadOnly label="School Name" value={school.name} />
      <ReadOnly label="School Code" value={school.code} />
      <ReadOnly label="Address" value={school.address} />

      <div className="grid grid-cols-2 gap-4">
        <ReadOnly label="City" value={school.city} />
        <ReadOnly label="State" value={school.state} />
      </div>

      <ReadOnly label="Contact Email" value={school.contactEmail} />
      <ReadOnly label="Contact Phone" value={school.contactPhone} />
    </Section>
  );
}

function AcademicSettings({ school }) {
  return (
    <Section title="Academic Settings">
      <ReadOnly label="Academic Session" value={school.session} />
      <ReadOnly label="Timezone" value={school.timezone} />
      <ReadOnly label="Currency" value={school.currency} />
    </Section>
  );
}

function BankDetails({ school }) {
  const bank = school.bankDetails || {};
  return (
    <Section title="Bank Details">
      <ReadOnly label="Bank Name" value={bank.bankName} />
      <ReadOnly label="Account Name" value={bank.accountName} />
      <ReadOnly label="Account Number" value={bank.accountNumber} />
      <ReadOnly label="IFSC Code" value={bank.ifsc} />
    </Section>
  );
}

function SchoolSettings({ hasBranches, setHasBranches }) {
  return (
    <Section title="School Settings">
      <Toggle
        label="Does your school have multiple branches?"
        checked={hasBranches}
        onChange={setHasBranches}
      />
      <Toggle label="Admission Open" />
    </Section>
  );
}

function Branches() {
  return (
    <Section title="Branches">
      <div className="text-sm text-slate-500">
        Branch creation UI will be added in the next step.
      </div>
    </Section>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        value={value || "-"}
        disabled
        className="w-full border rounded px-3 py-2 text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between border rounded px-4 py-3 cursor-pointer">
      <span className="text-sm text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
        className="h-4 w-4"
      />
    </label>
  );
}
