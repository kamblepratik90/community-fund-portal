import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditTenant() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      axios.get(`/api/admin/tenant/${id}`).then(res => {
        setForm({ name: res.data.tenant.name, address: res.data.tenant.address });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await axios.patch(`/api/admin/tenant/${id}`, form);
      setSuccess("Tenant updated!");
      setTimeout(() => router.push("/admin/tenants"), 1000);
    } catch (e) {
      setError("Failed to update tenant.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Edit Tenant / Family</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <div>
          <label className="block mb-1 font-medium">Family Name</label>
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
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="border px-2 py-1 rounded w-full"
          />
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