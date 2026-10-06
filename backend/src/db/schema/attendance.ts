import {
  sqliteTable,
  integer,
  text,
  real
} from 'drizzle-orm/sqlite-core'

export const attendance =
  sqliteTable(
    'attendance',
    {
      id: integer('id')
        .primaryKey({
          autoIncrement: true
        }),

      userId:
        integer('user_id')
          .notNull(),

      date:
        text('date')
          .notNull(),

      checkIn:
        text('check_in'),

      checkOut:
        text('check_out'),

      status:
        text('status')
          .default('present'),

      workingHours:
        real('working_hours')
          .default(0),

      overtimeHours:
        real('overtime_hours')
          .default(0),

      lateMinutes:
        integer('late_minutes')
          .default(0),

      createdAt:
        text('created_at')
    }
  )