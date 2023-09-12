import { t } from '@lingui/macro'
import { Tabs } from 'antd'
import { EditCollectionDetailsSection } from './EditCollectionDetailsSection'
import { EditNftsPostPaySection } from './EditNftsPostPaySection/EditNftsPostPaySection'
import { EditNftsSection } from './EditNftsSection'

export function UpdateNftsPage() {
  const items = [
    { label: t`NFTs`, key: 'nfts', children: <EditNftsSection /> },
    {
      label: t`Collection details`,
      key: 'collection',
      children: <EditCollectionDetailsSection />,
    },
    {
      label: t`Post-pay popup`,
      key: 'post-pay',
      children: <EditNftsPostPaySection />,
    },
  ]

  return <Tabs items={items} />
}
