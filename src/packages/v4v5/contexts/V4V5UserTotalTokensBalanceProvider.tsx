import { useWallet } from 'hooks/Wallet'
import { useJBContractContext } from 'juice-sdk-react'
import { jbTokensAbi, JBCoreContracts } from 'juice-sdk-core'
import { useReadContract } from 'wagmi'
import React, { PropsWithChildren } from 'react'

const V4V5UserTotalTokensBalanceContext = React.createContext<{
  data: bigint | undefined
  isLoading: boolean
}>({
  data: undefined,
  isLoading: false,
})

export const V4V5UserTotalTokensBalanceProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { userAddress } = useWallet()
  const { projectId, contractAddress } = useJBContractContext()
  const value = useReadContract({
    abi: jbTokensAbi,
    address: contractAddress(JBCoreContracts.JBTokens),
    functionName: 'totalBalanceOf',
    args: userAddress ? [userAddress, projectId] : undefined,
  })

  return (
    <V4V5UserTotalTokensBalanceContext.Provider value={value}>
      {children}
    </V4V5UserTotalTokensBalanceContext.Provider>
  )
}

export const useV4UserTotalTokensBalance = () =>
  React.useContext(V4V5UserTotalTokensBalanceContext)
