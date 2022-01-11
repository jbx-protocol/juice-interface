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

  async function tweet() {
    const name = metadata?.twitter ? `@${metadata.twitter}` : metadata?.name
    const twitterMsg = t`I just joined ${name}%2e See the live fundraiser%3a https%3a%2f%2fjuicebox.money%2f%23%2fp%2f${handle} %23juicebox`
    const twitterUrl = `https://twitter.com/intent/tweet?url=${twitterMsg}`
    window.open(twitterUrl, '_blank')
    if (onSuccess) {
      onSuccess()
    }
  }

  if (!metadata) return null

  return (
    <Modal
      title={t`Share your contribution`}
      visible={visible}
      onOk={tweet}
      okText={t`Tweet`}
      onCancel={onCancel}
      cancelText={t`I'm good`}
      width={640}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <p>
          <Trans>
            Would you like to Tweet about your contribution to {metadata.name}{' '}
            and encourage others to do the same?
          </Trans>
        </p>
      </Space>
    </Modal>
  )
}
