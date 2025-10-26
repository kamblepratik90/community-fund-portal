import { useEffect, useState } from "react";
import axios from "axios";

interface Payment {
  id: string;
  amount: number;
  month: number;
  year: number;
  proofUrl?: string;
  user: {
    name: string;
    tenant: { name: string };
  };
  adminNote?: string;
}

export default function PendingPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNote, setActionNote] = useState<Record<string, string>>({});

  useEffect(() => {
    axios.get("/api/admin/pending-payments").then(res => {
      setPayments(res.data.payments);
      setLoading(false);
    });
  }, []);

  const handleAction = async (paymentId: string, action: "APPROVE" | "REJECT") => {
    const adminNote = actionNote[paymentId] || "";
    await axios.post("/api/admin/approve-payment", { paymentId, action, adminNote });
    setPayments(payments => payments.filter(p => p.id !== paymentId));
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Pending Payments</h1>
      {payments.length === 0 ? (
        <div className="text-gray-500">No pending payments.</div>
      ) : (
        <table className="w-full border mb-6">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tenant</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Proof</th>
              <th>Admin Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.user.name}</td>
                <td>{p.user.tenant.name}</td>
                <td>
                  {p.month}/{p.year}
                </td>
                <td>₹{p.amount}</td>
                <td>
                  {p.proofUrl ? (
                    <a href={p.proofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={actionNote[p.id] || ""}
                    placeholder="Add note"
                    onChange={e => setActionNote({ ...actionNote, [p.id]: e.target.value })}
                    className="border px-2 py-1 rounded w-32"
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleAction(p.id, "APPROVE")}
                    className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(p.id, "REJECT")}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}