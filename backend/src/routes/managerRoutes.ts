import { Hono } from 'hono'

import {
  authMiddleware
} from '../middleware/authMiddleware.js'

import {
  roleMiddleware
} from '../middleware/roleMiddleware.js'

import {
  getTeamAttendance
} from '../controllers/managerController.js'

const managerRoutes =
  new Hono()

managerRoutes.get(
  '/team-attendance',

  authMiddleware,

  roleMiddleware([
    'manager'
  ]),

  getTeamAttendance
)

export default managerRoutes