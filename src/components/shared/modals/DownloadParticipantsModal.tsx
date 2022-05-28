import { t, Trans } from '@lingui/macro'
import { Modal, notification } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { useCallback, useEffect, useState } from 'react'
import { fromWad } from 'utils/formatNumber'
import { querySubgraphExhaustive } from 'utils/graph'

import { readProvider } from 'constants/readProvider'

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

    setLoading(true)

    const rows = [
      [
        t`Wallet address`,
        `Total ${tokenSymbol ?? t`token`} balance`,
        t`Staked balance`,
        t`Unstaked balance`,
        t`Total ETH paid`,
        t`Last paid timestamp`,
      ], // CSV header row
    ]

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
          key: 'project',
          value: projectId.toString(),
        },
      })

      if (!participants) {
        notification.error({
          message: t`Error loading holders`,
        })
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

      const csvContent =
        'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `@${projectName}_holders-block${blockNumber}.csv`,
      )
      document.body.appendChild(link)

      link.click()

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
          <Trans>Download CSV of {tokenSymbol || t`token`} holders</Trans>
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
