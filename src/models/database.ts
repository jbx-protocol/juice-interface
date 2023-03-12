import { Database } from 'types/database.types'

export type User = Database['public']['Tables']['users']['Row']
export type Profile = Database['public']['Views']['user_profiles']['Row']
