import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, Select, Space } from 'antd'
import { Callout } from 'components/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedAddress from 'components/FormattedAddress'
import Loading from 'components/Loading'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { SGOrderDir, SGQueryOpts } from 'models/graph'
import { Participant } from 'models/subgraph-entities/vX/participant'
import { useContext, useEffect, useMemo, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { formatPercent, formatWad } from 'utils/format/formatNumber'
import { querySubgraph } from 'utils/graph'
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
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const [loading, setLoading] = useState<boolean>()
  const [participants, setParticipants] = useState<
    Pick<
      Participant,
      | 'wallet'
      | 'totalPaid'
      | 'lastPaidTimestamp'
      | 'balance'
      | 'stakedBalance'
      | 'id'
    >[]
  >([])
  const [sortPayerReports, setSortPayerReports] =
    useState<keyof Participant>('balance')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<SGOrderDir>('desc')

  useEffect(() => {
    setLoading(true)

    if (!projectId || !open || !pv) {
      setParticipants([])
      return
    }

    // Projects that migrate between 1 & 1.1 may change their PV without the PV of their participants being updated. This should be fixed by better subgraph infrastructure, but this fix will make sure the UI works for now.
    const pvOpt: SGQueryOpts<'participant', keyof Participant>['where'] = {
      key: 'pv',
      value: pv,
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
        projectId && pv
          ? [
              {
                key: 'projectId',
                value: projectId,
              },
              pvOpt,
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
    pv,
    sortPayerReportsDirection,
    sortPayerReports,
    open,
  ])

  const list = useMemo(() => {
    return (
      <div>
        <div className="mb-5 flex w-full items-center justify-between">
          <Select
            className="flex-1"
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
            className="cursor-pointer p-2"
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
            className="border-b-1 mb-5 border border-l-0 border-t-0 border-r-0 border-solid border-smoke-200 pb-5 dark:border-grey-600"
            key={p.id}
          >
            <div className="flex content-between justify-between">
              <div>
                <div className="mr-2 leading-6">
                  <FormattedAddress address={p.wallet} />
                </div>
                <div className="text-xs text-grey-400 dark:text-slate-200">
                  <Trans>
                    <ETHAmount amount={p.totalPaid} /> contributed
                  </Trans>
                </div>
              </div>

              <div className="text-right">
                <div className="leading-6">
                  {formatWad(p.balance, { precision: 0 })}{' '}
                  {tokenSymbolText({
                    tokenSymbol,
                    capitalize: false,
                    plural: true,
                  })}{' '}
                  ({formatPercent(p.balance, totalTokenSupply)}%)
                </div>
                <div className="text-xs text-grey-400 dark:text-slate-200">
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
          {tokenAddress && !isZeroAddress(tokenAddress) && (
            <div className="mb-5">
              <Trans>
                Token address: <FormattedAddress address={tokenAddress} />
              </Trans>
            </div>
          )}

          <Callout.Info>
            <Trans>
              This list is using an experimental data index and may be
              inaccurate for some projects.
            </Trans>
          </Callout.Info>

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
              <Trans>Load more</Trans>
            </div>
          ) : loading ? null : (
            <div className="p-2 text-center text-grey-500 dark:text-grey-300">
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
