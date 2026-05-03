// src/pages/admin/Onboarding/SchoolOnboarding.jsx
import { useEffect, useState } from "react";
import api from "../../../apis/axios";

import SchoolProfile    from "./steps/SchoolProfile";
import AcademicSettings from "./steps/AcademicSettings";
import BankDetails      from "./steps/BankDetails";
import LocationSetup    from "./steps/LocationSetup";
import SchoolSettings   from "./steps/SchoolSettings";
import Branches         from "./steps/Branches";

const STEPS = [
  "School Profile",
  "Academic Settings",
  "Bank Details",
  "School Location",   // ← NEW
  "School Settings",
  "Branches",
];

export default function SchoolOnboarding() {
  const [currentStep,   setCurrentStep]   = useState(0);
  const [school,        setSchool]        = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [hasBranches,   setHasBranches]   = useState(false);
  const [completing,    setCompleting]    = useState(false);
  const [successMessage,setSuccessMessage]= useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/schools/me");
        setSchool(res.data.data);
        localStorage.setItem("schoolId", res.data.data._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function completeOnboarding() {
    if (!school?._id) return;
    setCompleting(true);
    try {
      await api.put(`/api/schools/${school._id}/onboarding/complete`);
      const res = await api.get("/api/schools/me");
      setSchool(res.data.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSuccessMessage("School settings saved successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      alert("Failed to save changes");
    } finally {
      setCompleting(false);
    }
  }

  async function handleNext() {
    // Step 4 = "School Settings" (index 4)
    if (currentStep === 4 && !hasBranches) {
      await completeOnboarding();
      return;
    }
    if (currentStep === STEPS.length - 1) {
      await completeOnboarding();
      return;
    }
    setCurrentStep(s => s + 1);
  }

  if (loading) return <div className="p-6">Loading school...</div>;

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">School Setup</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your institution details and academic settings</p>
      </div>

      {successMessage && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-2xl px-6 py-3 rounded-md border border-[#0f172a]/20 bg-[#0f172a]/5 text-[#0f172a] text-sm text-center font-medium">
            {successMessage}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Step nav */}
        <div className="w-64 bg-white border rounded-xl p-4 h-fit">
          <div className="space-y-1">
            {STEPS.map((step, index) => {
              const isActive    = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <button
                  key={step}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition flex items-center justify-between
                    ${isActive ? "bg-[#0f172a] text-white" : isCompleted ? "bg-slate-100 text-slate-800" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <span>{step}</span>
                  <span className="text-xs font-medium">{isCompleted ? "✓" : index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white border rounded-xl p-6">
            <div className="mb-6">
              <p className="text-xs text-slate-500">Step {currentStep + 1} of {STEPS.length}</p>
            </div>

            {currentStep === 0 && <SchoolProfile    school={school} />}
            {currentStep === 1 && <AcademicSettings school={school} />}
            {currentStep === 2 && <BankDetails      school={school} />}
            {currentStep === 3 && <LocationSetup    school={school} />}
            {currentStep === 4 && (
              <SchoolSettings hasBranches={hasBranches} setHasBranches={setHasBranches} />
            )}
            {currentStep === 5 && hasBranches && <Branches schoolId={school._id} />}

            <div className="flex justify-between mt-8">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(s => s - 1)}
                className="px-5 py-2 rounded-md border text-sm disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={completing}
                className="px-6 py-2 rounded-md text-sm font-medium bg-[#0f172a] text-white hover:bg-slate-800 transition disabled:opacity-60"
              >
                {completing
                  ? "Saving..."
                  : currentStep === STEPS.length - 1 || (!hasBranches && currentStep === 4)
                  ? "Finish Setup"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
