import { t } from '@lingui/macro'
import { Form, Input } from 'antd'

export function NftCollectionDetailsFormItems({
  isReconfigure,
}: {
  isReconfigure?: boolean
}) {
  return (
    <>
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
    </>
  )
}
