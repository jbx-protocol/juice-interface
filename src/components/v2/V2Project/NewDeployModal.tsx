import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useIssueTokensTx } from 'hooks/v2/transactor/IssueTokensTx'
import { CheckCircleFilled } from '@ant-design/icons'
import { CSSProperties, useContext, useState } from 'react'
import RichButton from 'components/shared/RichButton'

import { ThemeContext } from 'contexts/themeContext'
import IssueTokenModal from 'components/shared/modals/IssueTokenModal'

import LaunchProjectPayerModal from './LaunchProjectPayer/LaunchProjectPayerModal'

export default function NewDeployModal({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
          Congratulations on launching your project! Continue with these
          optional next steps.
        </Trans>
      </p>
      <div>
        <RichButton
          prefix="1"
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
          prefix="2"
          heading={<Trans>Create a payable address (optional)</Trans>}
          description={
            <Trans>
              Create an Ethereum address that can be used to pay your project
              directly.
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
