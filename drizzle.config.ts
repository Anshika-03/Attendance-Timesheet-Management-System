import type { Config }
from 'drizzle-kit'

export default {
  schema:
    'backend/src/db/schema/*',

  out:
    './drizzle',

  dialect:
    'sqlite',

  dbCredentials: {
    url: './attendance.db'
  }
} satisfies Config