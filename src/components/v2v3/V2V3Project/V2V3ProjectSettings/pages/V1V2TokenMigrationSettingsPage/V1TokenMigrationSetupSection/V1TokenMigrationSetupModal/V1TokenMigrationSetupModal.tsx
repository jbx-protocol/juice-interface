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
import { AddTerminalSection as DeployMigrationTokenSection } from './DeployMigrationTokenSection'
import { SetMigratedTokenSection } from './SetMigratedTokenSection'
import * as constants from '@ethersproject/constants'
import FormattedAddress from 'components/FormattedAddress'
import CopyTextButton from 'components/CopyTextButton'

export function V1TokenMigrationSetupModal({ ...props }: ModalProps) {
  const { projectId } = useContext(ProjectMetadataContext)
  const [deployedMigrationToken, setDeployedMigrationToken] = useState<string>()
  const [migrationTokenSet, setMigrationTokenSet] = useState<boolean>(false)
  useState<boolean>(false)

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
          <p className="mb-8">
            <Trans>
              Set up the option for user token migration from{' '}
              <ProjectVersionBadge.V1 /> or <ProjectVersionBadge.V2 /> projects
              to <ProjectVersionBadge.V3 />.
            </Trans>
          </p>

          <div className="flex flex-col gap-6">
            {/* Required to read v1 project ids from handles */}
            <V1UserProvider>
              <DeployMigrationTokenSection
                completed={!!deployedMigrationToken}
                onCompleted={onDeployMigrationTokenCompleted}
              />
            </V1UserProvider>

            {!!deployedMigrationToken && (
              <>
                <Callout.Info collapsible={false}>
                  <p>
                    <Trans>
                      Migration token was successfully deployed to{' '}
                      <FormattedAddress
                        truncateTo={16}
                        tooltipDisabled
                        address={deployedMigrationToken}
                      />
                    </Trans>
                    <CopyTextButton
                      className="ml-1"
                      value={deployedMigrationToken}
                    />
                  </p>
                </Callout.Info>
                <Callout.Warning collapsible={false}>
                  <p>
                    Please make sure you make a copy of this address if you are
                    not ready to complete step 2.{' '}
                  </p>
                  <p>
                    <strong>
                      Once you navigate away from this page, this token will be
                      lost and very hard to recover.
                    </strong>
                  </p>
                </Callout.Warning>
              </>
            )}

            <SetMigratedTokenSection
              deployedMigrationToken={deployedMigrationToken}
              completed={completed}
              onCompleted={() => setMigrationTokenSet(true)}
            />

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
                    V1 token holders can swap their tokens for your V2 tokens on
                    your V2 project's <strong>Tokens</strong> section.
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
