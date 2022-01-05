import { Modal } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import UntrackedErc20Notice from 'components/shared/UntrackedErc20Notice'

import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { NetworkName } from 'models/network-name'
import { parseParticipantJson } from 'models/subgraph-entities/participant'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fromWad } from 'utils/formatNumber'
import { querySubgraph } from 'utils/graph'

import { readProvider } from 'constants/readProvider'
import { indexedProjectERC20s } from 'constants/indexed-project-erc20s'

export default function DownloadParticipantsModal({
  visible,
  onCancel,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()
  const [blockNumber, setBlockNumber] = useState<number>()
  const [loading, setLoading] = useState<boolean>()
  const { projectId, tokenSymbol, handle } = useContext(ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useEffect(() => {
    readProvider.getBlockNumber().then(val => {
      setLatestBlockNumber(val)
      setBlockNumber(val)
    })
  }, [])

  const download = useCallback(() => {
    setLoading(true)

    const pageSize = 1000
    let pageNumber = 0

    const rows = [
      [
        'Wallet address',
        `Total ${tokenSymbol ?? 'token'} balance`,
        'Staked balance',
        'Unstaked balance',
        'Total ETH paid',
        'Last paid timestamp',
      ], // CSV header row
    ]

    function query() {
      querySubgraph(
        {
          entity: 'participant',
          keys: [
            'wallet',
            'totalPaid',
            'lastPaidTimestamp',
            'balance',
            'stakedBalance',
            'unstakedBalance',
          ],
          first: pageSize,
          skip: pageSize * pageNumber,
          orderBy: 'balance',
          orderDirection: 'desc',
          block: blockNumber
            ? {
                number: blockNumber,
              }
            : undefined,
          where: projectId
            ? {
                key: 'project',
                value: projectId.toString(),
              }
            : undefined,
        },
        res => {
          if (!res) return

          res.participants.forEach(e => {
            const p = parseParticipantJson(e)

            let date = new Date((p.lastPaidTimestamp ?? 0) * 1000).toUTCString()

            if (date.includes(',')) date = date.split(',')[1]

            rows.push([
              p.wallet ?? '--',
              fromWad(p.balance),
              fromWad(p.stakedBalance),
              fromWad(p.unstakedBalance),
              fromWad(p.totalPaid),
              date,
            ])
          })

          const expectNextPage =
            res.participants.length && res.participants.length % pageSize === 0

          if (expectNextPage) {
            pageNumber++
            query()
          } else {
            setLoading(false)

            // Encode CSV content and download
            const csvContent =
              'data:text/csv;charset=utf-8,' +
              rows.map(e => e.join(',')).join('\n')
            const encodedUri = encodeURI(csvContent)
            const link = document.createElement('a')
            link.setAttribute('href', encodedUri)
            link.setAttribute(
              'download',
              `@${handle}_holders-block${blockNumber}.csv`,
            )
            document.body.appendChild(link)

            link.click()
          }
        },
      )
    }

    query()
  }, [projectId, setLoading, blockNumber, handle, tokenSymbol])

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
      onOk={download}
      okText="Download CSV"
      okButtonProps={{ type: 'primary' }}
      cancelText="Close"
      confirmLoading={loading}
      centered
    >
      <div>
        <h4>Download CSV of {tokenSymbol || 'token'} holders</h4>

        <p style={{ padding: 10, background: colors.background.l1 }}>
          {erc20IsUntracked && (
            <UntrackedErc20Notice tokenSymbol={tokenSymbol} />
          )}
        </p>

        <label style={{ display: 'block', marginTop: 20, marginBottom: 5 }}>
          Block number
        </label>
        <FormattedNumberInput
          value={blockNumber?.toString()}
          onChange={val => setBlockNumber(val ? parseInt(val) : undefined)}
          accessory={
            <InputAccessoryButton
              content="Latest"
              onClick={() => setBlockNumber(latestBlockNumber)}
              disabled={blockNumber === latestBlockNumber}
            />
          }
        />
      </div>
    </Modal>
  )
}
