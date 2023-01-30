import { PlusCircleOutlined } from '@ant-design/icons'
import { Divider } from 'antd'
import { useModal } from 'hooks/Modal'
import { FormItemInput } from 'models/formItemInput'
import { createContext, useCallback, useContext, useState } from 'react'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import { CreateButton } from 'components/CreateButton'
import { AddEditRewardModal } from './AddEditRewardModal'
import { useRewards } from './hooks'
import { RewardItem } from './RewardItem'
import { Reward } from './types'

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

type RewardsListProps = FormItemInput<Reward[]> & {
  allowCreate?: boolean
}

interface RewardsListChildrenExports {
  Item: typeof RewardItem
  useRewardsInstance: typeof useRewardsInstance
}

export const RewardsList: React.FC<RewardsListProps> &
  RewardsListChildrenExports = ({
  allowCreate = false,
  value,
  onChange,
}: RewardsListProps) => {
  const rewardsHook = useRewards({ value, onChange })
  const [selectedReward, setSelectedReward] = useState<Reward>()
  const modal = useModal()
  const { rewards, upsertReward, removeReward } = rewardsHook

  const onModalOk = useCallback(
    (reward: Reward) => {
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
            {rewards
              .sort((a, b) => a.minimumContribution - b.minimumContribution)
              .map((reward, i) => (
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
            Add NFT
          </CreateButton>
        )}
      </div>
      <AddEditRewardModal
        open={modal.visible}
        editingData={selectedReward}
        onOk={onModalOk}
        onCancel={onModalCancel}
      />
    </RewardsListContext.Provider>
  )
}

RewardsList.Item = RewardItem
RewardsList.useRewardsInstance = useRewardsInstance
