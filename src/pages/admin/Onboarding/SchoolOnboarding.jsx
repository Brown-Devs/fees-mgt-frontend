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

  useEffect(() => {
    async function fetchSchool() {
      try {
        const res = await api.get("/api/schools/me");
        setSchool(res.data.data);
        localStorage.setItem("schoolId", res.data.data._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchool();
  }, []);

  async function completeOnboarding() {
    if (!school?._id) return;

    setCompleting(true);
    try {
      await api.put(`/api/schools/${school._id}/onboarding/complete`);
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

  async function handleNext() {
    if (currentStep === 3 && !hasBranches) {
      await completeOnboarding();
      return;
    }

    if (currentStep === STEPS.length - 1) {
      await completeOnboarding();
      return;
    }

    setCurrentStep((s) => s + 1);
  }

  if (loading) return <div className="p-6">Loading school...</div>;

  if (school?.onboarding?.completed && !editMode) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-2xl shadow-md text-center">
        <h2 className="text-2xl font-semibold">School Onboarding Completed</h2>
        <p className="text-slate-600 mt-2">Your school setup is complete.</p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              setEditMode(true);
              setCurrentStep(0);
            }}
            className="px-6 py-2 border rounded-lg"
          >
            Edit Details
          </button>

          <button
            onClick={() => (window.location.href = "/admin")}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* ================= STEPPER ================= */}
      <div className="relative mb-12">

        {/* Base line */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-slate-300" />

        {/* Progress line */}
        <div
          className="absolute top-5 left-0 h-[2px] bg-black transition-all duration-300"
          style={{
            width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div key={step} className="flex flex-col items-center w-full">

                <div
                  className={`
                    z-10 w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-all
                    ${isCompleted
                      ? "bg-black text-white"
                      : isActive
                        ? "bg-white border-2 border-black text-black scale-110 shadow-md"
                        : "bg-white border border-slate-400 text-slate-400"
                    }
                  `}
                >
                  {index + 1}
                </div>

                <p
                  className={`
                    mt-3 text-xs sm:text-sm text-center whitespace-nowrap
                    ${isActive
                      ? "font-semibold text-black"
                      : isCompleted
                        ? "text-black"
                        : "text-slate-500"
                    }
                  `}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
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

      {/* ================= NAVIGATION ================= */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between mt-8">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((s) => s - 1)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border
                     disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={completing}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg
                     bg-black text-white font-medium
                     hover:bg-slate-800 transition
                     disabled:opacity-60"
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
