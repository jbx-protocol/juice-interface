import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'

import { feedbackFormURL } from 'utils/feedbackFormURL'

// Displays on project page when user was just redirected from the deployment of that project
export default function FeedbackPromptModal({
  visible,
  onOk,
  onCancel,
  projectHandle,
  userAddress,
}: {
  visible: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
  projectHandle?: string
  userAddress?: string
}) {
  const formURL = feedbackFormURL({
    referrer: 'deploy',
    projectHandle,
    userAddress,
  })

  return (
    <Modal
      title={t`Give us your feedback`}
      visible={visible}
      onOk={() => {
        window.open(formURL)
        onOk()
      }}
      onCancel={() => onCancel()}
      okText={t`Give feedback`}
      width={600}
      centered
    >
      <p>
        <Trans>Congrats on creating your project!</Trans>
      </p>
      <p>
        <Trans>
          How did we do? We'd love to get your feedback so we can make creating
          Juicebox projects as juicy as possible!
        </Trans>
      </p>
      <p>
        <Trans>
          Your feedback will be sent to a{' '}
          <a
            href="https://discord.gg/NWmBtAHq"
            rel="noreferrer"
            target="_blank"
          >
            public Discord channel{' '}
          </a>
          for our development team to consider.
        </Trans>
      </p>
    </Modal>
  )
}
