import { useWallet } from 'hooks/Wallet'
import { useJBRulesetContext } from 'juice-sdk-react'
import { jb721TiersHookAbi } from 'juice-sdk-core'
import { useReadContract } from 'wagmi'
import React, { PropsWithChildren } from 'react'

const V4UserNftCreditsContext = React.createContext<{
  data: bigint | undefined
  isLoading: boolean
}>({
  data: undefined,
  isLoading: false,
})

export const V4UserNftCreditsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { userAddress } = useWallet()
  const {
    rulesetMetadata: { data: rulesetMetadata },
  } = useJBRulesetContext()
  const creds = useReadContract({
    abi: jb721TiersHookAbi,
    address: rulesetMetadata?.dataHook,
    functionName: 'payCreditsOf',
    args: userAddress ? [userAddress] : undefined,
  })

  return (
    <V4UserNftCreditsContext.Provider value={creds}>
      {children}
    </V4UserNftCreditsContext.Provider>
  )
}

export const useV4UserNftCredits = () => {
  return React.useContext(V4UserNftCreditsContext)
}
