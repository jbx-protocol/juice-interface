import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import Loading from 'components/Loading'
import { TokenAmount } from 'components/TokenAmount'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { useParticipantsQuery, useProjectQuery } from 'generated/v4/graphql'
import { JBChainId } from 'juice-sdk-core'
import { NativeTokenValue, useJBChainId } from 'juice-sdk-react'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { useEffect, useState } from 'react'
import { formatPercent } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { DownloadTokenHoldersModal } from './DownloadTokenHoldersModal'

type Participant = {
  volume: bigint
  lastPaidTimestamp: number
  balance: bigint
  creditBalance: bigint
  address: string
  chainId: JBChainId
}

type OrderBy = keyof Pick<
  Participant,
  'volume' | 'lastPaidTimestamp' | 'balance'
>

interface ParticipantOption {
  label: string
  value: OrderBy
}

const participantOptions = (tokenText: string): ParticipantOption[] => [
  {
    label: t`${tokenText} balance`,
    value: 'balance',
  },
  {
    label: t`Total paid`,
    value: 'volume',
  },
  {
    label: t`Last paid`,
    value: 'lastPaidTimestamp',
  },
]

const pageSize = 100

export default function HoldersList({
  projectId,
  tokenSymbol,
  totalTokenSupply,
}: {
  projectId: number | undefined
  tokenSymbol: string | undefined
  totalTokenSupply: bigint | undefined
}) {
  const [sortPayerReports, setSortPayerReports] = useState<OrderBy>('balance')
  const [sortPayerReportsDirection, setSortPayerReportsDirection] = useState<
    'asc' | 'desc'
  >('desc')
  const [endCursor, setEndCursor] = useState<string | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()

  const chainId = useJBChainId()

  const pOptions = participantOptions(
    tokenSymbolText({
      tokenSymbol,
      capitalize: true,
    }),
  )

  const participantOption = pOptions.find(
    option => option.value === sortPayerReports,
  )

  const { data: project } = useProjectQuery({
    variables: {
      projectId: Number(projectId),
      chainId: Number(chainId),
    },
  })

  const { data, loading } = useParticipantsQuery({
    client: bendystrawClient,
    variables: {
      orderDirection: sortPayerReportsDirection,
      orderBy: sortPayerReports,
      limit: pageSize,
      after: endCursor,
      where: {
        suckerGroupId: project?.project?.suckerGroupId,
      },
    },
    skip: !projectId || !chainId,
  })

  useEffect(() => {
    if (data?.participants.items) {
      setParticipants(prev => {
        const newParticipants = data.participants.items
          .filter(
            newParticipant =>
              !prev.some(
                prevParticipant =>
                  prevParticipant.address === newParticipant.address,
              ),
          )
          .map(p => ({ ...p, chainId: p.chainId as JBChainId }))
        return [...prev, ...newParticipants]
      })
    }
  }, [data])

  return (
    <div>
      <div className="mb-5 flex w-full items-center justify-between">
        <JuiceListbox
          className="flex-1"
          buttonClassName="py-1"
          options={pOptions}
          value={participantOption}
          onChange={v => {
            setSortPayerReports(v.value)
            setEndCursor(null)
            setParticipants([])
          }}
        />
        <div
          className="cursor-pointer p-2"
          onClick={() => {
            setSortPayerReportsDirection(
              sortPayerReportsDirection === 'asc' ? 'desc' : 'asc',
            )
            setEndCursor(null)
            setParticipants([])
          }}
        >
          {
            // these icons are visually confusing and reversed on purpose
            sortPayerReportsDirection === 'asc' ? (
              <SortDescendingOutlined />
            ) : (
              <SortAscendingOutlined />
            )
          }
        </div>

        <Button
          type="text"
          icon={<DownloadOutlined />}
          onClick={() => setDownloadModalVisible(true)}
        />
      </div>

      {participants.map(p => (
        <div
          className="mb-5 border-b border-smoke-200 pb-5 dark:border-grey-600"
          key={p.address}
        >
          <div className="flex content-between justify-between">
            <div>
              <div className="mr-2 leading-6">
                <EthereumAddress address={p.address} chainId={p.chainId} />
              </div>
              <div className="text-xs text-grey-400 dark:text-slate-200">
                <Trans>
                  <NativeTokenValue wei={p.volume} /> contributed
                </Trans>
              </div>
            </div>

            <div className="text-right">
              <div className="leading-6">
                <TokenAmount
                  amountWad={BigNumber.from(p.balance)} // TODO: make TokenAmount take bigint
                  tokenSymbol={tokenSymbol}
                />{' '}
                (
                {formatPercent(
                  BigNumber.from(p.balance), // TODO: make formatPercent take bigint
                  BigNumber.from(totalTokenSupply),
                )}
                %)
              </div>
              <div className="text-xs text-grey-400 dark:text-slate-200">
                <Trans>
                  <TokenAmount
                    amountWad={BigNumber.from(p.creditBalance)} // TODO: make TokenAmount take bigint
                    tokenSymbol={tokenSymbol}
                  />{' '}
                  unclaimed
                </Trans>
              </div>
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <div>
          <Loading />
        </div>
      )}

      {participants.length > 0 && data?.participants.pageInfo.hasNextPage && (
        <div
          className="cursor-pointer text-center text-grey-500 dark:text-grey-300"
          onClick={() => setEndCursor(data.participants.pageInfo.endCursor)}
        >
          <Trans>Load more...</Trans>
        </div>
      )}

      <DownloadTokenHoldersModal
        tokenSymbol={tokenSymbol}
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
