import React from "react";

const FeeDetails = ({ student, feeData, payments, onRecordPayment }) => {
  const totalMonthlyFee =
    (feeData?.tuitionFee || 0) +
    (feeData?.examFee || 0) +
    (feeData?.otherCharges || 0) +
    (student?.transportFee || 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h3 className="text-2xl font-semibold text-[#0a1a44] mb-4">
        Fee Details
      </h3>

      {/* Fee Structure */}
      <div className="grid grid-cols-2 gap-6">
  {Object.entries(feeData).map(([head, amount]) => (
    <div key={head} className="p-4 bg-gray-50 rounded-lg border">
      <p className="text-gray-600">{head}</p>
      <p className="text-xl font-semibold">₹{amount}</p>
    </div>
  ))}

  {/* Transport Fee */}
  <div className="p-4 bg-gray-50 rounded-lg border">
    <p className="text-gray-600">Transport Fee</p>
    <p className="text-xl font-semibold">₹{student?.transportFee || 0}</p>
  </div>
</div>


      {/* Total */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-lg font-semibold text-blue-900">
          Total Monthly Fee: ₹{totalMonthlyFee}
        </p>
      </div>

      {/* Payment History */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold mb-3">Payment History</h4>

        {payments?.length === 0 ? (
          <p className="text-gray-500">No payments recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Mode</th>
                  <th className="p-3 text-left">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.date}</td>
                    <td className="p-3">₹{p.amount}</td>
                    <td className="p-3">{p.mode}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Button */}
      <div className="mt-6">
        <button
          className="bg-[#0a1a44] text-white px-5 py-2 rounded-lg hover:bg-[#0c2258]"
          onClick={onRecordPayment}
        >
          Record Payment
        </button>
      </div>
    </div>
  );
};

export default FeeDetails;
