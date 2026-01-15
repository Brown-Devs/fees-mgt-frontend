// src/pages/parent/components/FeeDetails.jsx
import React from "react";

const FeeDetails = ({ student, feeData, totalFee, payments }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6 space-y-6">
      <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
        Fee & Payment Details
      </h4>

      {/* Fee Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(feeData || {}).map(([head, amount]) => (
          <p key={head}>
            <strong>{head}:</strong> ₹{amount}
          </p>
        ))}
      </div>

      <p className="mt-4 font-semibold text-[#0a1a44]">
        Total Fee: ₹{totalFee}
      </p>

      {/* Payment History */}
      <div className="mt-6">
        <h5 className="text-md font-semibold text-[#0a1a44] mb-2">
          Payment History
        </h5>
        {payments.length === 0 ? (
          <p className="text-gray-500">No payments recorded yet.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Mode</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Proof</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="p-2 border">
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">₹{p.amount}</td>
                  <td className="p-2 border">{p.mode}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        p.status === "Pending"
                          ? "bg-yellow-500"
                          : p.status === "Verified"
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {p.screenshotUrl ? (
                      <a
                        href={p.screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-500">No proof</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FeeDetails;
