import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { ProjectSubscription } from 'models/database'
import { useCallback, useEffect, useState } from 'react'
import { Database } from 'types/database.types'

export const useUserSubscriptions = () => {
  const session = useSession()
  const supabase = useSupabaseClient<Database>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<
    Pick<ProjectSubscription, 'project_id' | 'notification_id'>[]
  >([])

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    if (!session) {
      setLoading(false)
      setError('Not signed in')
      return
    }
    const { data, error } = await supabase

      .from('user_subscriptions')
      .select('project_id,notification_id')
      .eq('user_id', session.user.id)

    if (error) {
      setError(error.message)
    } else {
      setNotifications(data ?? [])
    }

    setLoading(false)
  }, [session, supabase])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return { loading, error, notifications, refetch: fetchNotifications }
}
