import {db} from '../db/index.js'
import {users} from '../db/schema/users.js'
import {attendance} from '../db/schema/attendance.js'
import {eq, desc} from 'drizzle-orm'

export const getTeamAttendance =
  async (c: any) => {
    try {
      const user = c.get('user')

      const today =
        new Date()
          .toISOString()
          .split('T')[0]

      const team = await db.select({
        id: users.id,
        name: users.name,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status
      })
      .from(users)
      .leftJoin(attendance, eq(attendance.userId, users.id))
      .where(eq(users.managerId, user.userId))
      .orderBy(desc(attendance.createdAt))
      .all() as any
    
      

      return c.json({
        success: true,
        team
      })

    } catch (error) {

      console.error(error)

      return c.json(
        {
          success:false,
          message:
            'Internal server error'
        },
        500
      )
    }
}