import QwestiveClientSDK from 'qwestive-client-sdk'
import { useEffect, useState } from 'react'
import { TQwestiveTracker } from './QwestiveReferralContext'

// Juicebox-referral campaign: https://juicebox.referral.qwestive.io/referral/hJCUZVJIodVP6Ki6MP6e
const QWESTIVE_REFERRAL_PROJECT_ID =
  process.env.NEXT_PUBLIC_QWESTIVE_REFERRAL_PROJECT_ID
const QWESTIVE_REFERRAL_API_KEY =
  process.env.NEXT_PUBLIC_QWESTIVE_REFERRAL_API_KEY

export function useQwestiveSDKProvider() {
  const [trackerQwestiveMethods, setTrackerQwestiveMethods] =
    useState<TQwestiveTracker>({
      isLoading: true,
    })

  useEffect(() => {
    async function initializeClientSDK() {
      if (!QWESTIVE_REFERRAL_PROJECT_ID || !QWESTIVE_REFERRAL_API_KEY) {
        console.warn('Qwestive referral project id or api key is not defined')
        return
      }
      try {
        const qwestiveClient = new QwestiveClientSDK(
          QWESTIVE_REFERRAL_PROJECT_ID,
          QWESTIVE_REFERRAL_API_KEY,
        )
        await qwestiveClient.init()
        // await qwestiveClient.setReferral({
        //   publicKey: '0x611bf350de61a45180f98276585b5f48fa8f7aea',
        // })
        setTrackerQwestiveMethods({
          setReferral: qwestiveClient.setReferral.bind(qwestiveClient),
          isLoading: false,
        })
      } catch (err) {
        console.error('Error occured while initializing qwestive client')
        setTrackerQwestiveMethods({ isLoading: false })
      }
    }

    initializeClientSDK()
  }, [])

  return {
    qwestiveTracker: {
      isLoading: trackerQwestiveMethods?.isLoading,
      setReferral: trackerQwestiveMethods?.setReferral,
    },
  }
}
