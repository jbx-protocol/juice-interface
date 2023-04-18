import { Database } from 'types/database.types'

export type User = Database['public']['Tables']['users']['Row']
export type Profile = Database['public']['Views']['user_profiles']['Row']
export type ProjectSubscription =
  Database['public']['Tables']['user_subscriptions']['Row']
export type Contributor = Database['public']['Tables']['contributors']['Row']
