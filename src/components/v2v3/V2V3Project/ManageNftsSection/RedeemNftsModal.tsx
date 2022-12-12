import { t, Trans } from '@lingui/macro'
import { Descriptions, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import axios from 'axios'
import { Callout } from 'components/Callout'
import { MemoFormInput } from 'components/Project/PayProjectForm/MemoFormInput'
import TransactionModal from 'components/TransactionModal'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useNftAccountBalance } from 'hooks/JB721Delegate/contractReader/NftAccountBalance'
import { useRedeemTokensTx } from 'hooks/v2v3/transactor/RedeemTokensTx'
import { useWallet } from 'hooks/Wallet'
import { IPFSNftRewardTier } from 'models/nftRewardTier'
import { JB721DelegateToken } from 'models/subgraph-entities/v2/jb-721-delegate-tokens'
import { MouseEventHandler, useContext, useState } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { classNames } from 'utils/classNames'
import { cidFromIpfsUri, openIpfsUrl } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'
import { formatRedemptionRate } from 'utils/v2v3/math'
import { LoadingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { encodeJB721DelegateRedeemMetadata } from 'utils/nftRewards'

function useJB721DelegateTokenMetadata(
  tokenUri: string | undefined,
): UseQueryResult<IPFSNftRewardTier> {
  return useQuery(
    ['nft-rewards', tokenUri],
    async (): Promise<IPFSNftRewardTier | undefined> => {
      if (!tokenUri) return

      const url = openIpfsUrl(cidFromIpfsUri(tokenUri))
      const response = await axios.get(url)
      const tierMetadata: IPFSNftRewardTier = response.data

      return tierMetadata
    },
  )
}

export function NftCard({
  nft,
  onClick,
  isSelected,
  loading,
}: {
  nft: JB721DelegateToken
  onClick?: MouseEventHandler<HTMLDivElement>
  isSelected?: boolean
  loading?: boolean
}) {
  const { data: tierData } = useJB721DelegateTokenMetadata(nft.tokenUri)
  if (!tierData) return null

  const { name, image } = tierData

  return (
    <div
      className={classNames(
        'flex h-full w-full w-1/4 cursor-pointer flex-col rounded-sm transition-shadow duration-100',
        isSelected
          ? 'shadow-[2px_0px_10px_0px_var(--boxShadow-primary)] outline outline-2 outline-haze-400'
          : '',
      )}
      onClick={onClick}
      role="button"
    >
      <div
        className={classNames(
          'relative flex w-full items-center justify-center',
          !loading ? 'pt-[100%]' : 'pt-[unset]',
          isSelected
            ? 'bg-smoke-25 dark:bg-slate-800'
            : 'bg-smoke-100 dark:bg-slate-600',
        )}
      >
        {loading ? (
          <div className="flex h-[151px] w-full items-center justify-center border border-solid border-smoke-200 dark:border-grey-600">
            <LoadingOutlined />
          </div>
        ) : (
          <img
            className={classNames('absolute top-0 h-full w-full object-cover')}
            alt={name}
            src={image}
            style={{
              filter: isSelected ? 'unset' : 'brightness(50%)',
            }}
            crossOrigin="anonymous"
          />
        )}
        {/* {isSelected ? <RewardIcon /> : null} */}
      </div>
      {/* Details section below image */}
      <div
        className={classNames(
          'flex h-full w-full flex-col justify-center px-3 pb-1.5',
          isSelected
            ? 'bg-smoke-25 dark:bg-slate-800'
            : 'bg-smoke-100 dark:bg-slate-600',
          !loading ? 'pt-2' : 'pt-1',
        )}
      ></div>
    </div>
  )
}

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

  const onNftClick = (nft: JB721DelegateToken) => {
    if (tokenIdsToRedeem.includes(nft.tokenId)) {
      setTokenIdsToRedeem([
        ...tokenIdsToRedeem.filter(id => id !== nft.tokenId),
      ])
    } else {
      setTokenIdsToRedeem([...tokenIdsToRedeem, nft.tokenId])
    }
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
            label={<Trans>Redemption rate</Trans>}
            className="pb-1"
          >
            {formatRedemptionRate(fundingCycleMetadata.redemptionRate)}%
          </Descriptions.Item>
          <Descriptions.Item label={<Trans>Your NFTs</Trans>} className="pb-1">
            {nftBalanceFormatted} NFTs
          </Descriptions.Item>
          {/* <Descriptions.Item
            label={<Trans>Total redemption value</Trans>}
            className="pb-1"
          >
            <ETHAmount amount={maxClaimable} />
          </Descriptions.Item> */}
        </Descriptions>

        <div>
          <Form form={form} layout="vertical">
            <div className="flex flex-wrap gap-4">
              {nfts?.map(nft => (
                <NftCard
                  key={nft.tokenId}
                  nft={nft}
                  onClick={() => onNftClick(nft)}
                  isSelected={tokenIdsToRedeem.includes(nft.tokenId)}
                />
              ))}
            </div>

            <Form.Item label={t`Memo`}>
              <MemoFormInput value={memo} onChange={setMemo} />
            </Form.Item>
          </Form>
        </div>
      </Space>
    </TransactionModal>
  )
}
