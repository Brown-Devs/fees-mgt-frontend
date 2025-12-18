export default function FeesInfoModal({ student, fees, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2">
          Fees Info - {student.firstName} {student.lastName}
        </h2>

        <div className="text-sm text-slate-600 mb-4">
          Total Due: ₹{fees.totalDue} | Total Paid: ₹{fees.totalPaid}
        </div>

        {fees.invoices?.length ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {fees.invoices.map((inv) => (
              <div
                key={inv._id}
                className="border p-3 rounded flex justify-between"
              >
                <div>
                  <div className="font-medium">
                    {inv.title || "Invoice"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {inv.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ₹{inv.amount}
                  </div>
                  <div className="text-xs text-slate-500">
                    {inv.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            No fees records yet.
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-slate-600 text-white py-2 rounded hover:bg-slate-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
