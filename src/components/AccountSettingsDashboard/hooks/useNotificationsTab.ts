import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useModal } from 'hooks/useModal'
import { useUserSubscriptions } from 'hooks/useUserSubscriptions'
import { useCallback } from 'react'
import { Database } from 'types/database.types'
import { emitErrorNotification } from 'utils/notifications'

export const useNotificationsTab = () => {
  const confirmationModal = useModal()
  const session = useSession()
  const supabase = useSupabaseClient<Database>()

  const subscriptions = useUserSubscriptions()

  const onModalConfirmationClicked = useCallback(async () => {
    if (!session) {
      emitErrorNotification('You must be logged in to do that.')
      confirmationModal.close()
      return
    }

    const { error } = await supabase
      .from('user_subscriptions')
      .delete()
      .eq('user_id', session.user.id)
    if (error) {
      console.error(error)
      emitErrorNotification('An error occurred while unwatching all.')
      confirmationModal.close()
      return
    }
    subscriptions.refetch()
    confirmationModal.close()
  }, [confirmationModal, session, subscriptions, supabase])

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
    confirmationModal,
    subscriptions,
    onModalConfirmationClicked,
    onUnwatchClicked,
  }
}
