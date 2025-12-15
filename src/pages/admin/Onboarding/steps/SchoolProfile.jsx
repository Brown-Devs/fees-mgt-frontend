export default function SchoolProfile({ school }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">School Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="School Name" value={school.name} />
        <Field label="School Code" value={school.code} />
        <Field label="Address" value={school.address} />
        <Field label="City" value={school.city} />
        <Field label="State" value={school.state} />
        <Field label="PIN" value={school.pin} />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="text-sm text-slate-600">{label}</label>
      <input
        disabled
        value={value || "-"}
        className="w-full border px-3 py-2 rounded bg-slate-50 text-sm"
      />
    </div>
  );
}
