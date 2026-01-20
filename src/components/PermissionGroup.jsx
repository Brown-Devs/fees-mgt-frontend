import React from "react";

export default function PermissionGroup({ title, options, values, onChange }) {
    return (
        <div className="mb-4">
            <h4 className="font-semibold text-slate-700 mb-2">{title}</h4>
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(options).map(([label, value]) => (
                    <label key={value} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={values.includes(value)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    onChange([...values, value]);
                                } else {
                                    onChange(values.filter((v) => v !== value));
                                }
                            }}
                        />
                        <span>{label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
