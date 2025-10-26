import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function MakePayment() {
  const router = useRouter();
  const [amount, setAmount] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch current outstanding amount (you can adjust API as needed)
  useEffect(() => {
    axios.get("/api/user/payments").then(res => {
      // Find current month
      const now = new Date();
      const curr = res.data.payments.find(
        (p: any) =>
          p.month === now.getMonth() + 1 && p.year === now.getFullYear()
      );
      if (curr) setAmount(curr.amount);
      else setAmount(1000); // Default or fetch from config
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!file) {
      setError("Upload payment proof!");
      return;
    }
    const form = new FormData();
    form.append("amount", String(amount));
    form.append("proof", file);

    try {
      await axios.post("/api/user/submit-payment", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess("Payment submitted! Awaiting admin approval.");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Submission failed");
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white mt-10 p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Make Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <div>
          <label className="block mb-1">Amount (₹)</label>
          <input
            type="number"
            className="border px-2 py-1 rounded w-full"
            value={amount ?? ""}
            onChange={e => setAmount(Number(e.target.value))}
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1">Upload Payment Proof</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="border px-2 py-1 rounded w-full"
            onChange={e => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}