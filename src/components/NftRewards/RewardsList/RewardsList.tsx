import { PlusCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Divider } from 'antd'
import { CreateButton } from 'components/buttons/CreateButton/CreateButton'
import { MAX_NFT_REWARD_TIERS } from 'constants/nftRewards'
import { useModal } from 'hooks/useModal'
import { FormItemInput } from 'models/formItemInput'
import { NftRewardTier } from 'models/nftRewards'
import { createContext, useCallback, useContext, useState } from 'react'
import { sortNftsByContributionFloor } from 'utils/nftRewards'
import { AddEditRewardModal } from './AddEditRewardModal'
import { RewardItem } from './RewardItem'
import { useRewards } from './hooks/useRewards'

const RewardsListContext = createContext<ReturnType<typeof useRewards>>({
  rewards: [],
  addReward: () => {
    console.error('RewardsListContext.addReward called but no provider set')
  },
  removeReward: () => {
    console.error('RewardsListContext.removeReward called but no provider set')
  },
  upsertReward: () => {
    console.error('RewardsListContext.upsertReward called but no provider set')
  },
})

const useRewardsInstance = () => {
  return useContext(RewardsListContext)
}

type RewardsListProps = FormItemInput<NftRewardTier[]> & {
  allowCreate?: boolean
  withEditWarning?: boolean
}

interface RewardsListChildrenExports {
  Item: typeof RewardItem
  useRewardsInstance: typeof useRewardsInstance
}

export const RewardsList: React.FC<React.PropsWithChildren<RewardsListProps>> &
  RewardsListChildrenExports = ({
  allowCreate = false,
  value,
  onChange,
  withEditWarning,
}: RewardsListProps) => {
  const rewardsHook = useRewards({ value, onChange })
  const [selectedReward, setSelectedReward] = useState<NftRewardTier>()
  const modal = useModal()
  const { rewards, upsertReward, removeReward } = rewardsHook
  const onModalOk = useCallback(
    (reward: NftRewardTier) => {
      upsertReward(reward)
      modal.close()
      setSelectedReward(undefined)
    },
    [modal, upsertReward],
  )

  const onModalCancel = useCallback(() => {
    modal.close()
    setSelectedReward(undefined)
  }, [modal])

  // returns true only when a allowCreate is true and is not the last item
  const shouldRenderNftDivider = useCallback(
    (index: number) => allowCreate || index !== rewards.length - 1,
    [allowCreate, rewards],
  )

  return (
    <RewardsListContext.Provider value={rewardsHook}>
      <div className="flex flex-col gap-12">
        {!!rewards.length && (
          <>
            {sortNftsByContributionFloor(rewards).map((reward, i) => (
              <div key={reward.id}>
                <RewardItem
                  reward={reward}
                  onEditClicked={() => {
                    setSelectedReward(reward)
                    modal.open()
                  }}
                  onDeleteClicked={() => {
                    removeReward(reward.id)
                  }}
                />
                {shouldRenderNftDivider(i) ? (
                  <Divider className="m-0 mt-12" />
                ) : null}
              </div>
            ))}
          </>
        )}
        {allowCreate && (
          <CreateButton
            icon={<PlusCircleOutlined />}
            className="h-24"
            disabled={rewards.length >= MAX_NFT_REWARD_TIERS}
            onClick={modal.open}
          >
            <span>
              <Trans>Add NFT</Trans>
            </span>
          </CreateButton>
        )}
      </div>
      <AddEditRewardModal
        open={modal.visible}
        editingData={selectedReward}
        onOk={onModalOk}
        onCancel={onModalCancel}
        withEditWarning={withEditWarning}
      />
    </RewardsListContext.Provider>
  )
}

RewardsList.Item = RewardItem
RewardsList.useRewardsInstance = useRewardsInstance
