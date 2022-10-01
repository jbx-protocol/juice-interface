import { t } from '@lingui/macro'
import { Form, FormInstance, Input } from 'antd'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useEffect, useMemo } from 'react'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
} from 'utils/nftRewards'

import { MarketplaceFormFields } from './formFields'

export function NftMarketplaceCustomizationForm({
  form,
  onFormUpdated,
}: {
  form: FormInstance<MarketplaceFormFields>
  onFormUpdated: (updated: boolean) => void
}) {
  const {
    nftRewards: {
      collectionMetadata: { name, description, symbol },
    },
    projectMetadata: { name: projectName },
  } = useAppSelector(state => state.editingV2Project)

  const initialValues = useMemo(
    () => ({
      collectionName: name,
      collectionDescription: description,
      collectionSymbol: symbol,
    }),
    [name, description, symbol],
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
      <Form.Item
        requiredMark="optional"
        name="collectionSymbol"
        label={t`Collection symbol`}
      >
        <Input type="string" autoComplete="off" />
      </Form.Item>
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
