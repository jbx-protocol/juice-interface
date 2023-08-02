import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useCallback, useEffect } from 'react'
import { Database } from 'types/database.types'
import { useAsyncDataReducer } from './useAsyncReducer'

export const useFetchDeveloperWallets = () => {
  const supabase = useSupabaseClient<Database>()

  const fetchDeveloperWallets = useCallback(
    async () =>
      supabase
        .from('developer_wallets')
        .select('*')
        .then(({ data, error }) => {
          if (error) {
            console.error(error)
            throw error
          }
          return data.map(wallet => ({
            createdAt: wallet.created_at,
            wallet: wallet.wallet,
          }))
        }),
    [supabase],
  )
  const [state, dispatch] = useAsyncDataReducer(fetchDeveloperWallets, [])

  useEffect(() => {
    dispatch()
  }, [dispatch])

  return {
    ...state,
    fetch: dispatch,
  }
}
