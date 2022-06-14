import { t } from '@lingui/macro'
import { Col, Modal, Row, Space } from 'antd'

type PaymentMemoSticker = {
  filepath: string
  alt: string
}

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
          <img src={sticker.filepath} alt={sticker.alt} height="75px" />
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
      <Space
        size="large"
        direction="vertical"
        style={{ width: '100%', maxHeight: '400px', overflowY: 'scroll' }}
      >
        <Row style={{ width: '100%' }}>
          {PAYMENT_MEMO_STICKERS.map((sticker, index) => (
            <AttachableSticker sticker={sticker} key={index} />
          ))}
        </Row>
      </Space>
    </Modal>
  )
}
