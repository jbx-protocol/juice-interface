import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useWallet } from 'hooks/Wallet'
import { useWalletSignIn } from 'hooks/WalletSignIn'
import { ProjectNotification } from 'models/notifications/projectNotifications'
import { useCallback, useEffect, useState } from 'react'
import { Database } from 'types/database.types'
import { emitErrorNotification } from 'utils/notifications'

/**
 * Hook to control the subscribe button.
 * @param projectId The ID of the project to subscribe to.

 * @returns The loading state, the subscribed state, and the subscribe function.
 * @example const { loading, isSubscribed, subscribe } = useSubscribeButton({ projectId: 1 })
 */
export const useSubscribeButton = ({ projectId }: { projectId: number }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

  const wallet = useWallet()
  const signIn = useWalletSignIn()
  const session = useSession()
  const supabase = useSupabaseClient<Database>()

  // If the user is not connected to a wallet, or the wallet is on an unsupported chain, don't show the button
  const showSubscribeButton = wallet.isConnected && !wallet.chainUnsupported

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

    try {
      const session = await signIn()
      // Set the user as subscribed to the project if they are not already
      const userId = session.user.id
      const notifications = await getUserNotificationsForProjectId({
        projectId,
        userId,
      })
      if (!notifications?.length) {
        const { error } = await supabase.from('user_subscriptions').insert([
          {
            user_id: session.user.id,
            project_id: projectId,
            notification_id: ProjectNotification.ProjectPaid,
          },
        ])
        if (error) throw error
        setIsSubscribed(true)
      } else {
        const { error } = await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', userId)
          .eq('project_id', projectId)
          .eq('notification_id', ProjectNotification.ProjectPaid)
        if (error) throw error
        setIsSubscribed(false)
      }
    } catch (e) {
      console.error('Error occurred while subscribing', e)
      emitErrorNotification('Error occurred while subscribing')
    }
  }, [
    getUserNotificationsForProjectId,
    projectId,
    signIn,
    supabase,
    wallet.isConnected,
  ])

  return {
    loading,
    isSubscribed,
    onSubscribeButtonClicked,
    showSubscribeButton,
  }
}
