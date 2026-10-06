import { Hono } from 'hono'

import {
  checkIn,
  checkOut,
  getTodayAttendance,
  attendanceHistory,
  getAttendanceStats,
  teamAttendance
} from '../controllers/attendanceController.js'

import {
  authMiddleware
} from '../middleware/authMiddleware.js'

import {
  roleMiddleware
} from '../middleware/roleMiddleware.js'

const attendanceRoutes =
  new Hono()

// Check In
attendanceRoutes.post(
  '/check-in',
  authMiddleware,
  roleMiddleware([
    'team_member'
  ]),
  checkIn
)

// Check Out
attendanceRoutes.post(
  '/check-out',
  authMiddleware,
  roleMiddleware([
    'team_member'
  ]),
  checkOut
)

// Manager Team Attendance
attendanceRoutes.get(
  '/team',
  authMiddleware,
  roleMiddleware([
    'manager'
  ]),
  teamAttendance
)

attendanceRoutes.get(
  '/today',
  authMiddleware,
  roleMiddleware(['team_member']),
  getTodayAttendance
)
attendanceRoutes.get(
  '/history',
  authMiddleware,
  roleMiddleware(['team_member']),
  attendanceHistory
)
attendanceRoutes.get(
  '/stats',
  authMiddleware,
  roleMiddleware(['team_member']),
  getAttendanceStats
)

export default attendanceRoutes