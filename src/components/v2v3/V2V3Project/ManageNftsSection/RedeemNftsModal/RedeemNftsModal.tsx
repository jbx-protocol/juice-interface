import { t, Trans } from '@lingui/macro'
import { Col, Descriptions, Form, Row, Statistic } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import { MemoFormInput } from 'components/inputs/MemoFormInput'
import TransactionModal from 'components/modals/TransactionModal'
import { REDEMPTION_RATE_EXPLANATION } from 'components/strings'
import TooltipLabel from 'components/TooltipLabel'
import { RedeemingNft } from 'components/v2v3/V2V3Project/ProjectDashboard/components/NftRewardsPanel/hooks/useJB721DelegateTokenToNftReward'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useNftAccountBalance } from 'hooks/JB721Delegate/useNftAccountBalance'
import { useETHReceivedFromNftRedeem } from 'hooks/v2v3/contractReader/useETHReceivedFromNftRedeem'
import { useRedeemTokensTx } from 'hooks/v2v3/transactor/useRedeemTokensTx'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { encodeJb721DelegateRedeemMetadata } from 'utils/delegateMetadata/encodeJb721DelegateMetadata'
import { emitErrorNotification } from 'utils/notifications'
import { formatRedemptionRate } from 'utils/v2v3/math'
import { RedeemNftCard } from './RedeemNftCard'

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
  const { version: jb721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )

  const [tokenIdsToRedeem, setTokenIdsToRedeem] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>()
  const [memo, setMemo] = useState<string>('')
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const [form] = useForm<{
    redeemAmount: string
  }>()

  const { userAddress } = useWallet()
  const redeemTokensTx = useRedeemTokensTx()
  const { data, loading: balanceLoading } = useNftAccountBalance({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
    accountAddress: userAddress,
  })

  if (!fundingCycle || !fundingCycleMetadata || balanceLoading) return null

  const handleTierSelect = (nft: RedeemingNft) => {
    setTokenIdsToRedeem([...(tokenIdsToRedeem ?? []), nft.tokenId])
  }

  const handleTierDeselect = (nft: RedeemingNft) => {
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
        metadata: encodeJb721DelegateRedeemMetadata(
          tokenIdsToRedeem,
          jb721DelegateVersion,
        ),
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

  const nfts = data?.nfts.map(t => ({
    ...t,
    tokenId: t.tokenId.toHexString(),
  }))
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
      <div className="flex flex-col gap-6">
        <div>
          {canRedeem ? (
            <div className="flex flex-col gap-4">
              <Callout.Info>
                <Trans>NFTs are burned when they are redeemed.</Trans>
              </Callout.Info>
              <div>
                <Trans>
                  Redeem your NFTs to reclaim a portion of the ETH that isn't
                  needed for payouts. This cycle's{' '}
                  <strong>redemption rate</strong> determines how much ETH you
                  will receive.
                </Trans>
              </div>
            </div>
          ) : (
            <Callout.Info>
              {!hasOverflow && (
                <Trans>
                  <strong>
                    This project is using all of its ETH for payouts, or has no
                    ETH.
                  </strong>{' '}
                  You won't receive any ETH for burning your NFTs.
                </Trans>
              )}
              {!hasRedemptionRate && (
                <Trans>
                  <strong>This project has redemptions turned off</strong>. You
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
      </div>
    </TransactionModal>
  )
}
