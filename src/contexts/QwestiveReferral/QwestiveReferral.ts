/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import {
  TInitSDK,
  TQwestiveEmbedUI,
  TQwestiveTracker,
} from './QwestiveReferralContext'

declare global {
  interface Window {
    QwestiveTracker: {
      init: ({
        apiKey,
        projectId,
      }: TInitSDK) => Omit<TQwestiveTracker, 'isLoading'>
      loadQwestiveTracker: (callback: () => void) => void
    }
    EmbedUI: {
      init: ({
        apiKey,
        projectId,
      }: TInitSDK) => Omit<TQwestiveEmbedUI, 'isLoading'>
      loadEmbedUI: (callback: () => void) => void
    }
  }
}

// MVP Test campaign
const QWESTIVE_REFERRAL_PROJECT_ID = 'ma6zYcqmv0hInMskIQf1'
const QWESTIVE_REFERRAL_API_KEY = 'xgXZwdZMAAY71tcLAdexo2VM091EitpEL1ScpoP/Z4A='

export function useQwestiveSDK() {
  const [trackerQwestiveMethods, setTrackerQwestiveMethods] =
    useState<TQwestiveTracker>({
      isLoading: true,
    })
  const [embedUIQwestiveMethods, setEmbedUIQwestiveMethods] =
    useState<TQwestiveEmbedUI>({
      isLoading: true,
    })

  useEffect(() => {
    const loadTrackerMethods = () => {
      try {
        const apiMethods = window?.QwestiveTracker?.init({
          apiKey: QWESTIVE_REFERRAL_API_KEY,
          projectId: QWESTIVE_REFERRAL_PROJECT_ID,
        })
        console.debug('QwestiveTracker', { apiMethods })
        setTrackerQwestiveMethods({ ...apiMethods, isLoading: false })
      } catch (e) {
        console.error(
          'Error occurred while loading QwestiveTracker API methods',
        )
        setTrackerQwestiveMethods({ isLoading: false })
      }
    }
    console.debug(window?.QwestiveTracker)
    window?.QwestiveTracker?.loadQwestiveTracker(() => {
      loadTrackerMethods()
    })
  }, [])

  useEffect(() => {
    const loadEmbedUIMethods = () => {
      try {
        const apiMethods = window?.EmbedUI?.init({
          apiKey: QWESTIVE_REFERRAL_API_KEY,
          projectId: QWESTIVE_REFERRAL_PROJECT_ID,
        })
        console.debug('EmbedUI', { apiMethods })
        setEmbedUIQwestiveMethods({ ...apiMethods, isLoading: false })
      } catch (e) {
        console.error(
          'Error occurred while loading QwestiveEmbedUI API methods',
        )
        setEmbedUIQwestiveMethods({ isLoading: false })
      }
    }
    console.debug(window?.EmbedUI)
    window?.EmbedUI?.loadEmbedUI(() => {
      loadEmbedUIMethods()
    })
  }, [])

  return {
    qwestiveTracker: {
      isLoading: trackerQwestiveMethods?.isLoading,
      setAlias: ({ id }: { id: string }) =>
        trackerQwestiveMethods?.setAlias?.({ id }),
      setReferral: ({ id }: { id: string }) =>
        trackerQwestiveMethods?.setReferral?.({ id }),
    },
    qwestiveEmbedUI: {
      isLoading: embedUIQwestiveMethods?.isLoading,
      setAlias: ({ publicKey }: { publicKey: string }) =>
        embedUIQwestiveMethods?.setAlias?.({ publicKey }),
      openPopup: embedUIQwestiveMethods?.openPopup,
      closePopup: embedUIQwestiveMethods?.closePopup,
      logout: embedUIQwestiveMethods?.logout,
    },
  }
}
