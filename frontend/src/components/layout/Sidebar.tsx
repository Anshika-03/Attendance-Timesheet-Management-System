import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Clock3,
  Users,
  CalendarDays,
  BarChart3,
  Settings
} from 'lucide-react'

type MenuItem = {
  label: string
  path: string
  icon: React.ElementType
}

const adminItems: MenuItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
]

const managerItems: MenuItem[] = [
  { label: 'Dashboard', path: '/manager', icon: LayoutDashboard },
  { label: 'Attendance', path: '/attendance', icon: Clock3 },
  { label: 'Leaves', path: '/leaves', icon: CalendarDays },
]

const teamMemberItems: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Attendance', path: '/attendance', icon: Clock3 },
  { label: 'My Leaves', path: '/leaves', icon: CalendarDays },
]

export default function Sidebar() {
  const auth = useAuth()
  const location = useLocation()
  const role = auth.user?.role

  let menuItems: MenuItem[] = teamMemberItems
  if (role === 'super_admin') {
    menuItems = adminItems
  } else if (role === 'manager') {
    menuItems = managerItems
  }

  return (
    <div
      className="
      w-64
      h-screen
      bg-slate-950
      text-white
      fixed
      left-0
      top-0
      border-r
      border-slate-800
      flex
      flex-col
    "
    >
      {/* Branding */}
      <div className="p-6 border-b border-slate-800">
        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-gradient-to-br
            from-violet-600
            to-cyan-500
            flex
            items-center
            justify-center
            font-bold
            text-lg
          "
        >
          A
        </div>
        <h1 className="mt-3 text-lg font-bold leading-tight">
          Attendance OS
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Workforce Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-xl
                transition
                text-sm
                font-medium
                ${isActive
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-600">
        © 2026 Attendance OS
      </div>
    </div>
  )
}
