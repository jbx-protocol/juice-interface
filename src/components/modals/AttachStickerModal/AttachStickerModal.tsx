import { t } from '@lingui/macro'
import { Col, Modal, Row, Space } from 'antd'

import { AttachableSticker } from './AttachableSticker'
import { PaymentMemoSticker } from './paymentMemoSticker'

const PAYMENT_MEMO_STICKERS: PaymentMemoSticker[] = [
  {
    filepath: '/assets/stickers/banny_blockchain.png',
    alt: 'Blockchain Banny',
  },
  {
    filepath: '/assets/stickers/banny_coder.png',
    alt: 'Banny at computer smoking a blunt',
  },
  { filepath: '/assets/stickers/banny_dao.png', alt: 'Banny holding DAO sign' },
  { filepath: '/assets/stickers/banny_lfg.png', alt: 'Banny LFG' },
  { filepath: '/assets/stickers/banny_love.png', alt: 'Banny in love' },
  { filepath: '/assets/stickers/banny_party_2.png', alt: 'Banny celebrating' },
  { filepath: '/assets/stickers/banny_party.png', alt: 'Banny celebrating' },
  {
    filepath: '/assets/stickers/banny_popcorn.png',
    alt: 'Banny eating popcorn',
  },
  { filepath: '/assets/stickers/banny_shoes.png', alt: 'Banny with shoes' },
  { filepath: '/assets/stickers/banny_stoned.png', alt: 'Stoned banny' },
  { filepath: '/assets/stickers/banny_yes.png', alt: 'Stoned screaming "yes"' },
  { filepath: '/assets/quint.gif', alt: 'Quint' },
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
  return (
    <Modal
      title={t`Attach a sticker`}
      visible={visible}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelText={t`Cancel`}
      centered
    >
      <Space
        size="large"
        direction="vertical"
        style={{ width: '100%', maxHeight: '400px', overflowY: 'scroll' }}
      >
        <Row style={{ width: '100%' }}>
          {PAYMENT_MEMO_STICKERS.map((sticker, index) => (
            <Col md={8} key={index}>
              <AttachableSticker
                sticker={sticker}
                onClick={() => {
                  onSelect(sticker)
                  onClose()
                }}
              />
            </Col>
          ))}
        </Row>
      </Space>
    </Modal>
  )
}
