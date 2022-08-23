import { PlusCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Empty, Form, Input, Space } from 'antd'
import NftRewardTierModal from 'components/v2/shared/FundingCycleConfigurationDrawers/NftDrawer/NftRewardTierModal'
import { ThemeContext } from 'contexts/themeContext'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'

import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useCallback, useContext, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { uploadNftRewardsToIPFS } from 'utils/ipfs'
import { sortNftRewardTiers } from 'utils/v2/nftRewards'

import { shadowCard } from 'constants/styles/shadowCard'

import FundingCycleDrawer from '../FundingCycleDrawer'
import NftRewardTierCard from './NftRewardTierCard'

export const NFT_REWARDS_EXPLAINATION: JSX.Element = (
  <Trans>
    Reward contributors with NFTs when they meet your configured funding
    criteria.
  </Trans>
)

export const MAX_NFT_REWARD_TIERS = 3

export default function NftDrawer({
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
  const {
    nftRewards: {
      rewardTiers: savedRewardTiers,
      collectionName: savedCollectionName,
      collectionSymbol: savedCollectionSymbol,
    },
  } = useAppSelector(state => state.editingV2Project)

  const [addTierModalVisible, setAddTierModalVisible] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [rewardTiers, setRewardTiers] = useState<NftRewardTier[]>(
    savedRewardTiers ?? [],
  )

  const [collectionName, setCollectionName] = useState<string | undefined>(
    savedCollectionName,
  )
  const [collectionSymbol, setCollectionSymbol] = useState<string | undefined>(
    savedCollectionSymbol,
  )

  const onNftFormSaved = useCallback(async () => {
    setSubmitLoading(true)
    // Calls cloud function to store NftRewards to IPFS
    const CIDs = await uploadNftRewardsToIPFS(rewardTiers)
    dispatch(editingV2ProjectActions.setNftRewardsName(collectionName))
    dispatch(editingV2ProjectActions.setNftRewardsSymbol(collectionSymbol))
    dispatch(editingV2ProjectActions.setNftRewardTiers(rewardTiers))
    // Store cid (link to nfts on IPFS) to be used later in the deploy tx
    dispatch(editingV2ProjectActions.setNftRewardsCIDs(CIDs))
    setSubmitLoading(false)
    onClose?.()
  }, [rewardTiers, dispatch, onClose, collectionSymbol, collectionName])

  const handleAddRewardTier = (newRewardTier: NftRewardTier) => {
    setRewardTiers(sortNftRewardTiers([...rewardTiers, newRewardTier]))
  }

  const handleEditRewardTier = ({
    index,
    newRewardTier,
  }: {
    index: number
    newRewardTier: NftRewardTier
  }) => {
    const newRewardTiers = rewardTiers.map((tier, i) =>
      i === index
        ? {
            ...tier,
            ...newRewardTier,
          }
        : tier,
    )
    setRewardTiers(newRewardTiers)
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
          <Form layout="vertical">
            <Form.Item
              requiredMark="optional"
              label={t`Collection name`}
              tooltip={t`Your collection's name will apply to the whole collection of reward tiers on NFT marketplaces (like OpenSea).`}
            >
              <Input
                type="string"
                value={collectionName}
                autoComplete="off"
                onChange={e => setCollectionName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              requiredMark="optional"
              label={t`Collection symbol`}
              tooltip={t`You collection's symbol will apply to the whole collection of reward tiers on NFT marketplaces (like OpenSea).`}
            >
              <Input
                type="string"
                value={collectionSymbol}
                autoComplete="off"
                onChange={e => setCollectionSymbol(e.target.value)}
              />
            </Form.Item>
          </Form>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {rewardTiers.map((rewardTier, index) => (
              <NftRewardTierCard
                key={index}
                rewardTier={rewardTier}
                onChange={newRewardTier =>
                  handleEditRewardTier({ newRewardTier, index })
                }
                onDelete={() => handleDeleteRewardTier(index)}
              />
            ))}
          </Space>

          {rewardTiers?.length === 0 && (
            <Empty
              description={t`No NFT reward tiers`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ marginBottom: 0 }}
            />
          )}

          <Button
            type="dashed"
            onClick={() => {
              setAddTierModalVisible(true)
            }}
            style={{ marginTop: 15 }}
            disabled={rewardTiers.length >= MAX_NFT_REWARD_TIERS}
            block
            icon={<PlusCircleOutlined />}
          >
            <span>
              <Trans>Add reward tier</Trans>
            </span>
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
      <NftRewardTierModal
        visible={addTierModalVisible}
        onChange={handleAddRewardTier}
        mode="Add"
        onClose={() => setAddTierModalVisible(false)}
        isCreate
      />
    </>
  )
}
