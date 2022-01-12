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
    const projectUrl = `https://juicebox.money/#/p/${handle}`
    const twitterMsg = encodeURIComponent(
      t`I just joined ${name}. See the live fundraiser: ${projectUrl}`,
    )
    const twitterUrl = `https://twitter.com/intent/tweet?url=${twitterMsg}`

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
      cancelText={t`Cancel`}
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
