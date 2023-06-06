import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from 'types/database.types'

import { useDBProjectsQuery } from './useProjects'

export function useWalletBookmarkedProjects({
  wallet,
}: {
  wallet: string | undefined
}) {
  const [createdAtIds, setCreatedAtIds] = useState<{ [id: string]: number }>({})

  const supabase = useSupabaseClient<Database>()

  useEffect(() => {
    supabase
      .from('user_bookmarks')
      .select('*')
      .eq('wallet', wallet?.toLowerCase())
      .order('created_at', { ascending: false })
      .then(data =>
        setCreatedAtIds(
          data.data?.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.project]: new Date(curr.created_at).valueOf(),
            }),
            {},
          ) ?? {},
        ),
      )
  }, [supabase, wallet])

  const ids = Object.keys(createdAtIds ?? {})

  const { data: projects, isLoading } = useDBProjectsQuery(
    ids.length
      ? {
          ids,
          pageSize: 1000,
        }
      : null,
  )

  // Sort projects by timestamp of when they were saved
  return {
    projects: projects?.sort((a, b) =>
      createdAtIds[a.id] > createdAtIds[b.id] ? -1 : 1,
    ),
    isLoading,
  }
}
