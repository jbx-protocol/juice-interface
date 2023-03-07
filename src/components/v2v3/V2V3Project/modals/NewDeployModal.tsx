import { CheckCircleFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { IssueErc20TokenModal } from 'components/modals/IssueErc20TokenModal'
import RichButton from 'components/buttons/RichButton'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useDeployProjectPayerTx } from 'hooks/v2v3/transactor/DeployProjectPayerTx'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath } from 'utils/routes'
import { LaunchProjectPayerModal } from './LaunchProjectPayerModal'
import ExternalLink from 'components/ExternalLink'
import {
  ISSUE_ERC20_EXPLANATION,
  PROJECT_PAYER_ADDRESS_EXPLANATION,
} from 'components/Explanations'

export const NEW_DEPLOY_QUERY_PARAM = 'np'

export default function NewDeployModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [issueTokenModalVisible, setIssueTokenModalVisible] =
    useState<boolean>(false)
  const [launchProjectPayerModalVisible, setLaunchProjectPayerModalVisible] =
    useState<boolean>(false)
  const [hasIssuedToken, setHasIssuedToken] = useState<boolean>()
  const [hasLaunchedPayableAddress, setHasLaunchedPayableAddress] =
    useState<boolean>()

  const completedAllSteps = hasIssuedToken && hasLaunchedPayableAddress

  return (
    <Modal
      open={open}
      onOk={onClose}
      onCancel={onClose}
      okButtonProps={{ hidden: !completedAllSteps }}
      cancelButtonProps={{ hidden: completedAllSteps }}
      okText={t`Done`}
      cancelText={t`Close, I'll do these later`}
    >
      <h2>
        <Trans>Project launch successful</Trans>
      </h2>
      <p>
        <Trans>
          Congratulations on launching your project! For help planning your next
          steps, share your project in the{' '}
          <ExternalLink href="https://discord.gg/juicebox">
            JuiceboxDAO Discord
          </ExternalLink>
          . Optionally, you can also:
        </Trans>
      </p>
      <div>
        <Link href={settingsPagePath('projecthandle', { handle, projectId })}>
          <RichButton
            className="mb-4"
            prefix="1"
            heading={<Trans>Set a project handle (optional)</Trans>}
            description={
              <Trans>
                Set a unique handle that will be visible in your project's URL,
                and that will allow your project to appear in search results.
              </Trans>
            }
            disabled={!!handle}
            icon={
              handle ? (
                <CheckCircleFilled className="text-grey-400 dark:text-slate-200" />
              ) : undefined
            }
            primaryColorClassName={
              handle ? 'text-grey-400 dark:text-slate-200' : undefined
            }
          />
        </Link>
        <RichButton
          className="mb-4"
          prefix="2"
          heading={<Trans>Issue an ERC-20 token (optional)</Trans>}
          description={ISSUE_ERC20_EXPLANATION}
          onClick={() => setIssueTokenModalVisible(true)}
          disabled={hasIssuedToken}
          icon={
            hasIssuedToken ? (
              <CheckCircleFilled className="text-grey-400 dark:text-slate-200" />
            ) : undefined
          }
          primaryColorClassName={
            hasIssuedToken ? 'text-grey-400 dark:text-slate-200' : undefined
          }
        />
        <RichButton
          className="mb-4"
          prefix="3"
          heading={<Trans>Create a project payer address (optional)</Trans>}
          description={PROJECT_PAYER_ADDRESS_EXPLANATION}
          onClick={() => setLaunchProjectPayerModalVisible(true)}
          disabled={hasLaunchedPayableAddress}
          icon={
            hasLaunchedPayableAddress ? (
              <CheckCircleFilled className="text-grey-400 dark:text-slate-200" />
            ) : undefined
          }
          primaryColorClassName={
            hasLaunchedPayableAddress
              ? 'text-grey-400 dark:text-slate-200'
              : undefined
          }
        />
      </div>
      <IssueErc20TokenModal
        open={issueTokenModalVisible}
        onClose={() => setIssueTokenModalVisible(false)}
        onConfirmed={() => setHasIssuedToken(true)}
      />
      <LaunchProjectPayerModal
        open={launchProjectPayerModalVisible}
        onClose={() => setLaunchProjectPayerModalVisible(false)}
        useDeployProjectPayerTx={useDeployProjectPayerTx}
        onConfirmed={() => setHasLaunchedPayableAddress(true)}
      />
    </Modal>
  )
}
