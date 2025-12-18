import React from "react";

const FeeDetails = ({ student, feeData, totalFee, payments, onRecordPayment }) => {
  return (
    <div className="space-y-6">

      {/* Fee Breakdown */}
      <div className="bg-white shadow rounded-xl p-6">
        <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
          Monthly Fee Breakdown
        </h4>

        {/* Dynamic Fee Heads */}
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(feeData || {}).map(([head, amount]) => (
            <div
              key={head}
              className="p-4 bg-gray-50 rounded-lg border shadow-sm"
            >
              <p className="text-gray-600">{head}</p>
              <p className="text-xl font-semibold">₹{amount}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 p-4 bg-[#0a1a44] text-white rounded-lg shadow">
          <p className="text-lg font-semibold">Total Monthly Fee</p>
          <p className="text-2xl font-bold">₹{totalFee}</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white shadow rounded-xl p-6">
        <h4 className="text-lg font-semibold text-[#0a1a44] mb-4">
          Payment History
        </h4>

        {(!payments || payments.length === 0) ? (
          <p className="text-gray-500">No payments recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p._id}
                className="border-b pb-2 flex justify-between items-center"
              >
                <div>
                  <p><strong>Amount:</strong> ₹{p.amount}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(p.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-green-600 font-semibold">
                  {p.mode || "Cash"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Record Payment Button */}
        <button
          onClick={onRecordPayment}
          className="mt-4 bg-[#0a1a44] text-white px-4 py-2 rounded-lg shadow hover:bg-[#0c225c]"
        >
          Record Payment
        </button>
      </div>
    </div>
  );
};

export default FeeDetails;
