import { Context } from 'hono'
import { db } from '../db/index.js'
import { attendance } from '../db/schema/attendance.js'
import { users } from '../db/schema/users.js'
import { eq, and, sql, desc } from 'drizzle-orm'

// CHECK IN
export const checkIn = async (
  c: Context
) => {
  try {
    const OFFICE_START_HOUR = 9

    const REQUIRED_HOURS = 8
    const user = c.get('user') as any

    const now = new Date().toISOString()

    // Current date
    const today = new Date()
      .toISOString()
      .substring(0, 10)

    // Current time
    const currentTime =
  new Date()

const officeStart =
  new Date()

officeStart.setHours(
  OFFICE_START_HOUR,
  0,
  0,
  0
)

let lateMinutes = 0

if (currentTime > officeStart) {
  lateMinutes = Math.floor(
    (
      currentTime.getTime()
      -
      officeStart.getTime()
    ) /
    (1000 * 60)
  )
}

    // Check already checked in
    const [existingAttendance] = await db
   .select()
   .from(attendance)
   .where(
    and(
      eq(attendance.userId, user.userId),
      eq(attendance.date, today)
    )
  )

    if (existingAttendance) {
      return c.json(
        {
          success: false,
          message:
            'Already checked in today'
        },
        400
      )
    }

    // Insert attendance
    const result = await db.insert(attendance).values({
       userId: user.userId,
       date: today,
       checkIn: now,
       status: 'present',
       lateMinutes
    })

    return c.json({
      success: true,
      message:
        'Check-in successful',
      attendanceId:
        result.lastInsertRowid
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

// CHECK OUT
export const checkOut = async (
  c: Context
) => {
  try {
    const user = c.get('user') as any

    const REQUIRED_HOURS = 8

    const today = new Date()
      .toISOString()
      .substring(0, 10)

    const now =
      new Date().toISOString()

    // Find attendance
    const [todayAttendance] = await db
  .select()
  .from(attendance)
  .where(
    and(
      eq(attendance.userId, user.userId),
      eq(attendance.date, today)
    )
  ) as any

    // No check-in
    if (!attendance) {
      return c.json(
        {
          success: false,
          message:
            'Check-in required first'
        },
        400
      )
    }

    // Already checked out
    if (attendance.checkOut) {
      return c.json(
        {
          success: false,
          message:
            'Already checked out'
        },
        400
      )
    }

    // Calculate working hours
    const checkInTime =
      new Date(
        todayAttendance.checkIn
      )

    const checkOutTime =
      new Date(now)

    const diffMs =
      checkOutTime.getTime()
      -
      checkInTime.getTime()

    const workingHours =
      Number(
        (
          diffMs /
          (1000 * 60 * 60)
        ).toFixed(2)
      )

    // Calculate overtime
    let overtimeHours = 0

    if (
      workingHours >
      REQUIRED_HOURS
    ) {
      overtimeHours =
        Number(
          (
            workingHours
            -
            REQUIRED_HOURS
          ).toFixed(2)
        )
    }

    // Update checkout
    await db
  .update(attendance)
  .set({
    checkOut: now,
    workingHours,
    overtimeHours
  })
  .where(eq(attendance.id, attendance.id))

    const updatedAttendance = await db
  .select()
  .from(attendance)
  .where(eq(attendance.id, attendance.id))
  .get() as any

    return c.json({
      success: true,
      message:
        'Check-out successful',
      attendance: updatedAttendance
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

// ATTENDANCE HISTORY
export const attendanceHistory =
  async (c: Context) => {
    try {
      const user = c.get(
        'user'
      ) as any

      const history = await db
      .select()
      .from(attendance)
      .where(eq(attendance.userId, user.userId))
      .orderBy(desc(attendance.date)) as any

      return c.json({
        success: true,
        history
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

// MANAGER TEAM ATTENDANCE
export const teamAttendance =
  async (c: Context) => {
    try {
      const user = c.get(
        'user'
      ) as any
      const today = new Date().toISOString().substring(0, 10)

      const teamAttendance = await db
  .select({
    id: users.id,
    name: users.name,
    email: users.email,
    checkIn: attendance.checkIn,
    checkOut: attendance.checkOut,
    status: sql<string>`
      CASE
        WHEN ${attendance.id} IS NULL THEN 'absent'
        ELSE ${attendance.status}
      END
    `
  })
  .from(users)
  .leftJoin(
    attendance,
    and(
      eq(attendance.userId, users.id),
      eq(attendance.date, today)
    )
  )
  .where(eq(users.managerId, user.userId))

      return c.json({
        success: true,
        teamAttendance
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

export const getTodayAttendance = async (c: any) => {
  try {
    const user = c.get('user')

    const today =
      new Date()
        .toISOString()
        .substring(0, 10)

   const [todayAttendance] = await db
  .select()
  .from(attendance)
  .where(
    and(
      eq(attendance.userId, user.userId),
      eq(attendance.date, today)
    )
  )

    return c.json({
      success: true,
      attendance: todayAttendance || null
    })
  } catch (error) {
    return c.json(
      {
        success: false,
        message: 'Internal server error'
      },
      500
    )
  }
}

export const getAttendanceStats =
  async (c: any) => {
    try {
      const user = c.get('user')

      const records = await db
  .select()
  .from(attendance)
  .where(eq(attendance.userId, user.userId)) as any[]

      // Calculate stats from the fetched records
      const present = records.filter(
        (r) => r.status === 'present'
      ).length

      const absent = records.filter(
        (r) => r.status === 'absent'
      ).length

      const total = records.length
      const attendancePercentage = total > 0
        ? Math.round((present / total) * 100)
        : 0

      // Calculate current consecutive streak of present days
      const sorted = [...records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      let streak = 0
      for (const record of sorted) {
        if (record.status === 'present') {
          streak++
        } else {
          break
        }
      }

      return c.json({
        success: true,
        stats: {
          attendancePercentage,
          presentDays: present,
          absentDays: absent,
          streak
        } 
      })
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'Internal server error'
        },
        500
      )
    }
  }