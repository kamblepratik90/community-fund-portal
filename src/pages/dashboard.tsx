import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  relation: string;
  status: string;
}
interface Payment {
  id: string;
  month: number;
  year: number;
  amount: number;
  status: string;
  proofUrl?: string;
  createdAt: string;
}
interface Tenant {
  id: string;
  name: string;
  address: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

    const [apiError, setApiError] = useState("");

    useEffect(() => {
    if (status === "authenticated") {
        axios.get("/api/user/info").then(res => {
        setUser(res.data.user);
        setTenant(res.data.tenant);
        }).catch(err => setApiError("Failed to load user info"));

        axios.get("/api/user/payments").then(res => setPayments(res.data.payments))
        .catch(err => setApiError("Failed to load payments"));

        axios.get("/api/user/tenant-members").then(res => setMembers(res.data.members))
        .catch(err => setApiError("Failed to load members"));

        setLoading(false);
    }
    }, [status]);

if (apiError) return <div className="p-8 text-red-600">{apiError}</div>;

  if (status === "loading" || loading) return <div className="p-8">Loading...</div>;
  if (!user || !tenant) return <div className="p-8">Could not load dashboard.</div>;

  // Find current month/year
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const currentPayment = payments.find(
    p => p.month === currentMonth && p.year === currentYear
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}</h1>
      <div className="mb-4 text-gray-700">
        <div>
          <b>Family/Flat:</b> {tenant.name}
        </div>
        <div>
          <b>Address:</b> {tenant.address}
        </div>
        <div>
          <b>Your Relation:</b> {user.relation.replace(/_/g, " ")}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Month Payment</h2>
        {currentPayment ? (
          <div className="bg-green-50 border border-green-200 rounded p-3 flex flex-col gap-2">
            <div>
              <b>Status:</b>{" "}
              <span className="text-green-700">{currentPayment.status}</span>
            </div>
            <div>
              <b>Amount:</b> ₹{currentPayment.amount}
            </div>
            {currentPayment.proofUrl && (
              <a
                href={currentPayment.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Receipt
              </a>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex flex-col gap-2">
            <div className="text-yellow-700 font-semibold">
              Payment is pending for this month.
            </div>
            <Link
              href="/payment"
              className="bg-indigo-600 text-white px-4 py-2 rounded w-max"
            >
              Make Payment
            </Link>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment History</h2>
        {payments.length === 0 ? (
          <div className="text-gray-500">No payments found.</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .sort((a, b) =>
                  a.year !== b.year
                    ? b.year - a.year
                    : b.month - a.month
                )
                .map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.month}/{p.year}
                    </td>
                    <td>₹{p.amount}</td>
                    <td>{p.status}</td>
                    <td>
                      {p.proofUrl ? (
                        <a
                          href={p.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Family Members</h2>
        <ul className="pl-4">
          {members.map(m => (
            <li key={m.id}>
              {m.name} ({m.relation.replace(/_/g, " ")}) - {m.email} [{m.status}]
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}