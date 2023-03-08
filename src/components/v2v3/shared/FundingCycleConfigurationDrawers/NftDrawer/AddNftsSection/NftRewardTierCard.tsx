import { CloseOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Statistic, Tooltip } from 'antd'
import { AddEditRewardModal } from 'components/Create/components/RewardsList/AddEditRewardModal'
import { JuiceVideoThumbnailOrImage } from 'components/NftRewards/NftVideo/JuiceVideoThumbnailOrImage'
import Paragraph from 'components/Paragraph'
import { DEFAULT_NFT_MAX_SUPPLY } from 'contexts/NftRewards/NftRewards'
import { NftRewardTier } from 'models/nftRewards'
import { useState } from 'react'

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

  if (!rewardTier) return null

  return (
    <>
      <div
        className="flex w-full cursor-pointer justify-between border border-solid border-smoke-200 bg-smoke-25 py-4 pr-2 pl-5 hover:border-smoke-400 dark:border-slate-200 dark:bg-slate-800 dark:hover:border-slate-100"
        onClick={() => setEditTierModalVisible(true)}
        role="button"
      >
        <div>
          <div className="text-primary mb-2 text-lg font-medium">
            {rewardTier.name}
          </div>
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
              className="text-primary mt-4 text-xs"
            />
          )}
        </div>
        <div className="flex">
          <JuiceVideoThumbnailOrImage
            src={rewardTier.fileUrl}
            alt={rewardTier.name}
            heightClass="h-24"
            widthClass="w-24"
          />
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
      <AddEditRewardModal
        open={editTierModalVisible}
        editingData={rewardTier}
        onOk={(reward: NftRewardTier) => {
          setEditTierModalVisible(false)
          onChange(reward)
        }}
        onCancel={() => setEditTierModalVisible(false)}
      />
    </>
  )
}
