import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'

import { Button, Modal, Select } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import Loading from 'components/shared/Loading'
import UntrackedErc20Notice from 'components/shared/UntrackedErc20Notice'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { constants } from 'ethers'
import useTotalSupplyOfProjectToken from 'hooks/v1/contractReader/TotalSupplyOfProjectToken'
import { NetworkName } from 'models/network-name'
import {
  parseParticipantJson,
  Participant,
} from 'models/subgraph-entities/participant'
import { useContext, useEffect, useMemo, useState } from 'react'
import { formatPercent, formatWad } from 'utils/formatNumber'
import { OrderDirection, querySubgraph } from 'utils/graph'

import { indexedProjectERC20s } from 'constants/v1/indexedProjectERC20s'

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
  const [sortPayerReports, setSortPayerReports] =
    useState<keyof Participant>('balance')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>('desc')
  const { projectId, tokenSymbol, tokenAddress } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const totalTokenSupply = useTotalSupplyOfProjectToken(projectId)

  useEffect(() => {
    setLoading(true)

    if (!projectId || !visible) {
      setParticipants([])
      return
    }

    querySubgraph(
      {
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
            <Select.Option value="balance">
              <Trans>{tokenSymbol ?? 'Token'} balance</Trans>
            </Select.Option>
            <Select.Option value="totalPaid">
              <Trans>Amount paid</Trans>
            </Select.Option>
            <Select.Option value="lastPaidTimestamp">
              <Trans>Last paid</Trans>
            </Select.Option>
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
                  <CurrencySymbol currency={0} />
                  <Trans>
                    {formatWad(p.totalPaid, { precision: 6 })} contributed
                  </Trans>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                  }}
                >
                  {formatWad(p.balance, { precision: 0 })}{' '}
                  {tokenSymbol ?? 'tokens'} (
                  {formatPercent(p.balance, totalTokenSupply)}%)
                </div>
                <div style={smallHeaderStyle}>
                  {formatWad(p.stakedBalance, { precision: 0 })}{' '}
                  <Trans>{tokenSymbol ?? 'tokens'} staked</Trans>
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
      okText={t`Done`}
      cancelButtonProps={{ hidden: true }}
    >
      <div>
        <h4>
          <Trans>{tokenSymbol || 'Token'} holders</Trans>
        </h4>

        {tokenAddress && tokenAddress !== constants.AddressZero && (
          <div style={{ marginBottom: 20 }}>
            <Trans>
              Token address: <FormattedAddress address={tokenAddress} />
            </Trans>
          </div>
        )}

        <p style={{ padding: 10, background: colors.background.l1 }}>
          <Trans>
            This list is using an experimental data index and may be inaccurate
            for some projects.
          </Trans>
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
            <Trans>Load more</Trans>
          </div>
        ) : loading ? null : (
          <div
            style={{
              textAlign: 'center',
              padding: 10,
              color: colors.text.secondary,
            }}
          >
            <Trans>{participants.length} total</Trans>
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
