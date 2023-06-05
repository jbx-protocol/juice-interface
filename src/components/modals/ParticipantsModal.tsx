import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button, Modal } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import Loading from 'components/Loading'
import ETHAmount from 'components/currency/ETHAmount'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { useContext, useEffect, useMemo, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { formatPercent } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { TokenAmount } from 'components/TokenAmount'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import {
  OrderDirection,
  Participant_OrderBy,
  ParticipantsDocument,
  ParticipantsQuery,
  QueryParticipantsArgs,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { DownloadParticipantsModal } from './DownloadParticipantsModal'

const pageSize = 100

export default function ParticipantsModal({
  tokenSymbol,
  tokenAddress,
  totalTokenSupply,
  open,
  onCancel,
}: {
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  totalTokenSupply: BigNumber | undefined
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const [loading, setLoading] = useState<boolean>()
  const [participants, setParticipants] = useState<
    ParticipantsQuery['participants']
  >([])
  const [sortPayerReports, setSortPayerReports] = useState<Participant_OrderBy>(
    Participant_OrderBy.balance,
  )
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>(OrderDirection.desc)

  const pOptions = participantOptions(
    tokenSymbolText({
      tokenSymbol,
      capitalize: true,
    }),
  )

  const participantOption = pOptions.find(
    option => option.value === sortPayerReports,
  )

  useEffect(() => {
    setLoading(true)

    if (!projectId || !open || !pv) {
      setParticipants([])
      return
    }

    client
      .query<ParticipantsQuery, QueryParticipantsArgs>({
        query: ParticipantsDocument,
        variables: {
          orderBy: sortPayerReports,
          orderDirection: sortPayerReportsDirection,
          where: {
            projectId,
            pv,
            balance_gt: BigNumber.from(0),
            wallet_not: constants.AddressZero,
          },
        },
      })
      .then(res => {
        setParticipants(curr => {
          const newParticipants = [...curr]
          newParticipants.push(...res.data.participants)
          return newParticipants
        })
        setLoading(false)
      })
  }, [
    pageNumber,
    projectId,
    pv,
    sortPayerReportsDirection,
    sortPayerReports,
    open,
  ])

  const list = useMemo(() => {
    return (
      <div>
        <div className="mb-5 flex w-full items-center justify-between">
          <JuiceListbox
            className="flex-1"
            buttonClassName="py-1"
            options={pOptions}
            value={participantOption}
            onChange={v => {
              setParticipants([])
              setSortPayerReports(v.value)
            }}
          />
          <div
            className="cursor-pointer p-2"
            onClick={() => {
              setParticipants([])
              setSortPayerReportsDirection(
                sortPayerReportsDirection === OrderDirection.asc
                  ? OrderDirection.desc
                  : OrderDirection.asc,
              )
            }}
          >
            {sortPayerReportsDirection === OrderDirection.asc ? (
              <SortAscendingOutlined />
            ) : (
              <SortDescendingOutlined />
            )}
          </div>

          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => setDownloadModalVisible(true)}
          />
        </div>

        {participants?.map(p => (
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
                    <ETHAmount amount={p.volume} /> contributed
                  </Trans>
                </div>
              </div>

              <div className="text-right">
                <div className="leading-6">
                  <TokenAmount
                    amountWad={p.balance}
                    tokenSymbol={tokenSymbol}
                  />{' '}
                  ({formatPercent(p.balance, totalTokenSupply)}%)
                </div>
                <div className="text-xs text-grey-400 dark:text-slate-200">
                  <Trans>
                    <TokenAmount
                      amountWad={p.stakedBalance}
                      tokenSymbol={tokenSymbol}
                    />{' '}
                    unclaimed
                  </Trans>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }, [
    pOptions,
    participantOption,
    tokenSymbol,
    sortPayerReportsDirection,
    participants,
    totalTokenSupply,
  ])

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      okText={t`Done`}
      cancelButtonProps={{ hidden: true }}
    >
      <div>
        <h4>
          <Trans>
            {tokenSymbolText({ tokenSymbol, capitalize: true })} holders
          </Trans>
        </h4>
        <div className="flex flex-col gap-2">
          {tokenAddress && !isZeroAddress(tokenAddress) && (
            <div className="mb-5">
              <Trans>
                Token address: <EthereumAddress address={tokenAddress} />
              </Trans>
            </div>
          )}

          {list}

          {loading && (
            <div>
              <Loading />
            </div>
          )}

          {participants?.length % pageSize === 0 && !loading ? (
            <div
              className="cursor-pointer text-center text-grey-500 dark:text-grey-300"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              <Trans>Load more...</Trans>
            </div>
          ) : loading ? null : (
            <div className="p-2 text-center text-grey-500 dark:text-grey-300">
              <Trans>{participants.length} total</Trans>
            </div>
          )}
        </div>
      </div>

      <DownloadParticipantsModal
        tokenSymbol={tokenSymbol}
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </Modal>
  )
}

interface ParticipantOption {
  label: string
  value: Participant_OrderBy
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
