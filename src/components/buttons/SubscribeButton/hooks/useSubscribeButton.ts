import {
  Session,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react'
import { ModalContext } from 'contexts/Modal'
import { useWallet } from 'hooks/Wallet'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { ProjectNotification } from 'models/notifications/projectNotifications'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Database } from 'types/database.types'
import { emitErrorNotification } from 'utils/notifications'

/**
 * Hook to control the subscribe button.
 * @param projectId The ID of the project to subscribe to.

 * @returns The loading state, the subscribed state, and the subscribe function.
 * @example const { loading, isSubscribed, subscribe } = useSubscribeButton({ projectId: 1 })
 */
export const useSubscribeButton = ({ projectId }: { projectId: number }) => {
  const subscribeModal = useContext(ModalContext)
  const [loading, setLoading] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

  const wallet = useWallet()
  const signIn = useWalletSignIn()
  const session = useSession()
  const supabase = useSupabaseClient<Database>()

  const getUserNotificationsForProjectId = useCallback(
    async ({ projectId, userId }: { projectId: number; userId: string }) => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('notification_id')
        .eq('user_id', userId)
        .eq('project_id', projectId)
      if (error) {
        console.error(error)
        return
      }
      return (
        data
          .map(notification => notification.notification_id)
          // Convert notifications to `ProjectNotification` enum
          .map(
            notification =>
              ProjectNotification[
                notification as keyof typeof ProjectNotification
              ],
          )
      )
    },
    [supabase],
  )

  const toggleSubscription = useCallback(
    async (s?: Session) => {
      // If the user is not connected to a wallet, don't do anything
      if (!wallet.isConnected) return
      const _session = s ?? session
      if (!_session) return

      try {
        // Set the user as subscribed to the project if they are not already
        const userId = _session.user.id
        const notifications = await getUserNotificationsForProjectId({
          projectId,
          userId,
        })
        if (!notifications?.length) {
          const subscriptions = generateUserSubscriptions(userId, projectId)
          const { error } = await supabase
            .from('user_subscriptions')
            .insert(subscriptions)
          if (error) throw error
          setIsSubscribed(true)
        } else {
          const { error } = await supabase
            .from('user_subscriptions')
            .delete()
            .eq('user_id', userId)
            .eq('project_id', projectId)
            .or(
              'notification_id.eq.project_paid,notification_id.eq.payouts_distributed',
            )
          if (error) throw error
          setIsSubscribed(false)
        }
      } catch (e) {
        console.error(e)
        emitErrorNotification('Error subscribing to project')
      }
    },
    [
      getUserNotificationsForProjectId,
      projectId,
      session,
      supabase,
      wallet.isConnected,
    ],
  )

  // Check if the user is subscribed to the project
  useEffect(() => {
    if (!session?.user.id) return
    setLoading(true)
    const userId = session.user.id
    getUserNotificationsForProjectId({ projectId, userId }).then(
      notifications => {
        if (!notifications) {
          setLoading(false)
          return
        }

        // TODO: This is temporary, just for MVP. we will fine grain this later
        if (notifications.length > 0) {
          setIsSubscribed(true)
        }

        setLoading(false)
      },
    )
  }, [getUserNotificationsForProjectId, projectId, session?.user.id, supabase])

  const onSubscribeButtonClicked = useCallback(async () => {
    // If the user is not connected to a wallet, don't do anything
    if (!wallet.isConnected) return
    setLoading(true)

    try {
      const session = await signIn()
      // Check user has a email address
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('id', session.user.id)
        .single()
      if (error) {
        throw new Error(error.message)
      }
      if (!data?.email) {
        subscribeModal.openModal()
        setLoading(false)
        return
      }

      await toggleSubscription()
    } catch (e) {
      console.error('Error occurred while subscribing', e)
      emitErrorNotification('Error occurred while subscribing')
    } finally {
      setLoading(false)
    }
  }, [signIn, subscribeModal, supabase, toggleSubscription, wallet.isConnected])

  return {
    loading,
    isSubscribed,
    onSubscribeButtonClicked,
  }
}

const generateUserSubscriptions = (userId: string, projectId: number) => {
  const base = {
    user_id: userId,
    project_id: projectId,
  }
  return [
    ProjectNotification.ProjectPaid,
    ProjectNotification.PayoutsDistributed,
  ].map(notification_id => ({
    ...base,
    notification_id,
  }))
}
