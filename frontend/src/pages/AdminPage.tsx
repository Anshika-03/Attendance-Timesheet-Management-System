import { useEffect, useState } from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import KPICard from '../components/KPICard'
import { Users, UserCheck, UserX, Shield } from 'lucide-react'

type User = {
  id: number
  name: string
  email: string
  role: string
  manager_id: number | null
  created_at: string
}

export default function AdminPage() {

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'team_member',
    manager_id: ''
  })

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  // Derived KPI stats from real users
  const totalUsers = users.length
  const managers = users.filter((u) => u.role === 'manager')
  const teamMembers = users.filter((u) => u.role === 'team_member')
  const admins = users.filter((u) => u.role === 'super_admin')

  function getManagerName(managerId: number | null) {
    const manager = users.find((u) => u.id === managerId)
    return manager ? manager.name : '—'
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        manager_id: formData.manager_id ? Number(formData.manager_id) : null,
        ...(formData.password ? { password: formData.password } : {})
      }

      if (editingUser) {
        const response = await api.put(`/admin/users/${editingUser.id}`, payload)
        alert(response.data.message)
      } else {
        const response = await api.post('/admin/create-user', formData)
        alert(response.data.message)
      }

      fetchUsers()
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'team_member', manager_id: '' })
    } catch (error: unknown) {
      console.error(error)
}
  }

  async function handleDeleteUser(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this user?')
    if (!confirmed) return
    try {
      const response = await api.delete(`/admin/users/${id}`)
      alert(response.data.message)
      fetchUsers()
    } catch (error: unknown) {
  console.error(error)
}
  }

  async function fetchUsers() {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data.users)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Good Morning, Admin 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage your organization's users and attendance
          </p>
        </div>

        {/* KPI Cards — real data from /admin/users */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Total Users"
            value={totalUsers}
            trend="All registered users"
            icon={<Users className="text-blue-500" />}
          />
          <KPICard
            title="Managers"
            value={managers.length}
            trend="Active managers"
            icon={<UserCheck className="text-violet-500" />}
          />
          <KPICard
            title="Team Members"
            value={teamMembers.length}
            trend="Active employees"
            icon={<UserX className="text-cyan-500" />}
          />
          <KPICard
            title="Admins"
            value={admins.length}
            trend="Super admins"
            icon={<Shield className="text-orange-500" />}
          />
        </div>

        {/* User Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-slate-100 font-semibold text-lg mb-4">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h2>

          <form onSubmit={handleSaveUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required={!editingUser}
                className="bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="password"
                name="password"
                placeholder={editingUser ? 'New Password (leave blank to keep)' : 'Password'}
                value={formData.password}
                onChange={handleChange}
                className="bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-slate-700 border border-slate-600 text-slate-100 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="team_member">Team Member</option>
                <option value="manager">Manager</option>
              </select>

              {formData.role === 'team_member' && (
                <select
                  name="manager_id"
                  value={formData.manager_id}
                  onChange={handleChange}
                  className="bg-slate-700 border border-slate-600 text-slate-100 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Select Manager (optional)</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null)
                    setFormData({ name: '', email: '', password: '', role: 'team_member', manager_id: '' })
                  }}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-slate-100 font-semibold">Organization Users</h2>
            <p className="text-slate-400 text-sm">{totalUsers} total users</p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-700">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Manager</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-700 hover:bg-slate-700/40 transition"
                >
                  <td className="px-6 py-4 text-slate-200 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'super_admin'
                        ? 'bg-orange-500/20 text-orange-400'
                        : user.role === 'manager'
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'bg-slate-600 text-slate-300'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {getManagerName(user.manager_id)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(user)
                          setFormData({
                            name: user.name,
                            email: user.email,
                            password: '',
                            role: user.role,
                            manager_id: user.manager_id ? String(user.manager_id) : ''
                          })
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-8 text-center text-slate-400">No users found.</div>
          )}
        </div>

      </div>
    </AppLayout>
  )
}