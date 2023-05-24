import { t } from '@lingui/macro'
import { Col, Modal, Row } from 'antd'

import { AttachableSticker } from './AttachableSticker'
import { PaymentMemoSticker } from './paymentMemoSticker'

const PAYMENT_MEMO_STICKERS: PaymentMemoSticker[] = [
  {
    filepath: '/assets/images/stickers/banny_blockchain.png',
    alt: 'Blockchain Banny',
  },
  {
    filepath: '/assets/images/stickers/banny_coder.png',
    alt: 'Banny at computer smoking a blunt',
  },
  {
    filepath: '/assets/images/stickers/banny_dao.png',
    alt: 'Banny holding DAO sign',
  },
  { filepath: '/assets/images/stickers/banny_lfg.png', alt: 'Banny LFG' },
  { filepath: '/assets/images/stickers/banny_love.png', alt: 'Banny in love' },
  {
    filepath: '/assets/images/stickers/banny_party_2.png',
    alt: 'Banny celebrating',
  },
  {
    filepath: '/assets/images/stickers/banny_party.png',
    alt: 'Banny celebrating',
  },
  {
    filepath: '/assets/images/stickers/banny_popcorn.png',
    alt: 'Banny eating popcorn',
  },
  {
    filepath: '/assets/images/stickers/banny_shoes.png',
    alt: 'Banny with shoes',
  },
  { filepath: '/assets/images/stickers/banny_stoned.png', alt: 'Stoned banny' },
  {
    filepath: '/assets/images/stickers/banny_yes.png',
    alt: 'Stoned screaming "yes"',
  },
  { filepath: '/assets/images/quint.webp', alt: 'Quint' },
]

export function AttachStickerModal({
  open,
  onSelect,
  onClose,
}: {
  open: boolean
  onSelect: (sticker: PaymentMemoSticker) => void
  onClose: VoidFunction
}) {
  return (
    <Modal
      title={t`Attach a sticker`}
      open={open}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelText={t`Cancel`}
      centered
    >
      <div className="flex max-h-[400px] flex-col gap-6 overflow-y-scroll">
        <Row className="w-full">
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
      </div>
    </Modal>
  )
}
