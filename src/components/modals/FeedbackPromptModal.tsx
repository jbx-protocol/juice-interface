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
  const formURL = feedbackFormURL('deploy', projectHandle, userAddress)

  return (
    <Modal
      title={t`Give us your feedback`}
      visible={visible}
      onOk={() => {
        window.open(formURL)
        onOk()
      }}
      onCancel={() => onCancel()}
      okText={t`Give feedback on project creation`}
      width={600}
      centered
    >
      <p>
        <Trans>Congrats on creating your project!</Trans>
      </p>
      <p>
        <Trans>
          We are keen to hear how we can improve Juicebox for you, can you share
          with us some feedback while your memory is still fresh?
        </Trans>
      </p>
      <p>
        <Trans>
          All the feedback will be sent to a{' '}
          <a
            href="https://discord.gg/NWmBtAHq"
            rel="noreferrer"
            target="_blank"
          >
            public Discord channel{' '}
          </a>
          and looked at by our development team.
        </Trans>
      </p>
    </Modal>
  )
}
