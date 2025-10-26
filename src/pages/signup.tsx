import { useState, useEffect } from 'react'
import axios from 'axios'

interface Tenant {
  id: string
  name: string
}

export default function Signup() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [form, setForm] = useState({
    tenantId: '',
    name: '',
    relation: '',
    mobile: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch tenants for dropdown
  useEffect(() => {
    axios.get('/api/tenants').then(res => setTenants(res.data.tenants))
  }, [])

  const RELATIONS = [
    'SELF', 'WIFE', 'HUSBAND', 'SON', 'DAUGHTER', 'GRANDSON', 'GRANDDAUGHTER', 'SON_IN_LAW', 'DAUGHTER_IN_LAW'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await axios.post('/api/auth/register', form)
      setSuccess(res.data.message)
      setForm({
        tenantId: '',
        name: '',
        relation: '',
        mobile: '',
        email: '',
        password: '',
      })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign Up (Request Approval)</h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {success && <div className="mb-2 text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <select name="tenantId" value={form.tenantId} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Select Tenant Family</option>
          {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select name="relation" value={form.relation} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Select Relation</option>
          {RELATIONS.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
        </select>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="w-full border rounded px-2 py-1" />
        <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile" required className="w-full border rounded px-2 py-1" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full border rounded px-2 py-1" />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required className="w-full border rounded px-2 py-1" />
        <button type="submit" className="w-full bg-indigo-600 text-white rounded py-2">Submit Signup Request</button>
      </form>
    </div>
  )
}