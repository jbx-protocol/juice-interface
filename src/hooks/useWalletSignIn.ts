import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { AuthAPI } from 'lib/api/auth'
import { useCallback } from 'react'
import { Database } from 'types/database.types'
import { v4 } from 'uuid'
import { useWallet } from './Wallet'

export const useWalletSignIn = () => {
  const wallet = useWallet()
  const supabase = useSupabaseClient<Database>()

  const checkCurrentSessionUserIsCurrentWalletConnected = useCallback(
    async (session: Session) => {
      if (!wallet.userAddress) return false
      const { error, data } = await supabase
        .from('users')
        .select('wallet')
        .eq('id', session.user.id)
        .single()
      if (error) {
        console.error(error)
        return false
      }
      return data.wallet === wallet.userAddress.toLowerCase()
    },
    [supabase, wallet.userAddress],
  )

  return useCallback(async () => {
    if (wallet.chainUnsupported) {
      const walletChanged = await wallet.changeNetworks()
      if (!walletChanged) {
        console.error('Wallet did not change networks')
        throw new Error('Wallet did not change networks')
      }
    }

    if (!wallet.signer || !wallet.userAddress) {
      console.error('Wallet not connected')
      throw new Error('Wallet not connected')
    }

    const getSessionResult = await supabase.auth.getSession()
    if (
      getSessionResult.data.session &&
      (await checkCurrentSessionUserIsCurrentWalletConnected(
        getSessionResult.data.session,
      ))
    ) {
      return getSessionResult.data.session
    }

    const challengeMessage = await AuthAPI.getChallengeMessage({
      wallet: wallet.userAddress,
    })
    const signature = await wallet.signer.signMessage(challengeMessage)
    const accessToken = await AuthAPI.walletSignIn({
      wallet: wallet.userAddress,
      signature,
      message: challengeMessage,
    })
    const { error, data } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: v4(), // Set to garbage token, no long lived refresh tokens
    })
    if (error) {
      console.error(error)
      throw new Error(error.message)
    }
    if (!data.session) {
      console.error('No session returned')
      throw new Error('No session returned')
    }
    return data.session
  }, [checkCurrentSessionUserIsCurrentWalletConnected, supabase.auth, wallet])
}
