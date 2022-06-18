import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import NFTRewardTierModal from 'components/v2/shared/FundingCycleConfigurationDrawers/NFTDrawer/NFTRewardTierModal'
import { ThemeContext } from 'contexts/themeContext'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { NFTRewardTier } from 'models/v2/nftRewardTier'
import { useCallback, useContext, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { shadowCard } from 'constants/styles/shadowCard'

import FundingCycleDrawer from '../FundingCycleDrawer'
import NFTRewardTiers from './NFTRewardTiers'

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

  const [rewardTiers, setRewardTiers] = useState<NFTRewardTier[]>(
    nftRewardTiers ?? [],
  )

  /**
   * NOTE: these values will all be in their 'native' units,
   * e.g. permyriads, parts-per-billion etc.
   *
   * We will convert these to percentages to pass as
   * props later on.
   */

  const onNftFormSaved = useCallback(async () => {
    /**
     * NOTE: all values dispatched to Redux should be in their 'native' units,
     * e.g. permyriads, parts-per-billion etc.
     * and NOT percentages.
     */
    // TODO call cloud function
    // nftTiers = {}
    // cid = cloudFunction(nftTiers)
    dispatch(editingV2ProjectActions.setNftRewardTiers(rewardTiers))
    // dispatch(editingV2ProjectActions.setNftRewardsCid(cid))

    onClose?.()
  }, [rewardTiers, dispatch, onClose])

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
          <p>
            <Trans>
              Encourage treasury contributions by offering a reward NFT to
              people who contribute above a certain threshold.
            </Trans>
          </p>
          <NFTRewardTiers
            rewardTiers={rewardTiers}
            setRewardTiers={setRewardTiers}
          />
          <Button
            type="dashed"
            onClick={() => {
              setAddTierModalVisible(true)
            }}
            style={{ marginTop: 15 }}
            block
          >
            <Trans>Add tier</Trans>
          </Button>
        </div>
        <Button
          onClick={onNftFormSaved}
          htmlType="submit"
          type="primary"
          style={{ marginTop: 30 }}
        >
          <Trans>Save NFT rewards</Trans>
        </Button>
      </FundingCycleDrawer>
      <NFTRewardTierModal
        visible={addTierModalVisible}
        rewardTiers={rewardTiers}
        setRewardTiers={setRewardTiers}
        mode="Add"
        onClose={() => setAddTierModalVisible(false)}
        isCreate
      />
    </>
  )
}
