import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useWallet } from 'hooks/Wallet'

export function useV2TokenBalance({
  projectId,
}: {
  projectId: number | undefined
}) {
  const JBV3TokenContract = new Contract('', '') // TODO
  const { userAddress } = useWallet()

  const { value: v2TokenStoreAddress } = useContractReadValue<string, string>({
    contract: JBV3TokenContract,
    functionName: 'v2TokenStore',
    args: null,
  })

  const v2TokenStoreContract = useLoadContractFromAddress({
    address: v2TokenStoreAddress,
    abi: '',
  }) // TODO

  return (
    useTotalBalanceOf(
      userAddress,
      projectId,
      undefined,
      v2TokenStoreContract,
    ) ?? BigNumber.from(0)
  )
}
