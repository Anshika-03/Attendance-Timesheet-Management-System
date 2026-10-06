import { useEffect, useState } from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'

type TeamMember = {
  id: number
  name: string
  check_in: string | null
  check_out: string | null
  status: string
}

export default function ManagerPage() {

  const [team, setTeam] = useState<TeamMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Filter by name search
  const filteredTeam = team.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Stats derived from live data
  const presentCount = team.filter((m) => m.status === 'present').length
  const absentCount = team.filter((m) => m.status === 'absent').length
  const teamSize = team.length
  const attendanceRate = teamSize
    ? Math.round((presentCount / teamSize) * 100)
    : 0

  // Fetch from /api/manager/team-attendance
  useEffect(() => {
  const loadTeam = async () => {
    setLoading(true)

    try {
      const response = await api.get('/manager/team-attendance')
      setTeam(response.data.team ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  loadTeam()
}, [])

  function formatTime(iso: string | null) {
    if (!iso) return '—'
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Team Attendance
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Today's attendance overview for your team
            </p>
          </div>
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-slate-700 px-4 py-2 rounded-xl w-56 text-slate-100 bg-slate-800 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Team Size</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{teamSize}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Present</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{presentCount}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Absent</p>
            <p className="text-3xl font-bold text-red-400 mt-2">{absentCount}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Attendance Rate</p>
            <p className="text-3xl font-bold text-violet-400 mt-2">{attendanceRate}%</p>
          </div>
        </div>

        {/* Team Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-slate-100 font-semibold">Team Members</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : filteredTeam.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No team members found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-700">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Check In</th>
                  <th className="px-6 py-3">Check Out</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeam.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-slate-700 hover:bg-slate-700/40 transition"
                  >
                    <td className="px-6 py-4 text-slate-200 font-medium">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {formatTime(member.check_in)}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {formatTime(member.check_out)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          member.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'present' ? 'bg-emerald-400' : 'bg-red-400'
                        }`} />
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </AppLayout>
  )
}