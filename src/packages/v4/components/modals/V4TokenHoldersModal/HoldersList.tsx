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
import { NativeTokenValue } from 'juice-sdk-react'
import { OrderDirection, Participant_OrderBy, ParticipantsDocument } from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import { useEffect, useState } from 'react'
import { formatPercent } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { DownloadTokenHoldersModal } from './DownloadTokenHoldersModal'

interface ParticipantOption {
  label: string
  value: Participant_OrderBy
}

type Participant = {
  volume: bigint;
  lastPaidTimestamp: number;
  balance: bigint;
  stakedBalance: bigint;
  id: string;
  wallet: {
      id: string;
  };
}

const participantOptions = (tokenText: string): ParticipantOption[] => [
  {
    label: t`${tokenText} balance`,
    value: Participant_OrderBy.balance,
  },
  {
    label: t`Total paid`,
    value: Participant_OrderBy.volume,
  },
  {
    label: t`Last paid`,
    value: Participant_OrderBy.lastPaidTimestamp,
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
  const [sortPayerReports, setSortPayerReports] = useState<Participant_OrderBy>(
    Participant_OrderBy.balance,
  )
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>(OrderDirection.desc)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()

  const pOptions = participantOptions(
    tokenSymbolText({
      tokenSymbol,
      capitalize: true,
    }),
  )

  const participantOption = pOptions.find(
    option => option.value === sortPayerReports,
  )

  const { data, isLoading } = useSubgraphQuery({
    document: ParticipantsDocument,
    variables: {
      orderDirection: sortPayerReportsDirection,
      orderBy: sortPayerReports,
      first: pageSize,
      skip: pageNumber * pageSize,
      where: {
        projectId: Number(projectId),
      },
    },
    enabled: Boolean(projectId),
  })

  useEffect(() => {
    if (data?.participants) {
      setParticipants(prev => {
        const newParticipants = data.participants.filter(
          newParticipant => !prev.some(prevParticipant => prevParticipant.id === newParticipant.id)
        )
        return [...prev, ...newParticipants]
      })
    }
  }, [data])

  const loadMore = () => {
    setPageNumber(prevPage => prevPage + 1)
  }

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
            setPageNumber(0)
            setParticipants([])
          }}
        />
        <div
          className="cursor-pointer p-2"
          onClick={() => {
            setSortPayerReportsDirection(
              sortPayerReportsDirection === OrderDirection.asc
                ? OrderDirection.desc
                : OrderDirection.asc,
            )
            setPageNumber(0)
            setParticipants([])
          }}
        >
          {
            // these icons are visually confusing and reversed on purpose
            sortPayerReportsDirection === OrderDirection.asc ? (
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
          key={p.id}
        >
          <div className="flex content-between justify-between">
            <div>
              <div className="mr-2 leading-6">
                <EthereumAddress address={p.wallet.id} />
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
                ({formatPercent(
                    BigNumber.from(p.balance),  // TODO: make formatPercent take bigint
                    BigNumber.from(totalTokenSupply)
                  )}%)
              </div>
              <div className="text-xs text-grey-400 dark:text-slate-200">
                <Trans>
                  <TokenAmount
                    amountWad={BigNumber.from(p.stakedBalance)} // TODO: make TokenAmount take bigint
                    tokenSymbol={tokenSymbol}
                  />{' '}
                  unclaimed
                </Trans>
              </div>
            </div>
          </div>
        </div>
      ))}

      {isLoading && pageNumber === 0 && (
        <div>
          <Loading />
        </div>
      )}

      {participants.length > 0 && participants.length % pageSize === 0 && (
        <div
          className="cursor-pointer text-center text-grey-500 dark:text-grey-300"
          onClick={loadMore}
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
