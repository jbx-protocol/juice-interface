import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useIssueTokensTx } from 'hooks/v2/transactor/IssueTokensTx'
import { useLocation } from 'react-router-dom'
import { CheckCircleFilled } from '@ant-design/icons'
import { CSSProperties, useContext, useState } from 'react'
import RichButton from 'components/shared/RichButton'

import { ThemeContext } from 'contexts/themeContext'
import IssueTokenModal from 'components/shared/modals/IssueTokenModal'
import { tweet } from 'utils/v2/tweet'

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
  const projectURL = window.location.origin + '/#' + useLocation().pathname
  const twitterMsg = `Check out my new @juiceboxETH project! ${projectURL}`

  const [issueTokenModalVisible, setIssueTokenModalVisible] =
    useState<boolean>(false)
  const [launchProjectPayerModalVisible, setLaunchProjectPayerModalVisible] =
    useState<boolean>(false)

  const [hasIssuedToken, setHasIssuedToken] = useState<boolean>()
  const [hasLaunchedPayableAddress, setHasLaunchedPayableAddress] =
    useState<boolean>()
  const [hasSharedToTwitter, setHasSharedToTwitter] = useState<boolean>()

  const completedAllSteps =
    hasIssuedToken && hasLaunchedPayableAddress && hasSharedToTwitter

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
      cancelText={t`Later`}
    >
      <h2>
        <Trans>Next steps (optional)</Trans>
      </h2>
      <p>
        <Trans>
          Congratulations on launching your project! The following steps are{' '}
          <strong>completely optional</strong> and you can complete them at any
          time.
        </Trans>
      </p>
      <ol style={{ fontSize: 17, marginTop: 20, padding: 0 }}>
        <RichButton
          prefix="1"
          heading={<Trans>Issue an ERC-20 token</Trans>}
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
          heading={<Trans>Create a payable address</Trans>}
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
        <RichButton
          prefix="3"
          heading={<Trans>Share to Twitter</Trans>}
          description={<Trans>Let's get this party started!</Trans>}
          onClick={() => {
            tweet(twitterMsg)
            setHasSharedToTwitter(true)
          }}
          disabled={hasSharedToTwitter}
          icon={
            hasSharedToTwitter ? (
              <CheckCircleFilled style={{ color: seenColor }} />
            ) : undefined
          }
          primaryColor={hasSharedToTwitter ? seenColor : undefined}
          style={stepButtonStyle}
        />
      </ol>
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
