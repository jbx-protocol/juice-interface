import { Modal, Space } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import { useContext } from 'react'
import { t, Trans } from '@lingui/macro'

export default function ShareToTwitterModal({
  visible,
  onSuccess,
  onCancel,
}: {
  visible?: boolean
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { metadata, handle } = useContext(ProjectContext)
  const name = metadata?.twitter ? `@${metadata.twitter}` : metadata?.name
  const projectUrl = `https://juicebox.money/#/p/${handle}`
  const twitterMsg = t`I just joined ${name}. See the live fundraiser: ${projectUrl}`

  async function tweet() {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      twitterMsg,
    )}`

    window.open(twitterUrl, '_blank')
    if (onSuccess) {
      onSuccess()
    }
  }

  if (!metadata) return null

  return (
    <Modal
      title={t`Share your contribution on Twitter`}
      visible={visible}
      onOk={tweet}
      okText={t`Share to Twitter`}
      onCancel={onCancel}
      cancelText={t`Close`}
      width={640}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <p>
          <Trans>{twitterMsg}</Trans>
        </p>
      </Space>
    </Modal>
  )
}
