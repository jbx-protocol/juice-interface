import { t } from '@lingui/macro'
import { Form, FormInstance, Input } from 'antd'
import { useAppSelector } from 'hooks/AppSelector'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
} from 'utils/nftRewards'

import { MarketplaceFormFields } from './formFields'

export function NftMarketplaceCustomizationForm({
  form,
}: {
  form: FormInstance<MarketplaceFormFields>
}) {
  const {
    nftRewards: {
      collectionMetadata: { name, description, symbol },
    },
    projectMetadata: { name: projectName },
  } = useAppSelector(state => state.editingV2Project)

  const initialValues = {
    collectionName: name,
    collectionDescription: description,
    collectionSymbol: symbol,
  }
  return (
    <Form layout="vertical" form={form} initialValues={initialValues}>
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
