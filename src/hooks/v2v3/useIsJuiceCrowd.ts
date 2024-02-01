import { readNetwork } from 'constants/networks'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { NetworkName } from 'models/networkName'

export function useIsJuicecrowd() {
  const { projectMetadata, projectId } = useProjectMetadataContext()

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
