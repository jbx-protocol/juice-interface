import { DEFAULT_MEMO, DEFAULT_METADATA } from 'constants/transactionDefaults'
import { ETH_TOKEN_ADDRESS } from 'packages/v2v3/constants/juiceboxTokens'

export function getAddToBalanceArgsV3_1({
  projectId,
  value,
}: {
  projectId: number
  value: bigint
}) {
  return {
    functionName: 'addToBalanceOf(uint256,uint256,address,bool,string,bytes)',
    args: [
      projectId,
      value,
      ETH_TOKEN_ADDRESS,
      true, // should hold fees
      DEFAULT_MEMO,
      DEFAULT_METADATA,
    ],
  }
}
