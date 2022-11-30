import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, Image, Row, Tooltip } from 'antd'
import { VeNftVariant } from 'models/veNft'
import { useState } from 'react'
import { classNames } from 'utils/classNames'
import { truncateLongNumber } from 'utils/format/formatNumber'
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
        className="flex w-full cursor-pointer border border-solid border-smoke-200 bg-smoke-25 py-4 pr-2 pl-5 dark:border-grey-600 dark:bg-slate-800"
        onClick={() => setEditTierModalVisible(true)}
      >
        <Col className="flex flex-col justify-center" md={16}>
          <Row className="flex w-full items-center text-base">
            <Col className="text-haze-400 dark:text-haze-300" md={7}>
              {tokensStakedLabel()}
            </Col>
            <Col className="flex font-medium" md={15}>
              <span>{variant.name}</span>
            </Col>
          </Row>
        </Col>
        <Col className="flex items-center justify-center" md={5}>
          {imageLoading ? <LoadingOutlined className="text-3xl" /> : null}
          <Image
            className={classNames(
              'max-w-[90px] object-cover',
              imageLoading ? 'hidden' : '',
            )}
            src={variant.imageUrl}
            alt={variant.name}
            height={'60px'}
            onLoad={() => setImageLoading(false)}
            onClick={e => e.stopPropagation()}
          />
        </Col>
        <Col md={3}>
          <Tooltip title={<Trans>Delete NFT</Trans>}>
            <Button
              className="float-right h-4"
              type="text"
              onClick={e => {
                onDelete()
                // prevent opening modal
                e.stopPropagation()
              }}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Col>
      </Row>
      <VeNftRewardTierModal
        id={variant.id}
        open={editTierModalVisible}
        variant={variant}
        mode="Edit"
        onClose={() => setEditTierModalVisible(false)}
        onChange={onChange}
      />
    </>
  )
}
