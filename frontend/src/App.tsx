import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ManagerPage from './pages/ManagerPage'
import AdminPage from './pages/AdminPage'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/manager"
  element={
    <ProtectedRoute
      allowedRoles={['manager']}
    >
      <ManagerPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute
      allowedRoles={['super_admin']}
    >
      <AdminPage />
    </ProtectedRoute>
  }
/>



    </Routes>
  )
}

export default App