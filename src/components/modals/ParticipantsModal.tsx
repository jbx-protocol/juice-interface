import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, Select, Space } from 'antd'
import Callout from 'components/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedAddress from 'components/FormattedAddress'
import Loading from 'components/Loading'
import { CV_V1, CV_V1_1 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { Participant } from 'models/subgraph-entities/vX/participant'
import { useContext, useEffect, useMemo, useState } from 'react'
import { formatPercent, formatWad } from 'utils/format/formatNumber'
import { GraphQueryOpts, OrderDirection, querySubgraph } from 'utils/graph'
import { tokenSymbolText } from 'utils/tokenSymbolText'
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
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [loading, setLoading] = useState<boolean>()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [sortPayerReports, setSortPayerReports] =
    useState<keyof Participant>('balance')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>('desc')

  useEffect(() => {
    setLoading(true)

    if (!projectId || !open || !cv) {
      setParticipants([])
      return
    }

    // Projects that migrate between 1 & 1.1 may change their CV without the CV of their participants being updated. This should be fixed by better subgraph infrastructure, but this fix will make sure the UI works for now.
    const cvOpt: GraphQueryOpts<'participant', keyof Participant>['where'] =
      cv === CV_V1 || cv === CV_V1_1
        ? {
            key: 'cv',
            operator: 'in',
            value: [CV_V1, CV_V1_1],
          }
        : {
            key: 'cv',
            value: cv,
          }

    querySubgraph({
      entity: 'participant',
      keys: [
        'wallet',
        'totalPaid',
        'lastPaidTimestamp',
        'balance',
        'stakedBalance',
        'id',
      ],
      first: pageSize,
      skip: pageNumber * pageSize,
      orderBy: sortPayerReports,
      orderDirection: sortPayerReportsDirection,
      where:
        projectId && cv
          ? [
              {
                key: 'projectId',
                value: projectId,
              },
              cvOpt,
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
    }).then(res => {
      setParticipants(curr => {
        const newParticipants = [...curr]
        newParticipants.push(...res)
        return newParticipants
      })
      setLoading(false)
    })
  }, [
    pageNumber,
    projectId,
    cv,
    sortPayerReportsDirection,
    sortPayerReports,
    open,
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
              <Trans>
                {tokenSymbolText({
                  tokenSymbol,
                  capitalize: true,
                })}{' '}
                balance
              </Trans>
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
                  <Trans>
                    <ETHAmount amount={p.totalPaid} /> contributed
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
                  {tokenSymbolText({
                    tokenSymbol,
                    capitalize: false,
                    plural: true,
                  })}{' '}
                  ({formatPercent(p.balance, totalTokenSupply)}%)
                </div>
                <div style={smallHeaderStyle}>
                  {formatWad(p.stakedBalance, { precision: 0 })}{' '}
                  <Trans>
                    {tokenSymbolText({
                      tokenSymbol,
                      capitalize: false,
                      plural: true,
                    })}{' '}
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
    colors.text.tertiary,
    colors.stroke.tertiary,
    sortPayerReports,
    tokenSymbol,
    sortPayerReportsDirection,
    setDownloadModalVisible,
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
        <Space direction="vertical">
          {tokenAddress && tokenAddress !== constants.AddressZero && (
            <div style={{ marginBottom: 20 }}>
              <Trans>
                Token address: <FormattedAddress address={tokenAddress} />
              </Trans>
            </div>
          )}

          <Callout>
            <Trans>
              This list is using an experimental data index and may be
              inaccurate for some projects.
            </Trans>
          </Callout>

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
        </Space>
      </div>

      <DownloadParticipantsModal
        tokenSymbol={tokenSymbol}
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </Modal>
  )
}
