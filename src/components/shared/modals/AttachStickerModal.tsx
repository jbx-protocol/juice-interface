import { t } from '@lingui/macro'
import { Col, Modal, Row, Space } from 'antd'

type PaymentMemoSticker = {
  url: string
  alt: string
}

const PAYMENT_MEMO_STICKERS: PaymentMemoSticker[] = [
  { url: '/assets/banny_eth.png', alt: 'Blockchain Banny' },
  { url: '/assets/banny_love.png', alt: 'Banny in love' },
  { url: '/assets/banny_party.png', alt: 'Party banny' },
  { url: '/assets/banny_popcorn.png', alt: 'Popcorn banny' },
  { url: '/assets/quint.gif', alt: 'Quint' },
  { url: '/assets/stoned_banny.png', alt: 'Stoned banny' },
]

export function AttachStickerModal({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean
  onSelect: (sticker: PaymentMemoSticker) => void
  onClose: VoidFunction
}) {
  function AttachableSticker({ sticker }: { sticker: PaymentMemoSticker }) {
    return (
      <Col md={8}>
        <div
          role="button"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'middle',
            padding: '20px 0',
            cursor: 'pointer',
          }}
          className="hover-bg-l2"
          onClick={() => {
            onSelect(sticker)
            onClose()
          }}
        >
          <img src={sticker.url} alt={sticker.alt} height="75px" />
        </div>
      </Col>
    )
  }

  return (
    <Modal
      title={t`Attach a sticker`}
      visible={visible}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelText={t`Cancel`}
      centered
    >
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Row style={{ width: '100%' }}>
          {PAYMENT_MEMO_STICKERS.map((sticker, index) => (
            <AttachableSticker sticker={sticker} key={index} />
          ))}
        </Row>
      </Space>
    </Modal>
  )
}
