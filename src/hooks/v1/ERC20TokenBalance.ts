import { BigNumber } from '@ethersproject/bignumber'
import { JuiceboxV1ContractName } from 'models/contracts/juiceboxV1'
import { TokenRef } from 'models/token-ref'

import useContractReaderV1 from './ContractReaderV1'
import { useErc20Contract } from '../Erc20Contract'

export function useERC20TokenBalance(
  tokenRef: TokenRef | undefined,
  walletAddress: string | undefined,
) {
  const projectBalance = useContractReaderV1<BigNumber>({
    contract: JuiceboxV1ContractName.TicketBooth,
    functionName: 'balanceOf',
    args:
      walletAddress && tokenRef?.type === 'project'
        ? [walletAddress, tokenRef?.value]
        : null,
  })

  const erc20Balance = useContractReaderV1<BigNumber>({
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
