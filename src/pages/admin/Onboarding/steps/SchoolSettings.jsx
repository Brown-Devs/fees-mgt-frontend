export default function SchoolSettings({ hasBranches, setHasBranches }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">School Settings</h2>

      <label className="flex items-start sm:items-center gap-3">
        <input
          type="checkbox"
          checked={hasBranches}
          onChange={(e) => setHasBranches(e.target.checked)}
          className="mt-1 sm:mt-0"
        />
        <span className="text-sm">
          This school has multiple branches
        </span>
      </label>
    </div>
  );
}
