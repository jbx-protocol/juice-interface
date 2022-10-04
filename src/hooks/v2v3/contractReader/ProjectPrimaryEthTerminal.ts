import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ContractName } from 'models/v2v3/contracts'
import useV2ContractReader from './V2ContractReader'

export function useProjectPrimaryEthTerminal({
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
