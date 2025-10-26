import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

// Types
type PendingUser = {
  id: string;
  name: string;
  relation: string;
  email: string;
  tenant: { name: string };
};
type PendingPayment = {
  id: string;
  user: { name: string; tenant: { name: string } };
  month: number;
  year: number;
  amount: number;
  proofUrl: string | null;
};

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [usersRes, paymentsRes] = await Promise.all([
        axios.get("/api/admin/pending-users"),
        axios.get("/api/admin/pending-payments"),
      ]);
      setPendingUsers(usersRes.data.users);
      setPendingPayments(paymentsRes.data.payments);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Pending Signups</h2>
          {pendingUsers.length === 0 ? (
            <p className="text-gray-500">No pending signups.</p>
          ) : (
            <table className="w-full border mb-2">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tenant</th>
                  <th>Relation</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.slice(0, 4).map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.tenant.name}</td>
                    <td>{user.relation.replace(/_/g, " ")}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link href="/admin/pending-signups" className="text-blue-600 underline">
            View all / Approve
          </Link>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Pending Payments</h2>
          {pendingPayments.length === 0 ? (
            <p className="text-gray-500">No pending payments.</p>
          ) : (
            <table className="w-full border mb-2">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tenant</th>
                  <th>Month</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.slice(0, 4).map((p) => (
                  <tr key={p.id}>
                    <td>{p.user.name}</td>
                    <td>{p.user.tenant.name}</td>
                    <td>
                      {new Date(p.year, p.month - 1).toLocaleString("default", {
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td>₹{p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link href="/admin/pending-payments" className="text-blue-600 underline">
            View all / Approve
          </Link>
        </section>
      </div>

      <div className="mt-8 flex gap-6">
        <Link href="/admin/tenants" className="bg-gray-100 px-4 py-2 rounded">
          Tenant List
        </Link>
        <Link href="/admin/payments" className="bg-gray-100 px-4 py-2 rounded">
          Payment Status
        </Link>
        <Link href="/admin/export" className="bg-gray-100 px-4 py-2 rounded">
          Export Reports
        </Link>
      </div>
    </div>
  );
}