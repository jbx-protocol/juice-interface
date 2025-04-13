import { t } from '@lingui/macro'
import { Tabs } from 'antd'
import { EditNftsSection } from './EditNftsSection'

export function UpdateNftsPage() {
  const items = [
    { label: t`NFTs`, key: 'nfts', children: <EditNftsSection /> },
    // {
    //   label: t`Collection details`,
    //   key: 'collection',
    //   children: <EditCollectionDetailsSection />,
    // },
  ]

  return <Tabs items={items} />
}
