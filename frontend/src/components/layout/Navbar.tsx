import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const auth = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    auth.logout()
    navigate('/login')
  }

  return (
    <div
      className="
      h-16
      bg-slate-900
      border-b
      border-slate-800
      flex
      items-center
      justify-between
      px-8
    "
    >
      <h2 className="text-white text-lg font-semibold">
        Good Morning, {auth.user?.name} 👋
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-medium capitalize">
          {auth.user?.role?.replace('_', ' ')}
        </span>

        <button
          onClick={handleLogout}
          className="
            bg-red-500
            hover:bg-red-600
            px-4
            py-2
            rounded-xl
            text-white
            text-sm
            font-medium
            transition
            cursor-pointer
          "
        >
          Logout
        </button>
      </div>
    </div>
  )
}
