export default function SchoolProfile({ school }) {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            School Profile
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Core details of your institution
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full
                         bg-[#0b1f3a]/10 text-[#0b1f3a] font-medium">
          Step 1 of 5
        </span>
      </div>

      {/* Premium Card */}
      <div className="bg-white rounded-2xl
                      shadow-[0_14px_36px_rgba(0,0,0,0.08)]
                      border border-slate-200 overflow-hidden">

        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r
                        from-[#0b1f3a] to-[#162e52]" />

        <div className="p-8">
          {/* Section title */}
          <h3 className="text-sm font-semibold text-[#0b1f3a]
                         uppercase tracking-wide mb-6">
            Institution Information
          </h3>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoField label="School Name" value={school?.name} />
            <InfoField label="School Code" value={school?.code} />
            <InfoField label="Address" value={school?.address} full />
            <InfoField label="City" value={school?.city} />
            <InfoField label="State" value={school?.state} />
            <InfoField label="PIN Code" value={school?.pin} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */

function InfoField({ label, value, full = false }) {
  return (
    <div
      className={`relative rounded-xl border border-slate-200 bg-slate-50
                  px-4 py-3 transition
                  hover:border-[#0b1f3a]/40 hover:bg-white
                  ${full ? "sm:col-span-2" : ""}`}
    >
      <p className="text-xs text-slate-500 mb-1">{label}</p>

      <p className="text-sm font-medium text-slate-900">
        {value || "—"}
      </p>

      {/* subtle bottom indicator */}
      <div className="absolute inset-x-0 bottom-0 h-[2px]
                      bg-transparent hover:bg-[#0b1f3a]" />
    </div>
  );
}
