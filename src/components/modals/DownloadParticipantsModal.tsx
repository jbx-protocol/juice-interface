import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { emitErrorNotification } from 'utils/notifications'

import { useCallback, useEffect, useState } from 'react'
import { fromWad } from 'utils/formatNumber'
import { querySubgraphExhaustive } from 'utils/graph'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { readProvider } from 'constants/readProvider'
import { downloadCsvFile } from 'utils/csv'

export default function DownloadParticipantsModal({
  projectId,
  tokenSymbol,
  projectName,
  visible,
  onCancel,
}: {
  projectId: number | undefined
  tokenSymbol: string | undefined
  projectName: string | undefined
  visible: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()
  const [blockNumber, setBlockNumber] = useState<number>()
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    readProvider.getBlockNumber().then(val => {
      setLatestBlockNumber(val)
      setBlockNumber(val)
    })
  }, [])

  const download = useCallback(async () => {
    if (blockNumber === undefined || !projectId) return
    const rows = [
      [
        'Wallet address',
        `Total ${tokenSymbolText({ tokenSymbol })} balance`,
        'Unclaimed balance',
        'Claimed balance',
        'Total ETH paid',
        'Last paid timestamp',
      ], // CSV header row
    ]

    setLoading(true)
    try {
      const participants = await querySubgraphExhaustive({
        entity: 'participant',
        keys: [
          'wallet',
          'totalPaid',
          'balance',
          'stakedBalance',
          'unstakedBalance',
          'lastPaidTimestamp',
        ],
        orderBy: 'balance',
        orderDirection: 'desc',
        block: {
          number: blockNumber,
        },
        where: {
          key: 'projectId',
          value: projectId,
        },
      })

      if (!participants) {
        emitErrorNotification(t`Error loading holders`)
        throw new Error('No data.')
      }

      participants.forEach(p => {
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

      downloadCsvFile(`@${projectName}_holders-block${blockNumber}.csv`, rows)

      setLoading(false)
    } catch (e) {
      console.error('Error downloading participants', e)
      setLoading(false)
    }
  }, [blockNumber, projectId, tokenSymbol, projectName])

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={download}
      okText={t`Download CSV`}
      okButtonProps={{ type: 'primary' }}
      cancelText={t`Close`}
      confirmLoading={loading}
      centered
    >
      <div>
        <h4>
          <Trans>
            Download CSV of {tokenSymbolText({ tokenSymbol })} holders
          </Trans>
        </h4>

        <label style={{ display: 'block', marginTop: 20, marginBottom: 5 }}>
          <Trans>Block number</Trans>
        </label>
        <FormattedNumberInput
          value={blockNumber?.toString()}
          onChange={val => setBlockNumber(val ? parseInt(val) : undefined)}
          accessory={
            <InputAccessoryButton
              content={t`Latest`}
              onClick={() => setBlockNumber(latestBlockNumber)}
              disabled={blockNumber === latestBlockNumber}
            />
          }
        />
      </div>
    </Modal>
  )
}
