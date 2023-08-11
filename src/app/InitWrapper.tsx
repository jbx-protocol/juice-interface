'use client'

import { initWeb3Onboard, useInitWallet } from 'hooks/Wallet'
import { PropsWithChildren } from 'react'

/**
 * Init Web3 Onboard
 *
 * Must be called outside component scope, to ensure it is called before component lifecycle starts and hooks execute.
 */
initWeb3Onboard()

export const InitWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  // Currently, init() must be called *here* (as opposed to AppWrapper), or else it breaks when navigating between pages.
  useInitWallet()
  return <>{children}</>
}
