import { plural, t, Trans } from '@lingui/macro'
import { Button, Descriptions, Space } from 'antd'
import SectionHeader from 'components/SectionHeader'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftAccountBalance } from 'hooks/JB721Delegate/NftAccountBalance'
import { useWallet } from 'hooks/Wallet'
import { CSSProperties, useContext, useState } from 'react'
import { RedeemNftsModal } from './RedeemNftsModal'

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
  const { userAddress } = useWallet()
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const [redeemNftsModalVisible, setRedeemNftsModalVisible] =
    useState<boolean>(false)
  const { data: nfts, isLoading } = useNftAccountBalance({
    accountAddress: userAddress,
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  const nftBalanceFormatted = nfts?.length ?? 0
  const nftRedeemAllowed =
    fundingCycleMetadata?.useDataSourceForRedeem && nftBalanceFormatted > 0

  if (isLoading) return null

  return (
    <>
      <Space direction="vertical">
        <SectionHeader className="mb-0" text={<Trans>NFTs</Trans>} />

        <Descriptions layout="horizontal" column={1}>
          <Descriptions.Item
            label={t`Your NFTs`}
            labelStyle={labelStyle}
            contentStyle={contentStyle}
            className="pb-0"
          >
            <div>
              {nftBalanceFormatted}{' '}
              {plural(nftBalanceFormatted, {
                one: 'NFT',
                other: 'NFTs',
              })}
            </div>
            {nftRedeemAllowed ? (
              <div>
                <Button
                  size="small"
                  onClick={() => {
                    setRedeemNftsModalVisible(true)
                  }}
                >
                  <Trans>Redeem for ETH</Trans>
                </Button>
              </div>
            ) : null}
          </Descriptions.Item>
        </Descriptions>
      </Space>
      {nftRedeemAllowed && (
        <RedeemNftsModal
          open={redeemNftsModalVisible}
          onCancel={() => setRedeemNftsModalVisible(false)}
          onConfirmed={() => setRedeemNftsModalVisible(false)}
        />
      )}
    </>
  )
}
