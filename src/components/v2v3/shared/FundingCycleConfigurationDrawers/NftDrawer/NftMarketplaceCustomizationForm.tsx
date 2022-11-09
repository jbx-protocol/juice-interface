import { t } from '@lingui/macro'
import { Form, FormInstance, Input } from 'antd'
import Loading from 'components/Loading'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { useAppSelector } from 'hooks/AppSelector'
import { useNftCollectionMetadata } from 'hooks/NftCollectionMetadata'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
} from 'utils/nftRewards'

import { MarketplaceFormFields } from './formFields'

export function NftMarketplaceCustomizationForm({
  form,
  onFormUpdated,
  isReconfigure,
}: {
  form: FormInstance<MarketplaceFormFields>
  onFormUpdated: (updated: boolean) => void
  isReconfigure?: boolean
}) {
  const {
    nftRewards: {
      collectionMetadata: { name, description, symbol },
    },
    projectMetadata: { name: projectName },
  } = useAppSelector(state => state.editingV2Project)
  const {
    nftRewards: {
      collectionMetadata: { uri: collectionMetadataUri },
    },
  } = useContext(NftRewardsContext)

  const { data: collectionMetadata, isLoading } = useNftCollectionMetadata(
    collectionMetadataUri,
  )

  // tries from redux first (in case of saving without submitting and going back), if not
  // reads data based on current nft collection metadata uri
  const initialValues = useMemo(
    () => ({
      collectionName: name ?? collectionMetadata?.name,
      collectionDescription: description ?? collectionMetadata?.description,
      collectionSymbol: symbol ?? collectionMetadata?.symbol,
    }),
    [name, description, symbol, collectionMetadata],
  )

  const handleFormChange = useCallback(() => {
    const hasUpdated =
      initialValues.collectionName !== form.getFieldValue('collectionName') ||
      initialValues.collectionDescription !==
        form.getFieldValue('collectionDescription') ||
      initialValues.collectionSymbol !== form.getFieldValue('collectionSymbol')
    onFormUpdated(hasUpdated)
  }, [form, initialValues, onFormUpdated])

  useEffect(() => handleFormChange(), [handleFormChange])

  if (isLoading) return <Loading />

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onValuesChange={handleFormChange}
    >
      <Form.Item
        requiredMark="optional"
        name="collectionName"
        label={t`Collection name`}
      >
        <Input
          type="string"
          autoComplete="off"
          placeholder={defaultNftCollectionName(projectName)}
        />
      </Form.Item>
      {!isReconfigure ? (
        <Form.Item
          requiredMark="optional"
          name="collectionSymbol"
          label={t`Collection symbol`}
        >
          <Input type="string" autoComplete="off" />
        </Form.Item>
      ) : null}
      <Form.Item
        requiredMark="optional"
        name="collectionDescription"
        label={t`Collection description`}
      >
        <Input
          type="string"
          autoComplete="off"
          placeholder={defaultNftCollectionDescription(projectName)}
        />
      </Form.Item>
    </Form>
  )
}
