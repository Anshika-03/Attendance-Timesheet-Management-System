import { Hono } from 'hono'
import { authMiddleware } from '../middleware/authMiddleware.js'

const userRoutes = new Hono<{
  Variables: {
    user: any
  }
}>()

userRoutes.get('/profile', authMiddleware, async (c) => {
  const user = c.get('user')

  return c.json({
    success: true,
    message: 'Protected route accessed',
    user
  })
})

export default userRoutes