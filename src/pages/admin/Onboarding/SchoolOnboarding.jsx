import { useEffect, useState } from "react";
import api from "../../../apis/axios";

import SchoolProfile from "./steps/SchoolProfile";
import AcademicSettings from "./steps/AcademicSettings";
import BankDetails from "./steps/BankDetails";
import SchoolSettings from "./steps/SchoolSettings";
import Branches from "./steps/Branches";

const STEPS = [
  "School Profile",
  "Academic Settings",
  "Bank Details",
  "School Settings",
  "Branches",
];

export default function SchoolOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasBranches, setHasBranches] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [completing, setCompleting] = useState(false);

  /* ================= FETCH SCHOOL ================= */
  useEffect(() => {
    async function fetchSchool() {
      try {
        const res = await api.get("/api/schools/me");
        setSchool(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchool();
  }, []);

  /* ================= COMPLETE ONBOARDING ================= */
  async function completeOnboarding() {
    if (!school?._id) return;

    setCompleting(true);
    try {
      await api.put(`/api/schools/${school._id}/onboarding/complete`);

      // refresh school state
      const res = await api.get("/api/schools/me");
      setSchool(res.data.data);

      setEditMode(false);
      setCurrentStep(0);
    } catch (err) {
      console.error(err);
      alert("Failed to complete onboarding");
    } finally {
      setCompleting(false);
    }
  }

  /* ================= NEXT BUTTON ================= */
  async function handleNext() {
    // No branches → finish after School Settings
    if (currentStep === 3 && !hasBranches) {
      await completeOnboarding();
      return;
    }

    // Last step → finish
    if (currentStep === STEPS.length - 1) {
      await completeOnboarding();
      return;
    }

    setCurrentStep((s) => s + 1);
  }

  /* ================= LOADING ================= */
  if (loading) return <div className="p-6">Loading school...</div>;

  /* ================= COMPLETED VIEW ================= */
  if (school?.onboarding?.completed && !editMode) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white border rounded-xl text-center">
        <h2 className="text-2xl font-semibold text-emerald-600">
          🎉 School Onboarding Completed
        </h2>

        <p className="text-slate-600 mt-2">
          Your school setup is complete.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              setEditMode(true);
              setCurrentStep(0); // ✅ IMPORTANT FIX
            }}
            className="px-6 py-2 border rounded"
          >
            Edit Details
          </button>

          <button
            onClick={() => (window.location.href = "/admin")}
            className="px-6 py-2 bg-emerald-600 text-white rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Steps */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`shrink-0 px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              i === currentStep
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border rounded-xl p-4 sm:p-6">
        {currentStep === 0 && <SchoolProfile school={school} />}
        {currentStep === 1 && <AcademicSettings school={school} />}
        {currentStep === 2 && <BankDetails school={school} />}
        {currentStep === 3 && (
          <SchoolSettings
            hasBranches={hasBranches}
            setHasBranches={setHasBranches}
          />
        )}
        {currentStep === 4 && hasBranches && (
          <Branches schoolId={school._id} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((s) => s - 1)}
          className="w-full sm:w-auto px-4 py-2 border rounded disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={completing}
          className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded disabled:opacity-60"
        >
          {completing
            ? "Finishing..."
            : currentStep === STEPS.length - 1 ||
              (!hasBranches && currentStep === 3)
            ? "Finish Setup"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
