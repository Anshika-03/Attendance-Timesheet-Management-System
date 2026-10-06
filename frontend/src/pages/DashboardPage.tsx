import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'

type Stats = {
  attendancePercentage: number
  presentDays: number
  absentDays: number
  streak: number
}

type TodayAttendance = {
  id: number
  date: string
  check_in: string | null
  check_out: string | null
  status: string
  working_hours: number
  overtime_hours: number
  late_minutes: number
} | null

type HistoryItem = {
  id: number
  date: string
  status: string
  check_in: string | null
  check_out: string | null
  working_hours: number
  overtime_hours: number
  late_minutes: number
}

export default function DashboardPage() {
  const auth = useAuth()

  const [todayAttendance, setTodayAttendance] =
    useState<TodayAttendance>(null)

  const [stats, setStats] = useState<Stats>({
    attendancePercentage: 0,
    presentDays: 0,
    absentDays: 0,
    streak: 0
  })

  const [history, setHistory] = useState<HistoryItem[]>([])

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  function showToast(
    message: string,
    type: 'success' | 'error' = 'success'
  ) {
    setToast({ message, type })

    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  function formatTime(iso: string | null) {
    if (!iso) return '—'

    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  async function fetchAll() {
    try {
      const [todayRes, statsRes, historyRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/attendance/stats'),
        api.get('/attendance/history')
      ])

      setTodayAttendance(todayRes.data.attendance)
      setStats(statsRes.data.stats)

      setHistory(
        Array.isArray(historyRes.data.history)
          ? historyRes.data.history
          : []
      )
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchAll()
    }

    void loadData()
  }, [])

  async function handleCheckIn() {
    try {
      const response = await api.post('/attendance/check-in')

      showToast(response.data.message, 'success')

      await fetchAll()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message ??
            'Check-in failed',
          'error'
        )
      } else {
        showToast('Check-in failed', 'error')
      }
    }
  }

  async function handleCheckOut() {
    try {
      const response = await api.post('/attendance/check-out')

      showToast(response.data.message, 'success')

      await fetchAll()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message ??
            'Check-out failed',
          'error'
        )
      } else {
        showToast('Check-out failed', 'error')
      }
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Hello, {auth.user?.name} 👋
          </h1>

          <p className="text-slate-400 text-sm mt-0.5">
            {new Date().toLocaleDateString([], {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
              Attendance %
            </p>

            <p className="text-3xl font-bold text-violet-400 mt-2">
              {stats.attendancePercentage}%
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
              Present Days
            </p>

            <p className="text-3xl font-bold text-emerald-400 mt-2">
              {stats.presentDays}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
              Absent Days
            </p>

            <p className="text-3xl font-bold text-red-400 mt-2">
              {stats.absentDays}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
              Streak 
            </p>

            <p className="text-3xl font-bold text-orange-400 mt-2">
              {stats.streak}
            </p>
          </div>
        </div>

        {/* Today's Card */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <p className="text-white/70 text-sm font-medium">
                Today's Status
              </p>

              <p
                className={`text-2xl font-bold mt-1 ${
                  todayAttendance?.status === 'present'
                    ? 'text-emerald-300'
                    : 'text-red-300'
                }`}
              >
                {todayAttendance?.status
                  ? todayAttendance.status.charAt(0).toUpperCase() +
                    todayAttendance.status.slice(1)
                  : 'Not Checked In'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCheckIn}
                disabled={!!todayAttendance?.check_in}
                className="bg-white text-violet-700 hover:bg-violet-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold px-5 py-2.5 rounded-xl text-sm transition"
              >
                Check In
              </button>

              <button
                onClick={handleCheckOut}
                disabled={
                  !todayAttendance?.check_in ||
                  !!todayAttendance?.check_out
                }
                className="bg-white/20 hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-white/30 transition"
              >
                Check Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/60 text-xs">Check In</p>

              <p className="text-white font-semibold mt-1">
                {formatTime(todayAttendance?.check_in ?? null)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/60 text-xs">Check Out</p>

              <p className="text-white font-semibold mt-1">
                {formatTime(todayAttendance?.check_out ?? null)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/60 text-xs">
                Working Hours
              </p>

              <p className="text-white font-semibold mt-1">
  {todayAttendance?.working_hours
    ? `${todayAttendance.working_hours} hrs`
    : '--'}
</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
  <p className="text-white/60 text-xs">
    Late Minutes
  </p>

  <p className="text-white font-semibold mt-1">
    {todayAttendance?.late_minutes ?? 0} min
  </p>
</div>
<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
  <p className="text-white/60 text-xs">
    Overtime
  </p>

  <p className="text-white font-semibold mt-1">
    {todayAttendance?.overtime_hours ?? 0} hrs
  </p>
</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-slate-100 font-semibold">
              Recent Activity
            </h2>
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No attendance records yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {history.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-slate-200 text-sm font-medium">
                      {item.date}
                    </p>

                    <p className="text-slate-500 text-xs mt-0.5">
                      {formatTime(item.check_in)} →{' '}
                      {formatTime(item.check_out)}
                    </p>
                    <p className="text-slate-500 text-xs">
  {item.working_hours} hrs
  •
  Late {item.late_minutes} min
</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'present'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'present'
                          ? 'bg-emerald-400'
                          : 'bg-red-400'
                      }`}
                    />

                    {item.status === 'present'
                      ? 'Present'
                      : 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}