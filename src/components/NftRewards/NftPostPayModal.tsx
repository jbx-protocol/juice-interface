import { t } from '@lingui/macro'
import Modal from 'antd/lib/modal/Modal'
import { NftPostPayModalConfig } from 'models/nftRewardTier'
import { withHttps } from 'utils/externalLink'

export const NFT_PAYMENT_CONFIRMED_QUERY_PARAM = 'nft_s'

export function NftPostPayModal({
  open,
  config,
  onClose,
}: {
  open: boolean
  config: NftPostPayModalConfig
  onClose: VoidFunction
}) {
  const onOk = () => {
    if (!config.ctaLink) {
      onClose?.()
    }
  }
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onOk}
      title={t`NFT mint confirmed`}
      okButtonProps={{
        href: withHttps(config.ctaLink),
        target: '_blank',
        rel: 'noopener noreferrer',
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
