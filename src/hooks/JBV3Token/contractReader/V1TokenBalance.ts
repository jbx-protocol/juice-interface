import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useWallet } from 'hooks/Wallet'

export function useV1TokenBalance() {
  const JBV3TokenContract = new Contract('', '') // TODO
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

  const v1TicketBookAddress = useLoadContractFromAddress({
    address: v1TicketBoothAddress,
    abi: '',
  }) // TODO

  return useTotalBalanceOf(
    userAddress,
    v1ProjectId,
    undefined,
    v1TicketBookAddress,
  )
}
