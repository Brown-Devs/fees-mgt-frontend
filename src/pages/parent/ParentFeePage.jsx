// src/pages/parent/ParentFeePage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import { useStudentByParent } from "./hooks/useStudentByParent";
import { PageShell, Card, CardTitle, StatCard, Badge, Spinner, ErrorBox, EmptyState } from "./components/ui";

export default function ParentFeePage() {
  const { student, loading: sLoad, error: sErr } = useStudentByParent();
  const [fee,      setFee]      = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!student) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fRes, pRes] = await Promise.all([
          api.get(`/api/fees/student/${student._id}`),
          api.get(`/api/payments/student/${student._id}`),
        ]);
        setFee(fRes.data.data);
        setPayments(pRes.data.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load fee details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [student]);

  if (sLoad || loading) return <Spinner />;
  if (sErr || error)    return <ErrorBox message={sErr || error} />;

  const feeItems = Object.entries(fee?.feeData || {});

  return (
    <PageShell title="Fee Details" subtitle="Complete fee structure and payment history">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total Fee"   value={`₹${(fee?.totalFee || 0).toLocaleString()}`}   colorClass="text-[#0a1a44]" />
        <StatCard label="Paid"        value={`₹${(fee?.paid || 0).toLocaleString()}`}        colorClass="text-green-600" />
        <StatCard label="Outstanding" value={`₹${(fee?.outstanding || 0).toLocaleString()}`} colorClass="text-red-600" />
      </div>

      {/* Fee breakdown */}
      {feeItems.length > 0 && (
        <Card>
          <CardTitle>📋 Fee Structure</CardTitle>
          {feeItems.map(([head, amount]) => (
            <div key={head} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-600">{head}</span>
              <span className="text-sm font-semibold text-[#0a1a44]">₹{Number(amount).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 mt-1">
            <span className="font-bold text-[#0a1a44]">Total</span>
            <span className="text-lg font-bold text-[#0a1a44]">₹{(fee?.totalFee || 0).toLocaleString()}</span>
          </div>
        </Card>
      )}

      {/* Payment history */}
      <Card>
        <CardTitle>💳 Payment History</CardTitle>
        {payments.length === 0 ? (
          <EmptyState message="No payments recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {["Date","Amount","Mode","Status","Proof"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-t border-slate-50 hover:bg-slate-50/60">
                    <td className="px-3 py-3 text-slate-600">
                      {new Date(p.paymentDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#0a1a44]">₹{p.amount.toLocaleString()}</td>
                    <td className="px-3 py-3 text-slate-500">{p.mode}</td>
                    <td className="px-3 py-3"><Badge status={p.status} /></td>
                    <td className="px-3 py-3">
                      {p.screenshotUrl ? (
                        <a href={p.screenshotUrl} target="_blank" rel="noreferrer"
                           className="text-blue-600 text-xs font-semibold hover:underline">
                          View
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageShell>
  );
}
