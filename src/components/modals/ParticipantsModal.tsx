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
import { indexedProjectERC20s } from 'constants/indexed-project-erc20s'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { constants } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { NetworkName } from 'models/network-name'
import {
  parseParticipantJson,
  Participant,
} from 'models/subgraph-entities/participant'
import { useContext, useEffect, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatPercent, formatWad } from 'utils/formatNumber'
import { OrderDirection, querySubgraph } from 'utils/graph'

import DownloadParticipantsModal from './DownloadParticipantsModal'

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
  // const [holdersCount, setHoldersCount] = useState<BigNumber>()
  const [sortPayerReports, setSortPayerReports] =
    useState<keyof Participant>('balance')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>('desc')
  const { projectId, tokenSymbol, tokenAddress } = useContext(ProjectContext)
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

    if (!projectId || !visible) {
      setParticipants([])
      // setHoldersCount(undefined)
      return
    }

    const url = 'https://api.studio.thegraph.com/query/2231/juicebox/1.0.24'

    // querySubgraph(
    //   {
    //     url,
    //     entity: 'project',
    //     keys: ['holdersCount'],
    //     where: {
    //       key: 'id',
    //       value: projectId.toString(),
    //     },
    //   },
    //   res => {
    //     if (!res) return
    //     setHoldersCount(formatGraphResponse('project', res)[0].holdersCount)
    //   },
    // )

    querySubgraph(
      {
        url,
        entity: 'participant',
        keys: [
          'wallet',
          'totalPaid',
          'lastPaidTimestamp',
          'balance',
          'stakedBalance',
        ],
        first: pageSize,
        skip: pageNumber * pageSize,
        orderBy: sortPayerReports,
        orderDirection: sortPayerReportsDirection,
        where: projectId
          ? [
              {
                key: 'project',
                value: projectId.toString(),
              },
              {
                key: 'balance',
                value: 0,
                operator: 'gt',
              },
              {
                key: 'wallet',
                value: constants.AddressZero,
                operator: 'not',
              },
            ]
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
  }, [
    pageNumber,
    projectId,
    sortPayerReportsDirection,
    sortPayerReports,
    visible,
  ])

  const contentLineHeight = '1.4rem'

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
            disabled
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
                  <CurrencySymbol currency={0} />
                  {formatWad(p.totalPaid, { decimals: 6 })} contributed
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                  }}
                >
                  {formatWad(p.balance, { decimals: 0 })}{' '}
                  {tokenSymbol ?? 'tokens'} (
                  {formatPercent(p.balance, totalTokenSupply)}%)
                </div>
                <div style={smallHeaderStyle}>
                  {formatWad(p.stakedBalance, { decimals: 0 })}{' '}
                  {tokenSymbol ?? 'tokens'} staked
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
    totalTokenSupply,
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

        {/* <div>{formattedNum(holdersCount)} holders</div> */}

        {tokenAddress && tokenAddress !== constants.AddressZero && (
          <div style={{ marginBottom: 20 }}>
            Token address: <FormattedAddress address={tokenAddress} />
          </div>
        )}

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
