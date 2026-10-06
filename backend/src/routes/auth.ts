import { Hono } from 'hono'

import {
  register,
  login
} from '../controllers/authController.js'

const authRoutes = new Hono()

// Register
authRoutes.post(
  '/register',
  register
)

// Login
authRoutes.post(
  '/login',
  login
)

export default authRoutes