import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { VeNftContext } from 'contexts/veNftContext'
import useProjectOwner from 'hooks/v2v3/contractReader/ProjectOwner'
import { useV2HasPermissions } from 'hooks/v2v3/contractReader/V2HasPermissions'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'

export function useVeNftHasProjectTokenPermission() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { contractAddress: veNftContractAddress } = useContext(VeNftContext)

  const { data: owner } = useProjectOwner(projectId)

  return useV2HasPermissions({
    operator: veNftContractAddress,
    account: owner,
    domain: projectId,
    permissions: [V2OperatorPermission.TRANSFER],
  })
}
