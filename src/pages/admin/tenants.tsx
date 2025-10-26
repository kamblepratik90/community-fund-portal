import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  relation: string;
  role: string;
  status: string;
}
interface Tenant {
  id: string;
  name: string;
  address: string;
  users: User[];
}

export default function AdminTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  function fetchTenants(query = "") {
    setLoading(true);
    axios
      .get("/api/admin/tenants", { params: { search: query } })
      .then((res) => {
        setTenants(res.data.tenants);
        setLoading(false);
      });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchTenants(search);
  }

  async function handleTenantStatus(id: string, status: string) {
    await axios.post(`/api/admin/tenant/${id}/status`, { status });
    fetchTenants(search);
  }

  // Compute tenant status based on user statuses
  function computeTenantStatus(users: User[]) {
    if (users.length === 0) return "No Members";
    if (users.every(u => u.status === "REJECTED")) return "Inactive";
    if (users.some(u => u.status === "ACTIVE")) return "Active";
    return "Mixed";
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Tenants / Families</h1>
      <form onSubmit={handleSearch} className="mb-4 flex gap-3">
        <input
          type="text"
          className="border px-2 py-1 rounded w-60"
          placeholder="Search by tenant/family name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          Search
        </button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : tenants.length === 0 ? (
        <div className="text-gray-500">No tenants found.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Family Name</th>
              <th>Address</th>
              <th>Status</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => {
              const tenantStatus = computeTenantStatus(t.users);
              const allRejected = t.users.length > 0 && t.users.every(u => u.status === "REJECTED");
              return (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.address}</td>
                  <td>
                    <span className={tenantStatus === "Active" ? "text-green-600" : "text-gray-500"}>
                      {tenantStatus}
                    </span>
                  </td>
                  <td>
                    <details>
                      <summary>
                        {t.users.length} member{t.users.length !== 1 ? "s" : ""}
                      </summary>
                      <ul className="pl-4">
                        {t.users.map((u) => (
                          <li key={u.id} className="mb-1">
                            <span>
                              {u.name} ({u.relation}) - {u.email} [{u.status}]
                            </span>
                            <a
                              href={`/admin/users/${u.id}/edit`}
                              className="text-blue-500 underline ml-2 text-sm"
                            >
                              Edit
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <a
                        href={`/admin/tenants/${t.id}/edit`}
                        className="text-blue-600 underline text-sm"
                      >
                        Edit Tenant
                      </a>
                      {allRejected ? (
                        <button
                          onClick={() => handleTenantStatus(t.id, "ACTIVE")}
                          className="text-green-600 underline text-sm"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTenantStatus(t.id, "REJECTED")}
                          className="text-red-600 underline text-sm"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}