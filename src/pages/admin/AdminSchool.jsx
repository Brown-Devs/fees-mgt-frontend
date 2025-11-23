import { useEffect, useState } from "react";
import api from "../../apis/axios";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminSchool() {
  const { user, token } = useAuth();
  const schoolId = user.schoolId;
  
  const [form, setForm] = useState({
    name: "",
    session: "",
    timezone: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      ifsc: "",
      bankName: "",
    },
    settings: {
      weekendDays: [0],
      invoiceDueDay: 10,
      currency: "INR",
      autoInvoiceGenerate: false,
    },
  });

 
  useEffect(() => {
    const fetchSchool = async () => {
      const res = await api.get(`/api/admin/schools/${schoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(res.data);
    };
    fetchSchool();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    const res = await api.put(
      `/api/admin/schools/${schoolId}`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Saved successfully");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">School Profile</h1>

      <form onSubmit={save} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            className="input border p-2 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label>Session</label>
          <input
            className="input border p-2 w-full"
            value={form.session}
            onChange={(e) => setForm({ ...form, session: e.target.value })}
          />
        </div>

        <div>
          <label>Timezone</label>
          <input
            className="input border p-2 w-full"
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
          />
        </div>

        {/* Bank Details */}
        <h3 className="font-semibold mt-4">Bank Details</h3>

        <input
          className="border p-2 w-full"
          placeholder="Account Name"
          value={form.bankDetails.accountName}
          onChange={(e) =>
            setForm({
              ...form,
              bankDetails: { ...form.bankDetails, accountName: e.target.value },
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Account Number"
          value={form.bankDetails.accountNumber}
          onChange={(e) =>
            setForm({
              ...form,
              bankDetails: { ...form.bankDetails, accountNumber: e.target.value },
            })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
