import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import IssueTokenButton from 'components/shared/IssueTokenButton'
import ShareToTwitterButton from 'components/shared/ShareToTwitterButton'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useIssueTokensTx } from 'hooks/v2/transactor/IssueTokensTx'
import { useLocation } from 'react-router-dom'
import { CheckSquareOutlined } from '@ant-design/icons'
import { useState } from 'react'

import LaunchProjectPayerButton from './LaunchProjectPayerButton'

function NextStepItem({ title }: { title: JSX.Element }) {
  return <li style={{ marginBottom: 25, marginTop: 25 }}>{title}</li>
}

export default function NewDeployModal({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const projectURL = window.location.origin + useLocation().pathname
  const twitterMsg = `Check out my new @juiceboxETH project! ${projectURL}`

  const [hasIssuedToken, setHasIssuedToken] = useState<boolean>()
  const [hasLaunchedPayableAddress, setHasLaunchedPayableAddress] =
    useState<boolean>()
  const [hasSharedToTwitter, setHasSharedToTwitter] = useState<boolean>()

  const completedAllSteps =
    hasIssuedToken && hasLaunchedPayableAddress && hasSharedToTwitter

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
        <Trans>Next steps</Trans>
      </h2>
      <ol style={{ fontSize: 17, marginTop: 20 }}>
        <NextStepItem
          title={
            <IssueTokenButton
              useIssueTokensTx={useIssueTokensTx}
              disabled={hasIssuedToken}
              text={
                <>
                  <Trans>Issue ERC-20 token</Trans>
                  {hasIssuedToken && (
                    <>
                      {' '}
                      <CheckSquareOutlined />
                    </>
                  )}
                </>
              }
              type="default"
              size="middle"
              tooltipText={
                <Trans>
                  Create your own ERC-20 token to represent stake in your
                  project. Contributors will receive these tokens when they pay
                  your project.
                </Trans>
              }
              hideIcon
              onCompleted={() => setHasIssuedToken(true)}
            />
          }
        />
        <NextStepItem
          title={
            <LaunchProjectPayerButton
              useDeployProjectPayerTx={useDeployProjectPayerTx}
              disabled={hasLaunchedPayableAddress}
              size="middle"
              tooltipText={
                <Trans>
                  Create an ETH address people can use to pay this project
                  rather than paying through the juicebox.money interface.
                </Trans>
              }
              text={
                <>
                  <Trans>Create a payable address</Trans>
                  {hasLaunchedPayableAddress && (
                    <>
                      {' '}
                      <CheckSquareOutlined />
                    </>
                  )}
                </>
              }
              onCompleted={() => setHasLaunchedPayableAddress(true)}
            />
          }
        />
        <NextStepItem
          title={
            <ShareToTwitterButton
              message={twitterMsg}
              onClick={() => setHasSharedToTwitter(true)}
              disabled={hasSharedToTwitter}
              icon={hasSharedToTwitter ? <CheckSquareOutlined /> : undefined}
            />
          }
        />
      </ol>
    </Modal>
  )
}
