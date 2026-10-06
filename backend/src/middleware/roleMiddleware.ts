import { createMiddleware } from 'hono/factory'

export const roleMiddleware = (allowedRoles: string[]) => {
  return createMiddleware(async (c, next) => {
    // Get logged-in user from auth middleware
    const user = c.get('user')

    // Check user exists
    if (!user) {
      return c.json(
        {
          success: false,
          message: 'User not authenticated'
        },
        401
      )
    }

    // Check role allowed
    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          success: false,
          message: 'Access denied'
        },
        403
      )
    }

    // Continue request
    await next()
  })
}