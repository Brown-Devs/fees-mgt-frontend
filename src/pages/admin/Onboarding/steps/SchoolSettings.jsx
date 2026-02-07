export default function SchoolSettings({ hasBranches, setHasBranches }) {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            School Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure how your school structure works
          </p>
        </div>

        <span
          className="text-xs px-3 py-1 rounded-full
                     bg-[#0b1f3a]/10 text-[#0b1f3a] font-medium"
        >
          Step 4 of 5
        </span>
      </div>

      {/* Premium Card */}
      <div
        className="bg-white rounded-2xl
                   shadow-[0_14px_36px_rgba(0,0,0,0.08)]
                   border border-slate-200 overflow-hidden"
      >
        {/* Accent bar */}
        <div
          className="h-1 bg-gradient-to-r
                     from-[#0b1f3a] to-[#162e52]"
        />

        <div className="p-8 space-y-8">
          {/* Section title */}
          <h3
            className="text-sm font-semibold text-[#0b1f3a]
                       uppercase tracking-wide"
          >
            Branch Configuration
          </h3>

          {/* Option Card */}
          <div
            className={`rounded-xl border p-5 flex items-start gap-4
                        transition cursor-pointer
                        ${hasBranches
                ? "border-[#0b1f3a] bg-[#0b1f3a]/5"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            onClick={() => setHasBranches(!hasBranches)}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={hasBranches}
              onChange={(e) => setHasBranches(e.target.checked)}
              className="mt-1 accent-[#0b1f3a]"
            />

            {/* Text */}
            <div>
              <p className="font-medium text-slate-900">
                Multiple Branch School
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Enable this if your institution operates across multiple
                campuses or locations.
              </p>
            </div>
          </div>

          {/* Helper text */}
          <p className="text-xs text-slate-400">
            You can manage branch details in the next step.
          </p>
        </div>
      </div>
    </div>
  );
}
