import { createMiddleware } from 'hono/factory'
import jwt from 'jsonwebtoken'

export const authMiddleware = createMiddleware(
  async (c, next) => {
    try {
      // Read Authorization header
      const authHeader = c.req.header('Authorization')

      // Check token exists
      if (!authHeader) {
        return c.json(
          {
            success: false,
            message: 'Authorization token required'
          },
          401
        )
      }

    // Extract token
const token = authHeader.split(' ')[1]

if (!token) {
  return c.json(
    {
      success: false,
      message: 'Token is missing or invalid'
    },
    401
  )
}

// Verify token
const decoded = jwt.verify(
  token, // TypeScript now knows this is definitely a string
  process.env.JWT_SECRET as string
) as any


      // Store user in context
      c.set('user', decoded)

      // Continue to next middleware/route
      await next()
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'Invalid or expired token'
        },
        401
      )
    }
  }
)