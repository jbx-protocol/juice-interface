import { getChainName } from './networks'

export const v4ProjectRoute = ({
  chainId,
  projectId,
}: {
  chainId: number
  projectId?: number
}) => {
  const chainName = getChainName(chainId)
  return `/v4/${chainName}/p/${projectId?.toString()}`
}
