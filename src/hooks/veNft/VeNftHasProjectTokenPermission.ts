import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectOwner from 'hooks/v2/contractReader/ProjectOwner'
import { useV2HasPermissions } from 'hooks/v2/contractReader/V2HasPermissions'
import { V2OperatorPermission } from 'models/v2/permissions'
import { useContext } from 'react'

export function useVeNftHasProjectTokenPermission() {
  const {
    projectId,
    veNft: { contractAddress: veNftContractAddress },
  } = useContext(V2ProjectContext)

  const { data: owner } = useProjectOwner(projectId)

  return useV2HasPermissions({
    operator: veNftContractAddress,
    account: owner,
    domain: projectId,
    permissions: [V2OperatorPermission.TRANSFER],
  })
}
