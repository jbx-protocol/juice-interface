import { DEFAULT_MEMO, DEFAULT_METADATA } from 'constants/transactionDefaults'
import { ETH_TOKEN_ADDRESS } from 'packages/v2v3/constants/juiceboxTokens'

export function getAddToBalanceArgsV3({
  projectId,
  value,
}: {
  projectId: number
  value: bigint
}) {
  return {
    functionName: 'addToBalanceOf',
    args: [projectId, value, ETH_TOKEN_ADDRESS, DEFAULT_MEMO, DEFAULT_METADATA],
  }
}
