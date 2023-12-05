import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectMetadata'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'

export function useIsJuicecrowd() {
  const { projectMetadata, projectId } = useProjectMetadata()

  // Some project's metadata are broken, need to hardcode
  const JCProjectsWithBrokenMetadata = [
    600, // DreamDAO
  ]
  const isMainnet = readNetwork.name === NetworkName.mainnet
  const isJCProjectWithBrokenMetadata =
    isMainnet && JCProjectsWithBrokenMetadata.includes(projectId ?? 0)

  return (
    projectMetadata?.domain === 'juicecrowd' || isJCProjectWithBrokenMetadata
  )
}
