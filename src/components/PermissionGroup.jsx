import React from "react";

export default function PermissionGroup({ title, options, values, onChange }) {
  const allValues = Object.values(options);
  const allChecked = allValues.every((v) => values.includes(v));

  const toggleAll = () => {
    if (allChecked) {
      onChange(values.filter((v) => !allValues.includes(v)));
    } else {
      const merged = Array.from(new Set([...values, ...allValues]));
      onChange(merged);
    }
  };

  const toggle = (value, checked) => {
    if (checked) {
      onChange(Array.from(new Set([...values, value])));
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-[#0a1a44] text-sm">{title}</h4>
        <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            className="accent-[#0a1a44]"
          />
          All
        </label>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {Object.entries(options).map(([label, value]) => (
          <label key={value} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={values.includes(value)}
              onChange={(e) => toggle(value, e.target.checked)}
              className="accent-[#0a1a44]"
            />
            <span className="capitalize">{label.charAt(0) + label.slice(1).toLowerCase()}</span>
          </label>
        ))}
      </div>
    </div>
  );
}