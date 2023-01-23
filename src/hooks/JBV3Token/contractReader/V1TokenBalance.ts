import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/JBV3Token'

export function useV1TokenBalance() {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })
  const { userAddress } = useWallet()

  const { value: v1ProjectId } = useContractReadValue<string, BigNumber>({
    contract: JBV3TokenContract,
    functionName: 'v1ProjectId',
    args: null,
  })

  const { value: v1TicketBoothAddress } = useContractReadValue<string, string>({
    contract: JBV3TokenContract,
    functionName: 'v1TicketBooth',
    args: null,
  })

  const v1TicketBookContract = useLoadContractFromAddress({
    address: v1TicketBoothAddress,
    abi: '',
  }) // TODO

  return (
    useTotalBalanceOf(
      userAddress,
      v1ProjectId,
      undefined,
      v1TicketBookContract,
    ) ?? BigNumber.from(0)
  )
}
