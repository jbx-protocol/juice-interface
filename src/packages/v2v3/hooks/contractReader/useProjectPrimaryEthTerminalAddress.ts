import { ETH_TOKEN_ADDRESS } from 'packages/v2v3/constants/juiceboxTokens'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import useV2ContractReader from './useV2ContractReader'

export function useProjectPrimaryEthTerminalAddress({
  projectId,
}: {
  projectId: number | undefined
}) {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBDirectory,
    functionName: 'primaryTerminalOf',
    args: projectId ? [projectId, ETH_TOKEN_ADDRESS] : null,
  })
}
