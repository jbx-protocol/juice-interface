import { BigNumber } from '@ethersproject/bignumber'
import { ContractName } from 'models/contract-name'
import { TokenRef } from 'models/token-ref'

import useContractReader from './ContractReader'
import { useErc20Contract } from './Erc20Contract'

export function useERC20TokenBalance(
  tokenRef: TokenRef | undefined,
  walletAddress: string | undefined,
) {
  const projectBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'balanceOf',
    args:
      walletAddress && tokenRef?.type === 'project'
        ? [walletAddress, tokenRef?.value]
        : null,
  })

  const erc20Balance = useContractReader<BigNumber>({
    contract: useErc20Contract(
      tokenRef?.type === 'erc20' ? tokenRef.value : undefined,
    ),
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : null,
  })

  if (!tokenRef) return

  if (tokenRef.type === 'project') return projectBalance
  if (tokenRef.type === 'erc20') return erc20Balance
}
