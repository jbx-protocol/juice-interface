import QwestiveClientSDK from 'qwestive-client-sdk'
import { useEffect, useState } from 'react'
import { TQwestiveTracker } from './QwestiveReferralContext'

// Juicebox-referral campaign: https://juicebox.referral.qwestive.io/referral/hJCUZVJIodVP6Ki6MP6e
const QWESTIVE_REFERRAL_PROJECT_ID = 'ma6zYcqmv0hInMskIQf1'
const QWESTIVE_REFERRAL_API_KEY = 'xgXZwdZMAAY71tcLAdexo2VM091EitpEL1ScpoP/Z4A='

export function useQwestiveSDKProvider() {
  const [trackerQwestiveMethods, setTrackerQwestiveMethods] =
    useState<TQwestiveTracker>({
      isLoading: true,
    })

  useEffect(() => {
    async function initializeClientSDK() {
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
