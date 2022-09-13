import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, Image, Row, Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { VeNftVariant } from 'models/v2/veNft'
import { useContext, useState } from 'react'

import { truncateLongNumber } from 'utils/formatNumber'

import VeNftRewardTierModal from './VeNftRewardTierModal'

export default function VeNftVariantCard({
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
      return `${truncateLongNumber(
        variant.tokensStakedMin,
        2,
      )} - ${truncateLongNumber(nextVariant.tokensStakedMin - 1, 2)}`
    }
    return `${truncateLongNumber(variant.tokensStakedMin, 2)}+`
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
            height={'60px'}
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
