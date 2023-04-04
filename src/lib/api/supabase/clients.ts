import { createClient } from '@supabase/supabase-js'
import { Database } from 'types/database.types'

export const sudoPublicDbClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: 'public' } },
)

export const juiceAuthDbClient = createClient<Database, 'juice_auth'>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: 'juice_auth' } },
)

export const dbProjects = sudoPublicDbClient.from('projects')
