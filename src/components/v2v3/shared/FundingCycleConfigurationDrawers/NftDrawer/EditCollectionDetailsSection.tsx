import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useReconfigureNftCollectionMetadata } from 'hooks/v2v3/transactor/ReconfigureNftCollectionMetadata'
import { NftCollectionMetadata } from 'models/nftRewardTier'
import { useContext, useState } from 'react'
import { MarketplaceFormFields } from './formFields'
import { NftCollectionDetailsForm } from './NftCollectionDetailsForm'

export function EditCollectionDetailsSection() {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const [formHasUpdated, setFormHasUpdated] = useState<boolean>()
  const [txLoading, setTxLoading] = useState<boolean>()
  const [marketplaceForm] = useForm<MarketplaceFormFields>()

  const reconfigureNftCollectionMetadata = useReconfigureNftCollectionMetadata({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  const submitCollectionMetadata = async () => {
    if (!fundingCycleMetadata?.dataSource) return
    setTxLoading(true)
    const newCollectionMetadata: NftCollectionMetadata = {
      name: marketplaceForm.getFieldValue('collectionName'),
      description: marketplaceForm.getFieldValue('collectionDescription'),
      symbol: marketplaceForm.getFieldValue('collectionSymbol'),
    }

    await reconfigureNftCollectionMetadata({
      ...newCollectionMetadata,
      dataSource: fundingCycleMetadata?.dataSource,
    })

    setTxLoading(false)
  }

  return (
    <Space size="large" direction="vertical">
      <Callout.Info className="dark:bg-slate-500" transparent>
        <Trans>
          Changes to your collection details may not be reflected in some
          marketplaces (for example, Opensea). Contact the marketplace for
          support.
        </Trans>
      </Callout.Info>
      <NftCollectionDetailsForm
        form={marketplaceForm}
        onFormUpdated={() => setFormHasUpdated(true)}
        isReconfigure
        onFinish={submitCollectionMetadata}
      />

      <Button
        loading={txLoading}
        disabled={!formHasUpdated}
        onClick={() => marketplaceForm.submit()}
        type="primary"
      >
        Save collection details
      </Button>
    </Space>
  )
}
