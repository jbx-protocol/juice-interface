import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Modal, ModalProps } from 'antd'
import { Callout } from 'components/Callout'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { V1UserProvider } from 'providers/v1/UserProvider'
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
        <div className="mb-10">
          <GrantChangeTokenPermissionSection
            completed={grantChangeTokenPermissionComplete}
            onCompleted={() => setGrantChangeTokenPermissionComplete(true)}
          />
        </div>

        <div>
          {/* Required to read v1 project ids from handles */}
          <V1UserProvider>
            <DeployMigrationTokenSection
              completed={tokenDeployed}
              onCompleted={() => setTokenDeployed(true)}
            />
          </V1UserProvider>

          {tokenDeployed && (
            <>
              <Callout.Info collapsible={false} className="mb-2">
                <p className="mb-1">
                  <Trans>Migration token successfully deployed.</Trans>
                </p>
              </Callout.Info>
              <Callout.Warning collapsible={false}>
                <p>
                  Make sure you copy and save this address if you aren't ready
                  to complete Step 2.{' '}
                </p>
                <p>
                  <strong>
                    Once you leave this page, this token will be lost and hard
                    to recover.
                  </strong>
                </p>
              </Callout.Warning>
            </>
          )}
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
                V1 token holders can migrate their tokens to your V3 tokens
                using your V3 project's <strong>Tokens</strong> section.
              </Trans>
            </p>
          </Callout>
        )}
      </div>
    </Modal>
  )
}
