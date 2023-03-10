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
const QWESTIVE_REFERRAL_PROJECT_ID = '7VveXIwMqTmecXhkjkUD'
const QWESTIVE_REFERRAL_API_KEY = 'EsJ/IytawhhutlB+2A4LNFxVBuSYXdU2ruG6RjTCxe8='

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
        setTrackerQwestiveMethods({ ...apiMethods, isLoading: false })
      } catch (e) {
        console.error(
          'Error occurred while loading QwestiveTracker API methods',
        )
        setTrackerQwestiveMethods({ isLoading: false })
      }
    }
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
        setEmbedUIQwestiveMethods({ ...apiMethods, isLoading: false })
      } catch (e) {
        console.error(
          'Error occurred while loading QwestiveEmbedUI API methods',
        )
        setEmbedUIQwestiveMethods({ isLoading: false })
      }
    }
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
