import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useJBV3TokenDeployer } from 'hooks/JBV3Token/contracts/JBV3TokenDeployer'
import { useSetChangeTokenPermissionTx } from 'hooks/JBV3Token/transactor/SetChangeTokenPermissionTx'
import { useV2HasPermissions } from 'hooks/v2v3/contractReader/V2HasPermissions'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { StepSection } from './StepSection'

export function GrantChangeTokenPermissionSection({
  completed,
  onCompleted,
}: {
  completed: boolean
  onCompleted: () => void
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const deployer = useJBV3TokenDeployer()
  const tx = useSetChangeTokenPermissionTx()

  const onClick = async function () {
    await tx(undefined, {
      onConfirmed() {
        return onCompleted()
      },
    })
  }

  const { data: hasPermission } = useV2HasPermissions({
    operator: deployer?.address,
    account: projectOwnerAddress,
    domain: projectId,
    permissions: [V2OperatorPermission.CHANGE_TOKEN],
  })

  return (
    <StepSection
      title={<Trans>1. Grant permission</Trans>}
      completed={Boolean(completed || hasPermission)}
    >
      <p>
        Grant the Token Deployer contract (
        <FormattedAddress address={deployer?.address} />) permission to change
        your project's token.
      </p>
      <MinimalCollapse
        header={<Trans>Why do you need this permission?</Trans>}
        className="mb-5"
      >
        <Trans>
          We'll need this permission to change your project's token to your V3
          Migration Token in the next step.
        </Trans>
      </MinimalCollapse>
      <Button onClick={onClick} type="primary">
        Grant permission
      </Button>
    </StepSection>
  )
}
