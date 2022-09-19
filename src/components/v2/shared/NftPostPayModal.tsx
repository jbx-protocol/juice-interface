import { t } from '@lingui/macro'
import Modal from 'antd/lib/modal/Modal'
import { NftPostPayModalConfig } from 'models/nftRewardTier'
import { withHttps } from 'utils/externalLink'
import { windowOpen } from 'utils/windowUtils'

export function NftPostPayModal({
  visible,
  config,
  onClose,
}: {
  visible: boolean
  config: NftPostPayModalConfig
  onClose: VoidFunction
}) {
  const onOk = () => {
    if (config.ctaLink) {
      windowOpen(config.ctaLink)
    } else {
      onClose()
    }
  }
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      onOk={onOk}
      title={t`NFT mint confirmed`}
      okButtonProps={{
        href: withHttps(config.ctaLink),
        target: '_blank',
      }}
      cancelButtonProps={{
        hidden: true,
      }}
      okText={config.ctaText}
      destroyOnClose
    >
      {config.content}
    </Modal>
  )
}
