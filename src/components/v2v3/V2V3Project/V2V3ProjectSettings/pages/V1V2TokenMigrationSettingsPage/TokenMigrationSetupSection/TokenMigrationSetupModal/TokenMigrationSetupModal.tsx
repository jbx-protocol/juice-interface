import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Modal, ModalProps } from 'antd'
import { Callout } from 'components/Callout'
import Loading from 'components/Loading'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import useProjectToken from 'hooks/v2v3/contractReader/ProjectToken'
import { V1UserProvider } from 'providers/v1/UserProvider'
import { useCallback, useContext, useState } from 'react'
import { DeployMigrationTokenSection } from './DeployMigrationTokenSection'
import * as constants from '@ethersproject/constants'
import FormattedAddress from 'components/FormattedAddress'
import CopyTextButton from 'components/CopyTextButton'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { GrantSetTokenPermissionSection } from './GrantSetTokenPermissionSection'

export function TokenMigrationSetupModal({ ...props }: ModalProps) {
  const { projectId } = useContext(ProjectMetadataContext)
  const [deployedMigrationToken, setDeployedMigrationToken] = useState<string>()

  // Check if token already set
  const { data: tokenAddress, loading: tokenAddressLoading } = useProjectToken({
    projectId,
  })

  const onDeployMigrationTokenCompleted = useCallback(
    (deployedMigrationToken: string) => {
      setDeployedMigrationToken(deployedMigrationToken)
    },
    [],
  )

  const tokenAlreadySet =
    !!tokenAddress && tokenAddress !== constants.AddressZero

  const completed = !!deployedMigrationToken && migrationTokenSet

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
      {tokenAddressLoading ? (
        <Loading />
      ) : tokenAlreadySet ? (
        <>
          <Trans>
            The <ProjectVersionBadge.V3 /> has already been set for this
            project.
          </Trans>
        </>
      ) : (
        <>
          <p className="mb-4">
            <Trans>
              Give your <ProjectVersionBadge.V1 /> or <ProjectVersionBadge.V2 />{' '}
              project's token holders the ability to migrate their tokens to{' '}
              <ProjectVersionBadge.V3 />.
            </Trans>
          </p>

          <div className="mb-8">
            <MinimalCollapse header={<Trans>How does it work?</Trans>}>
              <Trans>
                Token holders of your legacy project tokens (
                <ProjectVersionBadge versionText="V1" /> or{' '}
                <ProjectVersionBadge versionText="V2" />) will have the ability
                to swap their tokens for{' '}
                <ProjectVersionBadge versionText="V3" /> tokens at a 1-to-1
                exchange rate.
              </Trans>
            </MinimalCollapse>
          </div>

          <div>
            <div className="mb-10">
              <GrantSetTokenPermissionSection />
            </div>

            <div>
              {/* Required to read v1 project ids from handles */}
              <V1UserProvider>
                <DeployMigrationTokenSection
                  completed={!!deployedMigrationToken}
                  onCompleted={onDeployMigrationTokenCompleted}
                />
              </V1UserProvider>

              {!!deployedMigrationToken && (
                <>
                  <Callout.Info collapsible={false} className="mb-2">
                    <p className="mb-1">
                      <Trans>Migration token successfully deployed.</Trans>
                    </p>
                    <p className="mb-0">
                      Token address:{' '}
                      <strong>
                        <FormattedAddress
                          truncateTo={16}
                          tooltipDisabled
                          address={deployedMigrationToken}
                        />
                      </strong>
                      <CopyTextButton
                        className="ml-1"
                        value={deployedMigrationToken}
                      />
                    </p>
                  </Callout.Info>
                  <Callout.Warning collapsible={false}>
                    <p>
                      Make sure you copy and save this address if you aren't
                      ready to complete Step 2.{' '}
                    </p>
                    <p>
                      <strong>
                        Once you leave this page, this token will be lost and
                        hard to recover.
                      </strong>
                    </p>
                  </Callout.Warning>
                </>
              )}
            </div>

            {completed && (
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
        </>
      )}
    </Modal>
  )
}
