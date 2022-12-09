import { t, Trans } from '@lingui/macro'
import { Descriptions, Space } from 'antd'
import SectionHeader from 'components/SectionHeader'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useNftAccountBalance } from 'hooks/JB721Delegate/contractReader/NftAccountBalance'
import { useWallet } from 'hooks/Wallet'
import { CSSProperties, useContext } from 'react'

const labelStyle: CSSProperties = {
  width: '10.5rem',
}
const contentStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 5,
  justifyContent: 'space-between',
  width: '10.5rem',
}

export function ManageNftsSection() {
  const { isConnected, userAddress } = useWallet()
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const { data: nfts, isLoading } = useNftAccountBalance({
    accountAddress: userAddress,
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  const nftBalanceFormatted = nfts?.length ?? 0

  // hide section when wallet not connected
  if (!isConnected || isLoading) return null

  return (
    <>
      <Space direction="vertical">
        <SectionHeader text={<Trans>NFTs</Trans>} />

        <Descriptions layout="horizontal" column={1}>
          <Descriptions.Item
            label={t`Your NFTs`}
            labelStyle={labelStyle}
            contentStyle={contentStyle}
          >
            <div>
              <Trans>{nftBalanceFormatted} NFTs</Trans>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </>
  )
}
