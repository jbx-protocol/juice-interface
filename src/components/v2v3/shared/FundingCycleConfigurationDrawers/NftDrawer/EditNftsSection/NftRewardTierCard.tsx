import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Image, Statistic, Tooltip } from 'antd'
import Paragraph from 'components/Paragraph'
import { DEFAULT_NFT_MAX_SUPPLY } from 'contexts/NftRewards/NftRewards'
import { NftRewardTier } from 'models/nftRewardTier'
import { useState } from 'react'
import { classNames } from 'utils/classNames'
import NftRewardTierModal from './NftRewardTierModal/NftRewardTierModal'
import { NFT_IMAGE_SIDE_LENGTH } from './NftRewardTierModal/NftUpload'

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
      <div
        className="flex w-full cursor-pointer justify-between border border-solid border-smoke-200 bg-smoke-25 py-4 pr-2 pl-5 hover:border-smoke-400 dark:border-slate-200 dark:bg-slate-800 dark:hover:border-slate-100"
        onClick={() => setEditTierModalVisible(true)}
        role="button"
      >
        <div>
          <div className="mb-2 text-lg font-medium">{rewardTier.name}</div>
          <div className="mb-2 flex gap-8">
            <Statistic
              title={t`Minimum contribution`}
              valueRender={() => (
                <div className="text-base">
                  {rewardTier.contributionFloor} ETH
                </div>
              )}
            />
            {rewardTier?.maxSupply &&
              rewardTier?.maxSupply !== DEFAULT_NFT_MAX_SUPPLY && (
                <Statistic
                  title={t`Max. supply`}
                  valueRender={() => (
                    <div className="text-base">{rewardTier.maxSupply}</div>
                  )}
                ></Statistic>
              )}
          </div>
          {rewardTier.description && (
            <Paragraph
              description={rewardTier.description}
              characterLimit={74}
              className="mt-4 text-xs"
            />
          )}
        </div>
        <div className="flex">
          <div
            className={classNames(
              'flex items-center justify-center',
              imageLoading ? 'h-24 w-24' : '',
            )}
          >
            {imageLoading ? <LoadingOutlined className="text-3xl" /> : null}
            <Image
              className={classNames(
                'object-cover',
                imageLoading ? 'hidden' : '',
              )}
              src={rewardTier.fileUrl}
              alt={rewardTier.name}
              height={imageLoading ? 0 : NFT_IMAGE_SIDE_LENGTH}
              width={imageLoading ? 0 : NFT_IMAGE_SIDE_LENGTH}
              onLoad={() => setImageLoading(false)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div>
            <Tooltip title={<Trans>Discontinue mints</Trans>}>
              <Button
                className="h-4"
                type="text"
                onClick={e => {
                  onDelete()
                  // prevent opening modal
                  e.stopPropagation()
                }}
                icon={<CloseOutlined />}
              />
            </Tooltip>
          </div>
        </div>
      </div>
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
