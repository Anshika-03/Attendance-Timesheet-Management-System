import { Hono } from 'hono'

import {
  authMiddleware
} from '../middleware/authMiddleware.js'

import {
  roleMiddleware
} from '../middleware/roleMiddleware.js'

import {
  adminDashboard,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/adminController.js'

const adminRoutes = new Hono()

// Admin Dashboard
adminRoutes.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware([
    'super_admin'
  ]),
  adminDashboard
)

// Get All Users
adminRoutes.get(
  '/users',
  authMiddleware,
  roleMiddleware([
    'super_admin'
  ]),
  getAllUsers
)

// Create User
adminRoutes.post(
  '/create-user',
  authMiddleware,
  roleMiddleware([
    'super_admin'
  ]),
  createUser
)

adminRoutes.put(
  '/users/:id',
  authMiddleware,
  roleMiddleware(['super_admin']),
  updateUser
)

adminRoutes.delete(
  '/users/:id',
  authMiddleware,
  roleMiddleware(['super_admin']),
  deleteUser
)

export default adminRoutes