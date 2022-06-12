import { t } from '@lingui/macro'
import { Col, Modal, Row, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

type AttachableBanny = {
  url: string
  alt: string
}

const ATTACHABLE_BANNYS: AttachableBanny[] = [
  { url: '/assets/banny_eth.png', alt: 'Blockchain Banny' },
  { url: '/assets/banny_love.png', alt: 'Banny in love' },
  { url: '/assets/banny_party.png', alt: 'Party banny' },
  { url: '/assets/banny_popcorn.png', alt: 'Popcorn banny' },
  { url: '/assets/quint.gif', alt: 'Quint' },
  { url: '/assets/stoned_banny.png', alt: 'Stoned banny' },
]

export default function BannyAttachModal({
  visible,
  onBannySelected,
  onClose,
}: {
  visible: boolean
  onBannySelected: (url: string) => void
  onClose: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [selectedBannyIndex, setSelectedBannyIndex] = useState<number>()
  const renderAttachableBanny = (banny: AttachableBanny, index: number) => {
    return (
      <Col md={8}>
        <div
          style={{
            backgroundColor:
              selectedBannyIndex === index ? colors.background.l2 : 'unset',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'middle',
            padding: '20px 0',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedBannyIndex(index)}
        >
          <img src={banny.url} alt={banny.alt} height="75px" />
        </div>
      </Col>
    )
  }
  return (
    <Modal
      title={t`Attach a sticker`}
      visible={visible}
      onCancel={onClose}
      onOk={() => {
        if (selectedBannyIndex !== undefined) {
          onBannySelected(ATTACHABLE_BANNYS[selectedBannyIndex].url)
        }
        onClose()
      }}
      okText={t`Attach`}
      okButtonProps={{ disabled: selectedBannyIndex === undefined }}
      cancelText={t`Cancel`}
      centered
    >
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Row style={{ width: '100%' }}>
          {ATTACHABLE_BANNYS.map(renderAttachableBanny)}
        </Row>
      </Space>
    </Modal>
  )
}
