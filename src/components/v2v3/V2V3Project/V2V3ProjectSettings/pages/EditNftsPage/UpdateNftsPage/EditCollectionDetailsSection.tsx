import { Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout/Callout'
import Loading from 'components/Loading'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useNftCollectionMetadata } from 'hooks/JB721Delegate/useNftCollectionMetadata'
import { useReconfigureNftCollectionMetadata } from 'hooks/v2v3/transactor/useReconfigureNftCollectionMetadata'
import { NftCollectionMetadata } from 'models/nftRewards'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { NftCollectionDetailsFormItems } from './NftCollectionDetailsFormItems'
import { MarketplaceFormFields } from './formFields'

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
  const [txSuccessful, setTxSuccessful] = useState<boolean>()
  const [txFailed, setTxFailed] = useState<boolean>()

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

    const hasUpdated =
      collectionNameChanged ||
      collectionDescriptionChanged ||
      collectionSymbolChanged

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

    const txOpts = {
      onConfirmed() {
        setTxLoading(false)
        setTxSuccessful(true)
      },
    }

    const txSuccess = await reconfigureNftCollectionMetadata(
      {
        ...newCollectionMetadata,
      },
      txOpts,
    )

    if (!txSuccess) {
      setTxFailed(true)
      setTxLoading(false)
    }
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
        <div className="flex items-center gap-2">
          <Button
            loading={txLoading}
            disabled={!formHasUpdated}
            onClick={() => marketplaceForm.submit()}
            type="primary"
            className="grow-0"
          >
            <Trans>Save collection details</Trans>
          </Button>
          {txSuccessful ? (
            <span className="text-success-500">
              <Trans>Saved!</Trans>
            </span>
          ) : txFailed ? (
            <span className="text-error-500">
              <Trans>Something went wrong!</Trans>
            </span>
          ) : null}
        </div>
      </Form>
    </div>
  )
}
