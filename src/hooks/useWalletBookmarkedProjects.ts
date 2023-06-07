import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DBProject } from 'models/dbProject'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { Database } from 'types/database.types'
import { parseDBProject } from 'utils/sgDbProjects'

export function useWalletBookmarkedProjects({
  wallet,
}: {
  wallet: string | undefined
}) {
  const supabase = useSupabaseClient<Database>()

  return useQuery(
    ['user-bookmarks', wallet],
    async (): Promise<DBProject[] | undefined> =>
      supabase
        .from('projects')
        .select('*, user_bookmarks!inner(created_at, users(wallet))')
        .eq('user_bookmarks.users.wallet', wallet)
        .order('created_at', {
          ascending: false,
          foreignTable: 'user_bookmarks',
        })
        .then(data => data.data?.map(p => parseDBProject(p))),
  )
}

export function useWalletBookmarkedIds({
  wallet,
}: {
  wallet: string | undefined
}) {
  const { data: bookmarkedProjects, isLoading } = useWalletBookmarkedProjects({
    wallet,
  })

  return {
    isLoading,
    ids: useMemo(
      () => new Set(bookmarkedProjects?.map(p => p.id)),
      [bookmarkedProjects],
    ),
  }
}
