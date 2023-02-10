import { t } from '@lingui/macro'
import { Form, FormInstance, FormProps, Input } from 'antd'
import Loading from 'components/Loading'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { useNftCollectionMetadata } from 'hooks/JB721Delegate/NftCollectionMetadata'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
} from 'utils/nftRewards'

import { MarketplaceFormFields } from './formFields'

export function NftCollectionDetailsForm({
  form,
  onFormUpdated,
  isReconfigure,
  ...props
}: {
  form: FormInstance<MarketplaceFormFields>
  onFormUpdated?: (updated: boolean) => void
  isReconfigure?: boolean
} & FormProps) {
  const {
    nftRewards: {
      collectionMetadata: { name, description, symbol },
    },
    projectMetadata,
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
  const initialValues = useMemo(() => {
    return {
      collectionName:
        name ??
        collectionMetadata?.name ??
        defaultNftCollectionName(projectMetadata.name!),
      collectionDescription:
        description ??
        collectionMetadata?.description ??
        defaultNftCollectionDescription(projectMetadata.name!),
      collectionSymbol: symbol ?? collectionMetadata?.symbol,
    }
  }, [name, description, symbol, collectionMetadata, projectMetadata.name])

  const handleFormChange = useCallback(() => {
    const hasUpdated =
      initialValues.collectionName !== form.getFieldValue('collectionName') ||
      initialValues.collectionDescription !==
        form.getFieldValue('collectionDescription') ||
      initialValues.collectionSymbol !== form.getFieldValue('collectionSymbol')
    onFormUpdated?.(hasUpdated)
  }, [form, initialValues, onFormUpdated])

  useEffect(() => handleFormChange(), [handleFormChange])

  if (isLoading) return <Loading />

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onValuesChange={handleFormChange}
      {...props}
    >
      <Form.Item name="collectionName" label={t`Collection name`} required>
        <Input type="string" autoComplete="off" />
      </Form.Item>
      {!isReconfigure ? (
        <Form.Item
          name="collectionSymbol"
          label={t`Collection symbol`}
          required
        >
          <Input type="string" autoComplete="off" />
        </Form.Item>
      ) : null}
      <Form.Item name="collectionDescription" label={t`Collection description`}>
        <Input type="string" autoComplete="off" />
      </Form.Item>
    </Form>
  )
}
