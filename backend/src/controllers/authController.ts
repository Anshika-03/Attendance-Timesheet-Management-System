import { Context } from 'hono'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {db} from '../db/index.js'
import {users} from '../db/schema/users.js'
import {eq, desc, sql} from 'drizzle-orm'
import { attendance } from '../db/schema/attendance.js'

// REGISTER
export const register = async (
  c: Context
) => {
  try {
    const body = await c.req.json()

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
      !password
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

    // Check existing user
    const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get() as any

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

    // Force public registration
    // to team_member
    const finalRole =
      role === 'team_member'
        ? 'team_member'
        : 'team_member'

    // Insert user
    const result = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      managerId: manager_id || null
    }) as any

    return c.json({
      success: true,
      message:
        'User registered successfully',
      userId: result.lastInsertRowid
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

// LOGIN
export const login = async (
  c: Context
) => {
  try {
    const body = await c.req.json()

    const { email, password } =
      body

    // Validation
    if (!email || !password) {
      return c.json(
        {
          success: false,
          message:
            'Email and password required'
        },
        400
      )
    }

    // Find user
    const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get() as any


    if (!user) {
      return c.json(
        {
          success: false,
          message:
            'Invalid credentials'
        },
        401
      )
    }

    // Compare password
    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!isPasswordValid) {
      return c.json(
        {
          success: false,
          message:
            'Invalid credentials'
        },
        401
      )
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d'
      }
    )

    return c.json({
      success: true,
      message:
        'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
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