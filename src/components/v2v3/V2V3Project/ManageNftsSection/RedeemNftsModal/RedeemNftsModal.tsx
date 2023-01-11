import { t, Trans } from '@lingui/macro'
import { Col, Descriptions, Form, Row, Space, Statistic } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { MemoFormInput } from 'components/Project/PayProjectForm/MemoFormInput'
import TransactionModal from 'components/TransactionModal'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useNftAccountBalance } from 'hooks/JB721Delegate/contractReader/NftAccountBalance'
import { useRedeemTokensTx } from 'hooks/v2v3/transactor/RedeemTokensTx'
import { useWallet } from 'hooks/Wallet'
import { JB721DelegateToken } from 'models/subgraph-entities/v2/jb-721-delegate-tokens'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { formatRedemptionRate } from 'utils/v2v3/math'
import { BigNumber } from '@ethersproject/bignumber'
import { encodeJB721DelegateRedeemMetadata } from 'utils/nftRewards'
import { RedeemNftCard } from './RedeemNftCard'
import ETHAmount from 'components/currency/ETHAmount'
import { useETHReceivedFromNftRedeem } from 'hooks/v2v3/contractReader/ETHReceivedFromNftRedeem'
import TooltipLabel from 'components/TooltipLabel'
import { REDEMPTION_RATE_EXPLANATION } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'

export function RedeemNftsModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { fundingCycle, primaryTerminalCurrentOverflow, fundingCycleMetadata } =
    useContext(V2V3ProjectContext)

  const [tokenIdsToRedeem, setTokenIdsToRedeem] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>()
  const [memo, setMemo] = useState<string>('')
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const [form] = useForm<{
    redeemAmount: string
  }>()

  const { userAddress } = useWallet()
  const redeemTokensTx = useRedeemTokensTx()
  const { data: nfts, isLoading } = useNftAccountBalance({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
    accountAddress: userAddress,
  })

  if (!fundingCycle || !fundingCycleMetadata || isLoading) return null

  const handleTierSelect = (nft: JB721DelegateToken) => {
    setTokenIdsToRedeem([...(tokenIdsToRedeem ?? []), nft.tokenId])
  }

  const handleTierDeselect = (nft: JB721DelegateToken) => {
    const idxToRemove = tokenIdsToRedeem.indexOf(nft.tokenId)
    const newSelectedTierIds = tokenIdsToRedeem
    newSelectedTierIds.splice(idxToRemove, 1)
    setTokenIdsToRedeem([...newSelectedTierIds])
  }

  const executeRedeemTransaction = async () => {
    await form.validateFields()

    setLoading(true)

    const txSuccess = await redeemTokensTx(
      {
        redeemAmount: BigNumber.from(0),
        minReturnedTokens: BigNumber.from(0),
        memo,
        metadata: encodeJB721DelegateRedeemMetadata(tokenIdsToRedeem), // TODO: add metadata from tokenIdsToRedeem
      },
      {
        // step 1
        onDone: () => {
          setTransactionPending(true)
        },
        // step 2
        onConfirmed: () => {
          setTransactionPending(false)
          setLoading(false)
          onConfirmed?.()
        },
        onError: (e: Error) => {
          setTransactionPending(false)
          setLoading(false)
          emitErrorNotification(e.message)
        },
      },
    )

    if (!txSuccess) {
      setTransactionPending(false)
      setLoading(false)
    }
  }

  const nftBalanceFormatted = nfts?.length ?? 0
  const hasOverflow = primaryTerminalCurrentOverflow?.gt(0)
  const hasRedemptionRate = fundingCycleMetadata.redemptionRate.gt(0)
  const canRedeem = hasOverflow && hasRedemptionRate

  let modalTitle: string
  if (canRedeem) {
    modalTitle = t`Redeem NFTs for ETH`
  } else {
    modalTitle = t`Burn NFTs`
  }

  const redeemValue = useETHReceivedFromNftRedeem({
    tokenIdsToRedeem,
  })

  return (
    <TransactionModal
      transactionPending={transactionPending}
      title={modalTitle}
      open={open}
      confirmLoading={loading}
      onOk={() => {
        executeRedeemTransaction()
      }}
      onCancel={() => {
        onCancel?.()
      }}
      okText={modalTitle}
      okButtonProps={{ disabled: !tokenIdsToRedeem.length }}
      width={540}
      centered
    >
      <Space direction="vertical" className="w-full" size="large">
        <div>
          {canRedeem ? (
            <Space direction="vertical" size="middle">
              <Callout.Info>
                <Trans>NFTs are burned when they are redeemed.</Trans>
              </Callout.Info>
              <div>
                <Trans>
                  Redeem your NFTs for a portion of this project's overflow. The
                  current funding cycle's <strong>redemption rate</strong>{' '}
                  determines your redemption value.
                </Trans>
              </div>
            </Space>
          ) : (
            <Callout.Info>
              {!hasOverflow && (
                <Trans>
                  <strong>This project has no overflow</strong>. You won't
                  receive any ETH for burning your NFTs.
                </Trans>
              )}
              {!hasRedemptionRate && (
                <Trans>
                  <strong>This project has a 0% redemption rate</strong>. You
                  won't receive any ETH for burning your NFTs.
                </Trans>
              )}
            </Callout.Info>
          )}
        </div>

        <Descriptions
          column={1}
          contentStyle={{ display: 'block', textAlign: 'right' }}
        >
          <Descriptions.Item
            label={
              <TooltipLabel
                label={t`Redemption rate`}
                tip={REDEMPTION_RATE_EXPLANATION}
              />
            }
            className="pb-1"
          >
            {formatRedemptionRate(fundingCycleMetadata.redemptionRate)}%
          </Descriptions.Item>
          <Descriptions.Item label={<Trans>Your NFTs</Trans>} className="pb-1">
            {nftBalanceFormatted} NFTs
          </Descriptions.Item>
        </Descriptions>

        <div>
          <Form form={form} layout="vertical">
            <Form.Item label={t`Select NFTs to redeem`}>
              <Row gutter={[20, 20]}>
                {nfts?.map(nft => {
                  const isSelected = tokenIdsToRedeem.includes(nft.tokenId)
                  return (
                    <Col span={8} key={nft.tokenId}>
                      <RedeemNftCard
                        nft={nft}
                        onClick={() => handleTierSelect(nft)}
                        onRemove={() => handleTierDeselect(nft)}
                        isSelected={isSelected}
                      />
                    </Col>
                  )
                })}
              </Row>
            </Form.Item>

            <Statistic
              title={<Trans>Redemption value</Trans>}
              valueRender={() => <ETHAmount amount={redeemValue} />}
              className={'pt-5 pb-5'}
            />

            <Form.Item label={t`Memo`}>
              <MemoFormInput value={memo} onChange={setMemo} />
            </Form.Item>
          </Form>
        </div>
      </Space>
    </TransactionModal>
  )
}
