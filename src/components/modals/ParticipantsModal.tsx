import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button, Modal, Select } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import Loading from 'components/Loading'
import ETHAmount from 'components/currency/ETHAmount'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { SGOrderDir, SGQueryOpts } from 'models/graph'
import { Participant } from 'models/subgraph-entities/vX/participant'
import { useContext, useEffect, useMemo, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { formatPercent } from 'utils/format/formatNumber'
import { querySubgraph } from 'utils/graph'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { TokenAmount } from 'components/TokenAmount'
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
      | 'volume'
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
        'wallet { id }',
        'volume',
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
            <Select.Option value="volume">
              <Trans>Total paid</Trans>
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
              <Trans>Load more</Trans>
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
