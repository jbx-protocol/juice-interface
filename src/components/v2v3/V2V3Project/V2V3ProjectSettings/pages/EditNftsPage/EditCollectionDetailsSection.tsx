import { Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import Loading from 'components/Loading'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useNftCollectionMetadata } from 'hooks/JB721Delegate/useNftCollectionMetadata'
import { useReconfigureNftCollectionMetadata } from 'hooks/v2v3/transactor/useReconfigureNftCollectionMetadata'
import { NftCollectionMetadata } from 'models/nftRewards'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { NftCollectionDetailsFormItems } from '../../../../shared/FundingCycleConfigurationDrawers/NftDrawer/shared/NftCollectionDetailsFormItems'
import { MarketplaceFormFields } from '../../../../shared/FundingCycleConfigurationDrawers/NftDrawer/shared/formFields'

const useCollectionDetailsForm = () => {
  const [form] = useForm<MarketplaceFormFields>()
  const {
    nftRewards: {
      collectionMetadata: { uri: collectionMetadataUri },
      governanceType,
    },
  } = useContext(NftRewardsContext)

  const { data: collectionMetadata, isLoading } = useNftCollectionMetadata(
    collectionMetadataUri,
  )

  const initialValues: MarketplaceFormFields = useMemo(() => {
    return {
      collectionName: collectionMetadata?.name ?? '',
      collectionDescription: collectionMetadata?.description ?? '',
      collectionSymbol: collectionMetadata?.symbol ?? '',
      onChainGovernance: governanceType,
    }
  }, [
    collectionMetadata?.name,
    collectionMetadata?.description,
    collectionMetadata?.symbol,
    governanceType,
  ])

  return { form, initialValues, isLoading }
}

export function EditCollectionDetailsSection() {
  const {
    form: marketplaceForm,
    initialValues,
    isLoading,
  } = useCollectionDetailsForm()
  const [formHasUpdated, setFormHasUpdated] = useState<boolean>()
  const [txLoading, setTxLoading] = useState<boolean>()

  const reconfigureNftCollectionMetadata = useReconfigureNftCollectionMetadata()

  const handleFormChange = useCallback(() => {
    const hasChanged = (name: string, initialValue: unknown) =>
      initialValue !== marketplaceForm.getFieldValue(name)
    const collectionNameChanged = hasChanged(
      'collectionName',
      initialValues.collectionName,
    )
    const collectionDescriptionChanged = hasChanged(
      'collectionDescription',
      initialValues.collectionDescription,
    )
    const collectionSymbolChanged = hasChanged(
      'collectionSymbol',
      initialValues.collectionSymbol,
    )
    const onchainGovernanceChanged = hasChanged(
      'onChainGovernance',
      initialValues.onChainGovernance,
    )

    const hasUpdated =
      collectionNameChanged ||
      collectionDescriptionChanged ||
      collectionSymbolChanged ||
      onchainGovernanceChanged

    setFormHasUpdated(hasUpdated)
  }, [marketplaceForm, initialValues, setFormHasUpdated])

  useEffect(() => handleFormChange(), [handleFormChange])

  const submitCollectionMetadata = async () => {
    setTxLoading(true)
    const newCollectionMetadata: NftCollectionMetadata = {
      name: marketplaceForm.getFieldValue('collectionName'),
      description: marketplaceForm.getFieldValue('collectionDescription'),
      symbol: marketplaceForm.getFieldValue('collectionSymbol'),
    }

    await reconfigureNftCollectionMetadata({
      ...newCollectionMetadata,
    })

    setTxLoading(false)
  }

  if (isLoading) return <Loading />

  return (
    <div className="flex flex-col gap-6">
      <Callout.Info
        className="text-primary bg-smoke-100 dark:bg-slate-500"
        transparent
      >
        <Trans>
          Changes to your collection details may not be reflected in some
          marketplaces (like Opensea). Contact the marketplace for support.
        </Trans>
      </Callout.Info>
      <Form
        layout="vertical"
        colon={false}
        form={marketplaceForm}
        initialValues={initialValues}
        onValuesChange={handleFormChange}
        onFinish={submitCollectionMetadata}
      >
        <NftCollectionDetailsFormItems isReconfigure />

        <Button
          loading={txLoading}
          disabled={!formHasUpdated}
          onClick={() => marketplaceForm.submit()}
          type="primary"
        >
          Save collection details
        </Button>
      </Form>
    </div>
  )
}
