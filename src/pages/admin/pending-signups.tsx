import { useEffect, useState } from 'react'
import axios from 'axios'

interface PendingUser {
  id: string
  name: string
  relation: string
  mobile: string
  email: string
  tenant: { name: string }
}

export default function PendingSignups() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/admin/pending-users').then(res => {
      setUsers(res.data.users)
      setLoading(false)
    })
  }, [])

  const handleAction = async (userId: string, action: 'APPROVE' | 'REJECT') => {
    await axios.post('/api/admin/approve-user', { userId, action })
    setUsers(users => users.filter(u => u.id !== userId))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pending User Signups</h2>
      {users.length === 0 && <p>No pending signups.</p>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Tenant</th>
            <th>Relation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.tenant.name}</td>
              <td>{u.relation.replace(/_/g, ' ')}</td>
              <td>
                <button
                  onClick={() => handleAction(u.id, 'APPROVE')}
                  className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                >Approve</button>
                <button
                  onClick={() => handleAction(u.id, 'REJECT')}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}