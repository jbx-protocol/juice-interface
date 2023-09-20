import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useWallet } from 'hooks/Wallet'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { PV } from 'models/pv'
import { useCallback, useEffect, useState } from 'react'
import { Database } from 'types/database.types'
import { getSubgraphIdForProject } from 'utils/graph'
import { emitErrorNotification } from 'utils/notifications'

/**
 * Hook to control the bookmark button.
 * @param projectId The projectId of the project to bookmark.
 * @param pv The PV of the project to bookmark.

 * @returns The loading state, the bookmarked state, and the bookmark function.
 * @example const { loading, isBookmarked, bookmark } = useBookmarkButton({ project: '1-17' })
 */
export const useBookmarkButton = ({
  projectId,
  pv,
}: {
  projectId: number
  pv: PV
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  const wallet = useWallet()
  const signIn = useWalletSignIn()
  const session = useSession()
  const supabase = useSupabaseClient<Database>()

  const project = getSubgraphIdForProject(pv, projectId)

  const getIsBookmarked = useCallback(
    async ({ project, userId }: { project: string; userId: string }) => {
      const { error, count } = await supabase
        .from('user_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('project', project)

      if (error) {
        console.error(error)
        return
      }

      return !!count
    },
    [supabase],
  )

  const toggleBookmark = useCallback(async () => {
    // If the user is not connected to a wallet, don't do anything
    if (!wallet.userAddress) return

    const { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('wallet', wallet.userAddress)

    let _session = session

    if (!_session || !users?.[0]) {
      _session = await signIn()
    }

    try {
      // Set the project as bookmarked if it is not already
      const userId = _session.user.id
      const _isBookmarked = await getIsBookmarked({
        project,
        userId,
      })
      if (!_isBookmarked) {
        const { error } = await supabase.from('user_bookmarks').insert([
          {
            user_id: userId,
            project,
            created_at: new Date().toISOString(),
          },
        ])
        if (error) throw error
        setIsBookmarked(true)
      } else {
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('project', project)
        if (error) throw error
        setIsBookmarked(false)
      }
    } catch (e) {
      console.error(e)
      emitErrorNotification('Error saving project')
    }
  }, [getIsBookmarked, session, supabase, wallet.userAddress, signIn, project])

  // Check if the project is bookmarked
  useEffect(() => {
    if (!session?.user.id) return

    setLoading(true)

    const userId = session.user.id

    getIsBookmarked({ project, userId }).then(_isBookmarked => {
      if (_isBookmarked) setIsBookmarked(true)

      setLoading(false)
    })
  }, [getIsBookmarked, project, session?.user.id])

  const onBookmarkButtonClicked = useCallback(async () => {
    // If the user is not connected to a wallet, don't do anything
    if (!wallet.isConnected) return

    setLoading(true)

    try {
      await toggleBookmark()
    } catch (e) {
      console.error('Error occurred while saving project', e)
      emitErrorNotification('Error occurred while saving project')
    } finally {
      setLoading(false)
    }
  }, [toggleBookmark, wallet.isConnected])

  return {
    loading,
    isBookmarked,
    onBookmarkButtonClicked,
  }
}
