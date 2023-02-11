import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Modal, ModalProps } from 'antd'
import { Callout } from 'components/Callout'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { V1UserProvider } from 'contexts/v1/User/V1UserProvider'
import { useState } from 'react'
import { DeployMigrationTokenSection } from './DeployMigrationTokenSection'
import { GrantChangeTokenPermissionSection } from './GrantChangeTokenPermissionSection'

export function TokenMigrationSetupModal({ ...props }: ModalProps) {
  const [
    grantChangeTokenPermissionComplete,
    setGrantChangeTokenPermissionComplete,
  ] = useState<boolean>(false)
  const [tokenDeployed, setTokenDeployed] = useState<boolean>(false)

  return (
    <Modal
      width={600}
      title={
        <span className="text-lg text-black dark:text-slate-100">
          <Trans>Set up token migration</Trans>
        </span>
      }
      okButtonProps={{ hidden: true }}
      cancelText={<Trans>Close</Trans>}
      {...props}
    >
      <p className="mb-4">
        <Trans>Deploy a V3 Migration Token for your project.</Trans>
      </p>
      <p className="mb-6">
        <Trans>
          This will give your <ProjectVersionBadge.V1 /> or{' '}
          <ProjectVersionBadge.V2 /> project's token holders the ability to
          migrate their tokens to <ProjectVersionBadge.V3 />.
        </Trans>
      </p>

      <div>
        <GrantChangeTokenPermissionSection
          completed={grantChangeTokenPermissionComplete}
          onCompleted={() => setGrantChangeTokenPermissionComplete(true)}
        />

        <div>
          {/* Required to read v1 project ids from handles */}
          <V1UserProvider>
            <DeployMigrationTokenSection
              completed={tokenDeployed}
              onCompleted={() => setTokenDeployed(true)}
            />
          </V1UserProvider>
        </div>

        {tokenDeployed && (
          <Callout
            className="bg-smoke-75 dark:bg-slate-400"
            iconComponent={<CheckCircleFilled />}
          >
            <p>
              <Trans>You're all set!</Trans> 🎉
            </p>
            <p className="m-0">
              <Trans>
                Your legacy project token holders can now migrate their tokens
                in the <strong>Tokens</strong> section on your V3 project page.
              </Trans>
            </p>
          </Callout>
        )}
      </div>
    </Modal>
  )
}
