import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { AuthAPI } from 'lib/api/auth'
import { useCallback } from 'react'
import { Database } from 'types/database.types'
import { v4 } from 'uuid'
import { useJBWallet } from './Wallet/useJBWallet'

export const useWalletSignIn = () => {
  const { eoa, keyp, userAddress } = useJBWallet()
  const supabase = useSupabaseClient<Database>()

  const checkCurrentSessionUserIsCurrentWalletConnected = useCallback(
    async (session: Session) => {
      if (!userAddress) return false
      const { error, data } = await supabase
        .from('users')
        .select('wallet')
        .eq('id', session.user.id)
        .single()
      if (error) {
        console.error(error)
        return false
      }
      return data.wallet === userAddress.toLowerCase()
    },
    [supabase, userAddress],
  )

  return useCallback(async () => {
    if (eoa.chainUnsupported) {
      const walletChanged = await eoa.changeNetworks()
      if (!walletChanged) {
        console.error('Wallet did not change networks')
        throw new Error('Wallet did not change networks')
      }
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

    let accessToken: string | undefined = undefined

    // Connected wallet is EOA
    if (eoa.signer && eoa.userAddress) {
      const challengeMessage = await AuthAPI.getChallengeMessage({
        wallet: eoa.userAddress,
      })
      const signature = await eoa.signer.signMessage(challengeMessage)
      accessToken = await AuthAPI.walletSignIn({
        wallet: eoa.userAddress,
        signature,
        message: challengeMessage,
      })
    } else if (keyp.address) {
      accessToken = await AuthAPI.keypWalletSignIn({ wallet: keyp.address })
    } else {
      console.error('Wallet not connected')
      throw new Error('Wallet not connected')
    }

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
  }, [
    checkCurrentSessionUserIsCurrentWalletConnected,
    supabase.auth,
    eoa,
    keyp,
  ])
}
