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

  useEffect(() => {
    async function fetchSchool() {
      const res = await api.get("/api/schools/me");
      setSchool(res.data.data);
      setLoading(false);
    }
    fetchSchool();
  }, []);

  if (loading) return <div className="p-6">Loading school...</div>;

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
          onClick={() => setCurrentStep((s) => s + 1)}
          className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
