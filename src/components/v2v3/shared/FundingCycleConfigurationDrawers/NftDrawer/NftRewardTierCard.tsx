import { CloseOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, Image, Row, Tooltip } from 'antd'
import Paragraph from 'components/Paragraph'
import { DEFAULT_NFT_MAX_SUPPLY } from 'hooks/JB721Delegate/NftRewards'
import { NftRewardTier } from 'models/nftRewardTier'
import { useState } from 'react'
import { classNames } from 'utils/classNames'
import NftRewardTierModal from './NftRewardTierModal'
import { NFT_IMAGE_SIDE_LENGTH } from './NftUpload'

export default function NftRewardTierCard({
  rewardTier,
  onChange,
  onDelete,
}: {
  rewardTier: NftRewardTier
  onChange: (rewardTier: NftRewardTier) => void
  onDelete: VoidFunction
}) {
  const [editTierModalVisible, setEditTierModalVisible] =
    useState<boolean>(false)
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  if (!rewardTier) return null

  return (
    <>
      <Row
        className="flex w-full cursor-pointer border border-solid border-smoke-200 bg-smoke-25 py-4 pr-2 pl-5 dark:border-grey-600 dark:bg-slate-800"
        onClick={() => setEditTierModalVisible(true)}
        gutter={8}
      >
        <Col className="flex flex-col justify-center" md={16}>
          <Row className="flex w-full items-center text-base">
            <Col className="text-haze-400 dark:text-haze-300" md={7}>
              {rewardTier.contributionFloor} ETH
            </Col>
            <Col className="flex font-medium" md={15}>
              <span>{rewardTier.name}</span>
              {rewardTier.externalLink ? (
                <a
                  className="dark:hovertext-haze-300 ml-2 text-black hover:text-haze-400 dark:text-slate-100"
                  href={rewardTier.externalLink}
                  onClick={e => e.stopPropagation()}
                >
                  <LinkOutlined />
                </a>
              ) : null}
            </Col>
          </Row>
          {rewardTier.description && (
            <div className="mt-4 text-xs">
              <Trans>
                <strong>Description:</strong>
                <Paragraph
                  description={rewardTier.description}
                  characterLimit={74}
                />
              </Trans>
            </div>
          )}
          {rewardTier.maxSupply &&
          rewardTier.maxSupply !== DEFAULT_NFT_MAX_SUPPLY ? (
            <div className="mt-4 text-xs">
              <Trans>
                <strong>Max. supply:</strong>{' '}
                <span>{rewardTier.maxSupply}</span>
              </Trans>
            </div>
          ) : null}
        </Col>
        <Col
          className={classNames(
            'flex items-center justify-center',
            imageLoading ? 'h-24 w-24' : '',
          )}
          md={5}
        >
          {imageLoading ? <LoadingOutlined className="text-3xl" /> : null}
          <Image
            className={classNames('object-cover', imageLoading ? 'hidden' : '')}
            src={rewardTier.fileUrl}
            alt={rewardTier.name}
            height={imageLoading ? 0 : NFT_IMAGE_SIDE_LENGTH}
            width={imageLoading ? 0 : NFT_IMAGE_SIDE_LENGTH}
            onLoad={() => setImageLoading(false)}
            onClick={e => e.stopPropagation()}
          />
        </Col>
        <Col md={3}>
          <Tooltip title={<Trans>Discontinue mints</Trans>}>
            <Button
              className="float-right h-4"
              type="text"
              onClick={e => {
                onDelete()
                // prevent opening modal
                e.stopPropagation()
              }}
              icon={<CloseOutlined />}
            />
          </Tooltip>
        </Col>
      </Row>
      <NftRewardTierModal
        open={editTierModalVisible}
        rewardTier={rewardTier}
        mode="Edit"
        onClose={() => setEditTierModalVisible(false)}
        onChange={onChange}
        isCreate
      />
    </>
  )
}
