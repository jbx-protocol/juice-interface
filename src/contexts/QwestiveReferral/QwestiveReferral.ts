import { useContext, useEffect, useState } from 'react'
import {
  IQwestiveContext,
  SDKContext,
  TInitSDK,
  TQwestiveEmbedUI,
  TQwestiveTracker,
} from './QwestiveReferralContext'

/**
 * Methods added on the window object by src/components/common/Head/scripts/QwestiveScripts.tsx
 */
declare global {
  interface Window {
    QwestiveTracker: {
      init: ({
        apiKey,
        projectId,
      }: TInitSDK) => Omit<TQwestiveTracker, 'isLoading'>
      loadQwestiveTracker: (callback: () => void) => void
      isInitialized: boolean
    }
    EmbedUI: {
      init: ({
        apiKey,
        projectId,
      }: TInitSDK) => Omit<TQwestiveEmbedUI, 'isLoading'>
      loadEmbedUI: (callback: () => void) => void
      isInitialized: boolean
    }
  }
}

// Juicebox-referral campaign: https://juicebox.referral.qwestive.io/referral/hJCUZVJIodVP6Ki6MP6e
const QWESTIVE_REFERRAL_PROJECT_ID = 'ma6zYcqmv0hInMskIQf1'
const QWESTIVE_REFERRAL_API_KEY = 'xgXZwdZMAAY71tcLAdexo2VM091EitpEL1ScpoP/Z4A='

export function useQwestiveSDKProvider() {
  const [trackerQwestiveMethods, setTrackerQwestiveMethods] =
    useState<TQwestiveTracker>({
      isLoading: true,
    })
  const [embedUIQwestiveMethods, setEmbedUIQwestiveMethods] =
    useState<TQwestiveEmbedUI>({
      isLoading: true,
    })

  useEffect(() => {
    if (window.QwestiveTracker.isInitialized) return

    const loadTrackerMethods = () => {
      try {
        const apiMethods = window?.QwestiveTracker?.init({
          apiKey: QWESTIVE_REFERRAL_API_KEY,
          projectId: QWESTIVE_REFERRAL_PROJECT_ID,
        })
        setTrackerQwestiveMethods({ ...apiMethods, isLoading: false })
        window.QwestiveTracker.isInitialized = true
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
    if (window.EmbedUI.isInitialized) return

    const loadEmbedUIMethods = () => {
      try {
        const apiMethods = window?.EmbedUI?.init({
          apiKey: QWESTIVE_REFERRAL_API_KEY,
          projectId: QWESTIVE_REFERRAL_PROJECT_ID,
        })
        setEmbedUIQwestiveMethods({ ...apiMethods, isLoading: false })
        window.EmbedUI.isInitialized = true
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

export function useQwestiveSDK(): IQwestiveContext {
  const context = useContext(SDKContext)
  if (!context)
    throw new Error(
      'useQwestiveSDK must be called from within the corresponding ContextProvider',
    )
  return context
}
