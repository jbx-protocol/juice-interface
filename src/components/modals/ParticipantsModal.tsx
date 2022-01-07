import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Modal, Select } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import Loading from 'components/shared/Loading'
import UntrackedErc20Notice from 'components/shared/UntrackedErc20Notice'

import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { NetworkName } from 'models/network-name'
import {
  parseParticipantJson,
  Participant,
} from 'models/subgraph-entities/participant'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatPercent, formatWad } from 'utils/formatNumber'
import { OrderDirection, querySubgraph } from 'utils/graph'

import { indexedProjectERC20s } from 'constants/indexed-project-erc20s'

import DownloadParticipantsModal from './DownloadParticipantsModal'
import { CURRENCY_ETH } from 'constants/currency'

const pageSize = 100

export default function ParticipantsModal({
  visible,
  onCancel,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const [loading, setLoading] = useState<boolean>()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [sortPayerReports, setSortPayerReports] =
    useState<keyof Participant>('tokenBalance')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>('desc')
  const { projectId, tokenSymbol } = useContext(ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const totalTokenSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: [projectId?.toHexString()],
    valueDidChange: bigNumbersDiff,
  })

  useEffect(() => {
    setLoading(true)

    querySubgraph(
      {
        entity: 'participant',
        keys: ['wallet', 'totalPaid', 'lastPaidTimestamp', 'tokenBalance'],
        first: pageSize,
        skip: pageNumber * pageSize,
        orderBy: sortPayerReports,
        orderDirection: sortPayerReportsDirection,
        where: projectId
          ? {
              key: 'project',
              value: projectId.toString(),
            }
          : undefined,
      },
      res => {
        if (!res) return

        setParticipants(participants => {
          const newParticipants = [...participants]
          newParticipants.push(
            ...res.participants.map(e => parseParticipantJson(e)),
          )
          return newParticipants
        })
        setLoading(false)
      },
    )
  }, [pageNumber, projectId, sortPayerReportsDirection, sortPayerReports])

  const contentLineHeight = '1.4rem'

  const formattedTokenBalance = useCallback(
    (balance: BigNumber | undefined) => (
      <span>
        {formatWad(balance, { decimals: 0 })} {tokenSymbol ?? 'tokens'} (
        {formatPercent(balance, totalTokenSupply)}%)
      </span>
    ),
    [tokenSymbol, totalTokenSupply],
  )

  const formattedPaid = (amount: BigNumber | undefined) => (
    <span>
      <CurrencySymbol currency={CURRENCY_ETH} />
      {formatWad(amount, { decimals: 6 })}
    </span>
  )

  const lastPaid = (lastPaidTimestamp: number | undefined) =>
    lastPaidTimestamp ? (
      <span>Last paid {formatHistoricalDate(lastPaidTimestamp * 1000)}</span>
    ) : (
      <span>No payments</span>
    )

  const list = useMemo(() => {
    const smallHeaderStyle = {
      fontSize: '.7rem',
      color: colors.text.tertiary,
    }

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            width: '100%',
          }}
        >
          <Select
            style={{ flex: 1 }}
            onChange={(val: keyof Participant) => {
              setParticipants([])
              setSortPayerReports(val)
            }}
            value={sortPayerReports}
          >
            <Select.Option value="tokenBalance">
              {tokenSymbol ?? 'Token'} balance
            </Select.Option>
            <Select.Option value="totalPaid">Amount paid</Select.Option>
            <Select.Option value="lastPaidTimestamp">Last paid</Select.Option>
          </Select>
          <div
            style={{ cursor: 'pointer', padding: 10 }}
            onClick={() => {
              setParticipants([])
              setSortPayerReportsDirection(
                sortPayerReportsDirection === 'asc' ? 'desc' : 'asc',
              )
            }}
          >
            {sortPayerReportsDirection === 'asc' ? (
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

        {participants.map(p => (
          <div
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: '1px solid ' + colors.stroke.tertiary,
            }}
            key={p.id}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                    marginRight: 10,
                  }}
                >
                  <FormattedAddress address={p.wallet} />
                </div>
                <div style={smallHeaderStyle}>
                  {sortPayerReports === 'tokenBalance'
                    ? lastPaid(p.lastPaidTimestamp)
                    : formattedTokenBalance(p.tokenBalance)}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                  }}
                >
                  {sortPayerReports === 'tokenBalance'
                    ? formattedTokenBalance(p.tokenBalance)
                    : formattedPaid(p.totalPaid)}
                </div>
                <div style={smallHeaderStyle}>
                  {sortPayerReports === 'tokenBalance' ? (
                    <span>{formattedPaid(p.totalPaid)} total contributed</span>
                  ) : (
                    lastPaid(p.lastPaidTimestamp)
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }, [
    colors.text.tertiary,
    colors.stroke.tertiary,
    sortPayerReports,
    tokenSymbol,
    sortPayerReportsDirection,
    setDownloadModalVisible,
    participants,
    formattedTokenBalance,
  ])

  const erc20IsUntracked =
    tokenSymbol &&
    projectId &&
    !indexedProjectERC20s[
      process.env.REACT_APP_INFURA_NETWORK as NetworkName
    ]?.includes(projectId?.toNumber())

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onCancel}
      okText="Done"
      cancelButtonProps={{ hidden: true }}
    >
      <div>
        <h4>{tokenSymbol || 'Token'} holders</h4>

        <p style={{ padding: 10, background: colors.background.l1 }}>
          This list is using an experimental data index and may be inaccurate
          for some projects.
        </p>

        {erc20IsUntracked && (
          <p style={{ padding: 10, background: colors.background.l1 }}>
            <UntrackedErc20Notice tokenSymbol={tokenSymbol} />
          </p>
        )}

        {list}

        {loading && (
          <div>
            <Loading />
          </div>
        )}

        {participants?.length % pageSize === 0 && !loading ? (
          <div
            style={{
              textAlign: 'center',
              color: colors.text.secondary,
              cursor: 'pointer',
            }}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Load more
          </div>
        ) : loading ? null : (
          <div
            style={{
              textAlign: 'center',
              padding: 10,
              color: colors.text.secondary,
            }}
          >
            {participants.length} total
          </div>
        )}
      </div>

      <DownloadParticipantsModal
        visible={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </Modal>
  )
}
