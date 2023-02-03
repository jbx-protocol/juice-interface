import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { VeNftContext } from 'contexts/veNftContext'
import useProjectOwner from 'hooks/v2v3/contractReader/ProjectOwner'
import { useV2V3HasPermissions } from 'hooks/v2v3/contractReader/V2V3HasPermissions'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'

export function useVeNftHasProjectTokenPermission() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { contractAddress: veNftContractAddress } = useContext(VeNftContext)

  const { data: owner } = useProjectOwner(projectId)

  return useV2V3HasPermissions({
    operator: veNftContractAddress,
    account: owner,
    domain: projectId,
    permissions: [V2V3OperatorPermission.TRANSFER],
  })
}
