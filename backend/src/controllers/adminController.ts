import { Context } from 'hono'

import bcrypt from 'bcryptjs'
import {db} from '../db/index.js'
import {attendance} from '../db/schema/attendance.js'
import {users} from '../db/schema/users.js'
import {eq, and, desc, sql} from 'drizzle-orm'

// ADMIN DASHBOARD
export const adminDashboard =
  async (c: Context) => {
    return c.json({
      success: true,
      message:
        'Welcome Super Admin'
    })
  }

// GET ALL USERS
export const getAllUsers =
  async (c: Context) => {
    try {
      const allUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))

      return c.json({
        success: true,
        users: allUsers
      })
    } catch (error) {
      console.error(error)

      return c.json(
        {
          success: false,
          message:
            'Internal server error'
        },
        500
      )
    }
  }

// CREATE USER
export const createUser =
  async (c: Context) => {
    try {
      const body =
        await c.req.json()

      const {
        name,
        email,
        password,
        role,
        manager_id
      } = body

      // Validation
      if (
        !name ||
        !email ||
        !password ||
        !role
      ) {
        return c.json(
          {
            success: false,
            message:
              'All fields are required'
          },
          400
        )
      }

      // Check existing email
      const [existingUser] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))

      if (existingUser) {
        return c.json(
          {
            success: false,
            message:
              'Email already exists'
          },
          400
        )
      }

      // Hash password
      const hashedPassword =
        await bcrypt.hash(password, 10)

      // Insert user
      await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        role,
        managerId: manager_id ?? null
      })

      return c.json({
        success: true,
        message:
          'User created successfully'
      })
    } catch (error) {
      console.error(error)

      return c.json(
        {
          success: false,
          message:
            'Internal server error'
        },
        500
      )
    }
  }

  // Update User API
  export const updateUser =
  async (c: any) => {
    try {
      const id = c.req.param('id')

      const body =
        await c.req.json()

      const {
        name,
        role,
        manager_id,
        password
      } = body

      // Check user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(id)))

      if (!existingUser) {
        return c.json(
          {
            success: false,
            message:
              'User not found'
          },
          404
        )
      }
      // Update user (with optional password)
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.update(users)
        .set({
          name,
          role,
          managerId: manager_id ?? null,
          password: hashedPassword
        })
        .where(eq(users.id, Number(id)))
      } else {

      // Update user
      await db.update(users)
      .set({
        name,
        role,
        managerId: manager_id ?? null
      })
      .where(eq(users.id, Number(id)))
    }

      return c.json({
        success: true,
        message:
          'User updated successfully'
      })
    } catch (error) {
      console.error(error)

      return c.json(
        {
          success: false,
          message:
            'Internal server error'
        },
        500
      )
    }
  }

  // Delete User API
  export const deleteUser =
  async (c: any) => {
    try {
      const id = c.req.param('id')

      // Check user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(id)))

      if (!existingUser) {
        return c.json(
          {
            success: false,
            message:
              'User not found'
          },
          404
        )
      }

      // Delete user and its dependencies atomically within a transaction
      const userId = Number(id)

await db.transaction(async (tx) => {
  await tx
    .update(users)
    .set({ managerId: null })
    .where(eq(users.managerId, userId))

  await tx
    .delete(attendance)
    .where(eq(attendance.userId, userId))

  await tx
    .delete(users)
    .where(eq(users.id, userId))
})

      return c.json({
        success: true,
        message:
          'User deleted successfully'
      })
    } catch (error) {
      console.error(error)

      return c.json(
        {
          success: false,
          message:
            'Internal server error'
        },
        500
      )
    }
  }