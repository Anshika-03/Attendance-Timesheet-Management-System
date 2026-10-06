import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import attendanceRoutes from './routes/attendance.js'
import managerRoutes from './routes/managerRoutes.js'
import { cors } from 'hono/cors'

const app = new Hono()
app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.route('/api/manager', managerRoutes)
app.route('/api/auth', authRoutes)
app.route('/api/user', userRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/attendance', attendanceRoutes)

app.get('/', (c) => {
  return c.json({
    message: 'Attendance API Running'
  })
})

const port = 3000

serve({
  fetch: app.fetch,
  port
})

console.log(`Server running on http://localhost:${port}`)