import { t } from '@lingui/macro'
import { Tabs } from 'antd'
import { EditCollectionDetailsSection } from './EditCollectionDetailsSection'
import { EditNftsSection } from './EditNftsSection'

export function EditNftsTabs() {
  const items = [
    { label: t`NFTs`, key: 'nfts', children: <EditNftsSection /> },
    {
      label: t`Collection details`,
      key: 'collection',
      children: <EditCollectionDetailsSection />,
    },
    // TODO: add advanced tab
  ]

  return <Tabs items={items} />
}
