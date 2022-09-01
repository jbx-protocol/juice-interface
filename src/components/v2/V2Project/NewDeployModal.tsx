import { CheckCircleFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import RichButton from 'components/RichButton'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useIssueTokensTx } from 'hooks/v2/transactor/IssueTokensTx'
import { CSSProperties, useContext, useState } from 'react'

import IssueTokenModal from 'components/modals/IssueTokenModal'
import { ThemeContext } from 'contexts/themeContext'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useRouter } from 'next/router'
import { pushSettingsContent } from 'utils/routes'
import LaunchProjectPayerModal from './LaunchProjectPayer/LaunchProjectPayerModal'

export default function NewDeployModal({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const { handle } = useContext(V2ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const router = useRouter()

  const [issueTokenModalVisible, setIssueTokenModalVisible] =
    useState<boolean>(false)
  const [launchProjectPayerModalVisible, setLaunchProjectPayerModalVisible] =
    useState<boolean>(false)
  const [hasIssuedToken, setHasIssuedToken] = useState<boolean>()
  const [hasLaunchedPayableAddress, setHasLaunchedPayableAddress] =
    useState<boolean>()

  const completedAllSteps = hasIssuedToken && hasLaunchedPayableAddress

  const seenColor = colors.text.tertiary

  const stepButtonStyle: CSSProperties = {
    marginBottom: 15,
  }

  return (
    <Modal
      visible={visible}
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
          Congratulations on launching your project! The next steps are optional
          and can be completed at any time.
        </Trans>
      </p>
      <div>
        <RichButton
          prefix="1"
          heading={<Trans>Set a project handle (optional)</Trans>}
          description={
            <Trans>
              Set a unique name that will be visible in your project's URL, and
              that will allow your project to appear in search results.
            </Trans>
          }
          onClick={() => pushSettingsContent(router, 'projecthandle')}
          disabled={!!handle}
          icon={
            handle ? (
              <CheckCircleFilled style={{ color: seenColor }} />
            ) : undefined
          }
          primaryColor={handle ? seenColor : undefined}
          style={stepButtonStyle}
        />
        <RichButton
          prefix="2"
          heading={<Trans>Issue an ERC-20 token (optional)</Trans>}
          description={
            <Trans>
              Create your own ERC-20 token to represent stake in your project.
              Contributors will receive these tokens when they pay your project.
            </Trans>
          }
          onClick={() => setIssueTokenModalVisible(true)}
          disabled={hasIssuedToken}
          icon={
            hasIssuedToken ? (
              <CheckCircleFilled style={{ color: seenColor }} />
            ) : undefined
          }
          primaryColor={hasIssuedToken ? seenColor : undefined}
          style={stepButtonStyle}
        />
        <RichButton
          prefix="3"
          heading={<Trans>Create a Payment Address (optional)</Trans>}
          description={
            <Trans>
              Create an Ethereum address for your project. Enables direct
              payments without going through your project's Juicebox page.
            </Trans>
          }
          onClick={() => setLaunchProjectPayerModalVisible(true)}
          disabled={hasLaunchedPayableAddress}
          icon={
            hasLaunchedPayableAddress ? (
              <CheckCircleFilled style={{ color: seenColor }} />
            ) : undefined
          }
          primaryColor={hasLaunchedPayableAddress ? seenColor : undefined}
          style={stepButtonStyle}
        />
      </div>
      <IssueTokenModal
        visible={issueTokenModalVisible}
        useIssueTokensTx={useIssueTokensTx}
        onClose={() => setIssueTokenModalVisible(false)}
        onConfirmed={() => setHasIssuedToken(true)}
      />
      <LaunchProjectPayerModal
        visible={launchProjectPayerModalVisible}
        onClose={() => setLaunchProjectPayerModalVisible(false)}
        useDeployProjectPayerTx={useDeployProjectPayerTx}
        onConfirmed={() => setHasLaunchedPayableAddress(true)}
      />
    </Modal>
  )
}
