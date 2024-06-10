import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import Loading from 'components/Loading'
import { Parenthesis } from 'components/Parenthesis'
import { TokenAmount } from 'components/TokenAmount'
import ETHAmount from 'components/currency/ETHAmount'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { BigNumber, constants } from 'ethers'
import {
  OrderDirection,
  Participant_OrderBy,
  useParticipantsQuery,
} from 'generated/graphql'
import { PV } from 'models/pv'
import { useState } from 'react'
import { isBigNumberish, toBigNumber } from 'utils/bigNumbers'
import { formatPercent } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { DownloadParticipantsModal } from '../DownloadParticipantsModal'

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

const pageSize = 100

export default function HoldersList({
  projectId,
  pv,
  tokenSymbol,
  totalTokenSupply,
}: {
  projectId: number | undefined
  pv: PV | undefined
  tokenSymbol: string | undefined
  totalTokenSupply: BigNumber | undefined
}) {
  const [sortPayerReports, setSortPayerReports] = useState<Participant_OrderBy>(
    Participant_OrderBy.balance,
  )
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>(OrderDirection.desc)
  const [pageNumber, setPageNumber] = useState<number>(0)
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

  const { data, isLoading: loading } = useParticipantsQuery({
    orderBy: sortPayerReports,
    orderDirection: sortPayerReportsDirection,
    first: pageSize,
    where: {
      projectId,
      pv,
      balance_gt: '0',
      wallet_not: constants.AddressZero,
    },
    skip: (pageNumber + 1) * pageSize,
  })

  const participants = data?.participants

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
                  <ETHAmount amount={toBigNumber(p.volume)} /> contributed
                </Trans>
              </div>
            </div>

            <div className="text-right">
              <div className="leading-6">
                {isBigNumberish(p.balance) ? (
                  <>
                    <TokenAmount
                      amountWad={BigNumber.from(p.balance)}
                      tokenSymbol={tokenSymbol}
                    />{' '}
                    <Parenthesis>
                      {formatPercent(
                        BigNumber.from(p.balance),
                        totalTokenSupply,
                      )}
                      %
                    </Parenthesis>
                  </>
                ) : null}
              </div>
              <div className="text-xs text-grey-400 dark:text-slate-200">
                {isBigNumberish(p.stakedBalance) ? (
                  <Trans>
                    <TokenAmount
                      amountWad={BigNumber.from(p.stakedBalance)}
                      tokenSymbol={tokenSymbol}
                    />{' '}
                    unclaimed
                  </Trans>
                ) : null}
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

      {participants?.length &&
      participants.length % pageSize === 0 &&
      !loading ? (
        <div
          className="cursor-pointer text-center text-grey-500 dark:text-grey-300"
          onClick={() => {
            setPageNumber(n => n + 1)
          }}
        >
          <Trans>Load more...</Trans>
        </div>
      ) : loading ? null : (
        <div className="p-2 text-center text-grey-500 dark:text-grey-300">
          <Trans>{participants?.length} total</Trans>
        </div>
      )}

      <DownloadParticipantsModal
        tokenSymbol={tokenSymbol}
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
