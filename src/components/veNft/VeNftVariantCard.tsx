import { Button, Col, Image, Row, Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { VeNftVariant } from 'models/v2/veNft'

import VeNftRewardTierModal from './VeNftRewardTierModal'

export default function VeNftvariantCard({
  variant,
  nextVariant,
  onChange,
  onDelete,
}: {
  variant: VeNftVariant
  nextVariant?: VeNftVariant
  onChange: (variant: VeNftVariant) => void
  onDelete: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [editTierModalVisible, setEditTierModalVisible] =
    useState<boolean>(false)
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  const tokensStakedLabel = () => {
    if (nextVariant) {
      return `${variant.tokensStakedMin} - ${nextVariant.tokensStakedMin - 1}`
    }
    return `${variant.tokensStakedMin}+`
  }

  if (!variant) return null
  return (
    <>
      <Row
        style={{
          background: colors.background.l0,
          border: `1px solid ${colors.stroke.tertiary}`,
          display: 'flex',
          width: '100%',
          cursor: 'pointer',
          padding: '15px 8px 15px 20px',
        }}
        onClick={() => setEditTierModalVisible(true)}
      >
        <Col
          md={16}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Row
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 17,
              width: '100%',
            }}
          >
            <Col style={{ color: colors.text.action.primary }} md={7}>
              {tokensStakedLabel()}
            </Col>
            <Col style={{ display: 'flex', fontWeight: 500 }} md={15}>
              <span>{variant.name}</span>
            </Col>
          </Row>
        </Col>
        <Col
          md={5}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {imageLoading ? (
            <LoadingOutlined style={{ fontSize: '30px' }} />
          ) : null}
          <Image
            src={variant.imageUrl}
            alt={variant.name}
            height={'90px'}
            style={{
              display: imageLoading ? 'none' : 'unset',
              objectFit: 'cover',
              maxWidth: '90px',
            }}
            onLoad={() => setImageLoading(false)}
            onClick={e => e.stopPropagation()}
          />
        </Col>
        <Col md={3}>
          <Tooltip title={<Trans>Delete NFT</Trans>}>
            <Button
              type="text"
              onClick={e => {
                onDelete()
                // prevent opening modal
                e.stopPropagation()
              }}
              icon={<DeleteOutlined />}
              style={{ height: 16, float: 'right' }}
            />
          </Tooltip>
        </Col>
      </Row>
      <VeNftRewardTierModal
        id={variant.id}
        visible={editTierModalVisible}
        variant={variant}
        mode="Edit"
        onClose={() => setEditTierModalVisible(false)}
        onChange={onChange}
      />
    </>
  )
}
