import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

type Props = {
  children: React.ReactNode
  allowedRoles?: string[]
}

function ProtectedRoute({
  children,
  allowedRoles
}: Props) {
  const auth = useAuth()

  // Wait until auth restore finishes
  if (auth.loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    )
  }

  // Not logged in
  if (!auth.token) {
    return <Navigate to="/login" />
  }

  // Role check
  if (
    allowedRoles &&
    auth.user &&
    !allowedRoles.includes(auth.user.role)
  ) {
    return (
      <div className="p-10 text-red-500">
        Access Denied
      </div>
    )
  }

  return children
}

export default ProtectedRoute