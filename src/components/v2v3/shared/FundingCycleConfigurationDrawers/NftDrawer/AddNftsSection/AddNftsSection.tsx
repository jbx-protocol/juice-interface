import { t, Trans } from '@lingui/macro'
import { Button, Empty, Form } from 'antd'
import { RewardsList } from 'components/Create/components/RewardsList'

import { useCallback, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { useFundingCycleDrawer } from '../../hooks/FundingCycleDrawer'
import { NftCollectionDetailsFormItems } from '../shared/NftCollectionDetailsFormItems'
import { useAddNfts } from './hooks/AddNfts'
import { useSaveNewCollection } from './hooks/SaveNewCollection'

export function AddNftsSection({ onClose }: { onClose: VoidFunction }) {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const { setFormUpdated } = useFundingCycleDrawer(onClose)

  const { rewardTiers, marketplaceForm, postPayModalForm, setRewardTiers } =
    useAddNfts({ setFormUpdated })
  const saveNewCollection = useSaveNewCollection({
    rewardTiers,
    marketplaceForm,
    postPayModalForm,
  })

  const onNftFormSaved = useCallback(async () => {
    const collectionName = marketplaceForm.getFieldValue('collectionName')
    const collectionSymbol = marketplaceForm.getFieldValue('collectionSymbol')
    if (!rewardTiers || !collectionName || !collectionSymbol) {
      const message = !rewardTiers
        ? t`Add an NFT`
        : !collectionName
        ? t`Add a collection name`
        : t`Add a collection symbol`
      emitErrorNotification(message)
      return
    }

    setSubmitLoading(true)

    await saveNewCollection()

    setSubmitLoading(false)
    setFormUpdated(false)

    onClose?.()
  }, [rewardTiers, saveNewCollection, onClose, setFormUpdated, marketplaceForm])

  return (
    <>
      <p>
        <Trans>Reward supporters with NFTs when they pay your project.</Trans>
      </p>

      <div className="mb-8">
        <RewardsList
          value={rewardTiers}
          onChange={setRewardTiers}
          allowCreate
        />

        {rewardTiers?.length === 0 && (
          <Empty
            className="mb-0"
            description={t`No NFTs`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
      {/* Hack - this whole thing should be a form */}
      <Form
        layout="vertical"
        colon={false}
        form={marketplaceForm}
        className="mb-5"
      >
        <NftCollectionDetailsFormItems />
      </Form>

      <Button onClick={onNftFormSaved} type="primary" loading={submitLoading}>
        <span>
          <Trans>Save NFTs</Trans>
        </span>
      </Button>
    </>
  )
}
