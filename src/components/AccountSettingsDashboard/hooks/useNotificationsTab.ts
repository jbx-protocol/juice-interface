import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useUserSubscriptions } from 'hooks/useUserSubscriptions'
import { useCallback } from 'react'
import { Database } from 'types/database.types'
import { emitErrorNotification } from 'utils/notifications'

export const useNotificationsTab = () => {
  const session = useSession()
  const supabase = useSupabaseClient<Database>()

  const subscriptions = useUserSubscriptions()

  const onUnwatchAllClicked = useCallback(async () => {
    if (!session) {
      emitErrorNotification('You must be logged in to do that.')
      return
    }

    const { error } = await supabase
      .from('user_subscriptions')
      .delete()
      .eq('user_id', session.user.id)
    if (error) {
      console.error(error)
      emitErrorNotification('An error occurred while unwatching all.')
      return
    }
    subscriptions.refetch()
  }, [session, subscriptions, supabase])

  const onUnwatchClicked = useCallback(
    async ({ projectId }: { projectId: number }) => {
      if (!session) {
        emitErrorNotification('You must be logged in to do that.')
        return
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .delete()
        .eq('user_id', session.user.id)
        .eq('project_id', projectId)
      if (error) {
        console.error(error)
        emitErrorNotification('An error occurred while unwatching all.')
        return
      }
      subscriptions.refetch()
    },
    [session, subscriptions, supabase],
  )

  return {
    subscriptions,
    onUnwatchAllClicked,
    onUnwatchClicked,
  }
}
