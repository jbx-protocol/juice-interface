import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useJBV3TokenDeployer } from 'hooks/JBV3Token/contracts/useJBV3TokenDeployer'
import { useSetChangeTokenPermissionTx } from 'hooks/JBV3Token/transactor/useSetChangeTokenPermissionTx'
import { useV2V3HasPermissions } from 'hooks/v2v3/contractReader/useV2V3HasPermissions'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
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

  const [loading, setLoading] = useState<boolean>(false)

  const deployer = useJBV3TokenDeployer()
  const tx = useSetChangeTokenPermissionTx()
  const { data: hasPermission } = useV2V3HasPermissions({
    operator: deployer?.address,
    account: projectOwnerAddress,
    domain: projectId,
    permissions: [V2V3OperatorPermission.CHANGE_TOKEN],
  })

  const _completed = Boolean(completed || hasPermission)

  const onClick = async function () {
    setLoading(true)
    try {
      await tx(undefined, {
        onConfirmed() {
          setLoading(false)

          return onCompleted()
        },
        onError(e) {
          console.error(e)
          emitErrorNotification(t`Failed to grant permission.`)
        },
      })
    } catch (e) {
      console.error(e)
      emitErrorNotification(t`Failed to grant permission.`)
      setLoading(false)
    }
  }

  return (
    <StepSection
      title={<Trans>1. Grant permission</Trans>}
      completed={_completed}
    >
      <p>
        Grant the Token Deployer contract (
        <EthereumAddress address={deployer?.address} />) permission to change
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
      <Button
        onClick={onClick}
        loading={loading}
        disabled={_completed}
        type="primary"
        className="mb-8"
      >
        Grant permission
      </Button>
    </StepSection>
  )
}
