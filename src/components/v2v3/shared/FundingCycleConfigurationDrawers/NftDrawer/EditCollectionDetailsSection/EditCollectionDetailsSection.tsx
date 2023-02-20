import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import Loading from 'components/Loading'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftCollectionMetadata } from 'hooks/JB721Delegate/NftCollectionMetadata'
import { useReconfigureNftCollectionMetadata } from 'hooks/v2v3/transactor/ReconfigureNftCollectionMetadata'
import { NftCollectionMetadata } from 'models/nftRewardTier'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAppSelector } from 'redux/hooks/AppSelector'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
} from 'utils/nftRewards'
import { MarketplaceFormFields } from '../shared/formFields'
import { NftCollectionDetailsFormItems } from '../shared/NftCollectionDetailsFormItems'

export const useCollectionDetailsForm = () => {
  const [form] = useForm<MarketplaceFormFields>()
  const {
    nftRewards: {
      collectionMetadata: { name, description, symbol },
    },
    projectMetadata,
  } = useAppSelector(state => state.editingV2Project)
  const {
    nftRewards: {
      collectionMetadata: { uri: collectionMetadataUri },
      governanceType,
    },
  } = useContext(NftRewardsContext)

  const { data: collectionMetadata, isLoading } = useNftCollectionMetadata(
    collectionMetadataUri,
  )

  // tries from redux first (in case of saving without submitting and going back), if not
  // reads data based on current nft collection metadata uri
  const initialValues: MarketplaceFormFields = useMemo(() => {
    return {
      collectionName:
        name ??
        collectionMetadata?.name ??
        defaultNftCollectionName(projectMetadata.name!),
      collectionDescription:
        description ??
        collectionMetadata?.description ??
        defaultNftCollectionDescription(projectMetadata.name!),
      collectionSymbol: symbol ?? collectionMetadata?.symbol ?? '',
      onChainGovernance: governanceType,
    }
  }, [
    name,
    collectionMetadata?.name,
    collectionMetadata?.description,
    collectionMetadata?.symbol,
    projectMetadata.name,
    description,
    symbol,
    governanceType,
  ])

  return { form, initialValues, isLoading }
}

export function EditCollectionDetailsSection() {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const {
    form: marketplaceForm,
    initialValues,
    isLoading,
  } = useCollectionDetailsForm()
  const [formHasUpdated, setFormHasUpdated] = useState<boolean>()
  const [txLoading, setTxLoading] = useState<boolean>()

  const reconfigureNftCollectionMetadata = useReconfigureNftCollectionMetadata({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

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

  if (isLoading) return <Loading />

  return (
    <Space size="large" direction="vertical">
      <Callout.Info className="bg-smoke-100 dark:bg-slate-500" transparent>
        <Trans>
          Changes to your collection details may not be reflected in some
          marketplaces (for example, Opensea). Contact the marketplace for
          support.
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
    </Space>
  )
}
