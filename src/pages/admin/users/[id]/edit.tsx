import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const RELATION_OPTIONS = [
  "SELF",
  "WIFE",
  "HUSBAND",
  "SON",
  "DAUGHTER",
  "GRANDSON",
  "GRANDDAUGHTER",
  "SON_IN_LAW",
  "DAUGHTER_IN_LAW",
];

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    relation: "",
    status: "ACTIVE",
    role: "TENANT",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      axios.get(`/api/admin/user/${id}`).then(res => {
        setForm({
          name: res.data.user.name,
          email: res.data.user.email,
          mobile: res.data.user.mobile,
          relation: res.data.user.relation,
          status: res.data.user.status,
          role: res.data.user.role,
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await axios.patch(`/api/admin/user/${id}`, form);
      setSuccess("User updated!");
      setTimeout(() => router.push("/admin/tenants"), 1000);
    } catch (e) {
      setError("Failed to update user.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Relation</label>
          <select
            name="relation"
            value={form.relation}
            onChange={handleChange}
            required
            className="border px-2 py-1 rounded w-full">
            {RELATION_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt.charAt(0) + opt.slice(1).toLowerCase().replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="REJECTED">REJECTED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="TENANT">TENANT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}