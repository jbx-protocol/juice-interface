import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useJBV3TokenDeployer } from 'hooks/JBV3Token/contracts/JBV3TokenDeployer'
import { useSetChangeTokenPermissionTx } from 'hooks/JBV3Token/transactor/SetChangeTokenPermissionTx'
import { useV2HasPermissions } from 'hooks/v2v3/contractReader/V2HasPermissions'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { StepSection } from './StepSection'

export function GrantSetTokenPermissionSection() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const deployer = useJBV3TokenDeployer()
  const tx = useSetChangeTokenPermissionTx()

  const onClick = async function () {
    await tx(undefined, {
      onConfirmed() {
        return
      },
    })
  }

  const { data: completed } = useV2HasPermissions({
    operator: deployer?.address,
    account: projectOwnerAddress,
    domain: projectId,
    permissions: [V2OperatorPermission.CHANGE_TOKEN],
  })

  return (
    <StepSection
      title={<Trans>1. Grant permission</Trans>}
      completed={Boolean(completed)}
    >
      <p>
        Grant the Token Deployer contract permission to update your project's
        token.
      </p>
      <Button onClick={onClick}>Grant permission</Button>
    </StepSection>
  )
}
