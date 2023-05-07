import { DEFAULT_MEMO, DEFAULT_METADATA } from 'constants/transactionDefaults'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { BigNumber } from 'ethers'

export function getAddToBalanceArgsV3({
  projectId,
  value,
}: {
  projectId: number
  value: BigNumber
}) {
  return {
    functionName: 'addToBalanceOf',
    args: [projectId, value, ETH_TOKEN_ADDRESS, DEFAULT_MEMO, DEFAULT_METADATA],
  }
}
