import { useWallet } from 'hooks/Wallet'
import {
  useJBContractContext,
  useReadJbTokensTotalBalanceOf,
} from 'juice-sdk-react'
import React, { PropsWithChildren } from 'react'
import { zeroAddress } from 'viem'

const V4UserTotalTokensBalanceContext = React.createContext<{
  data: bigint | undefined
  isLoading: boolean
}>({
  data: undefined,
  isLoading: false,
})

export const V4UserTotalTokensBalanceProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { userAddress } = useWallet()
  const { projectId } = useJBContractContext()
  const value = useReadJbTokensTotalBalanceOf({
    args: [userAddress ?? zeroAddress, projectId],
  })

  return (
    <V4UserTotalTokensBalanceContext.Provider value={value}>
      {children}
    </V4UserTotalTokensBalanceContext.Provider>
  )
}

export const useV4UserTotalTokensBalance = () =>
  React.useContext(V4UserTotalTokensBalanceContext)
