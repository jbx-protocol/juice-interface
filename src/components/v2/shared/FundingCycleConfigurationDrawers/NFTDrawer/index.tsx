import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import NFTRewardTierModal from 'components/v2/shared/FundingCycleConfigurationDrawers/NFTDrawer/NFTRewardTierModal'
import { ThemeContext } from 'contexts/themeContext'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { NFTRewardTier } from 'models/v2/nftRewardTier'
import { useCallback, useContext, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import useNFTRewardsToIPFS from 'hooks/v2/nftRewards/NFTRewardsToIPFS'

import { shadowCard } from 'constants/styles/shadowCard'

import FundingCycleDrawer from '../FundingCycleDrawer'
import NFTRewardTierCard from './NFTRewardTierCard'

export const NFT_REWARDS_EXPLAINATION: JSX.Element = (
  <Trans>
    Reward contributors with NFTs when they meet your configured funding
    criteria.
  </Trans>
)

export default function NFTDrawer({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const {
    theme,
    theme: { colors },
  } = useContext(ThemeContext)
  const dispatch = useAppDispatch()
  const { nftRewardTiers } = useAppSelector(state => state.editingV2Project)

  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [rewardTiers, setRewardTiers] = useState<NFTRewardTier[]>(
    nftRewardTiers ?? [],
  )

  const onNftFormSaved = useCallback(async () => {
    setSubmitLoading(true)
    // Calls cloud function to store NFTRewards to IPFS
    const cid = await useNFTRewardsToIPFS(rewardTiers)
    dispatch(editingV2ProjectActions.setNftRewardTiers(rewardTiers))
    // Store cid (link to nfts on IPFS) to be used later in the deploy tx
    dispatch(editingV2ProjectActions.setNftRewardsCid(cid))
    setSubmitLoading(false)
    onClose?.()
  }, [rewardTiers, dispatch, onClose])

  const handleAddRewardTier = (newRewardTier: NFTRewardTier) => {
    setRewardTiers([...rewardTiers, newRewardTier])
  }

  const handleEditRewardTier = ({
    index,
    newRewardTier,
  }: {
    index: number
    newRewardTier: NFTRewardTier
  }) => {
    return rewardTiers.map((tier, i) =>
      i === index
        ? {
            ...tier,
            ...newRewardTier,
          }
        : tier,
    )
  }

  const handleDeleteRewardTier = (tierIndex: number) => {
    setRewardTiers([
      ...rewardTiers.slice(0, tierIndex),
      ...rewardTiers.slice(tierIndex + 1),
    ])
  }

  return (
    <>
      <FundingCycleDrawer
        title={t`NFT rewards`}
        visible={visible}
        onClose={onClose}
      >
        <div
          style={{
            padding: '2rem',
            marginBottom: 10,
            ...shadowCard(theme),
            color: colors.text.primary,
          }}
        >
          <p>{NFT_REWARDS_EXPLAINATION}</p>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {rewardTiers.map((rewardTier, index) => (
              <NFTRewardTierCard
                key={index}
                rewardTier={rewardTier}
                onChange={newRewardTier =>
                  handleEditRewardTier({ newRewardTier, index })
                }
                onDelete={() => handleDeleteRewardTier(index)}
              />
            ))}
          </Space>
          <Button
            type="dashed"
            onClick={() => {
              setAddTierModalVisible(true)
            }}
            style={{ marginTop: 15 }}
            block
          >
            <Trans>Add reward tier</Trans>
          </Button>
        </div>
        <Button
          onClick={onNftFormSaved}
          htmlType="submit"
          type="primary"
          loading={submitLoading}
          style={{ marginTop: 30 }}
        >
          <span>
            <Trans>Save NFT rewards</Trans>
          </span>
        </Button>
      </FundingCycleDrawer>
      <NFTRewardTierModal
        visible={addTierModalVisible}
        onChange={handleAddRewardTier}
        mode="Add"
        onClose={() => setAddTierModalVisible(false)}
        isCreate
      />
    </>
  )
}
