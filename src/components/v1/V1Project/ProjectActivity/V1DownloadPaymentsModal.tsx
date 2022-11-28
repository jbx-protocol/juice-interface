import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { readProvider } from 'constants/readProvider'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { fromWad } from 'utils/format/formatNumber'
import { querySubgraphExhaustive } from 'utils/graph'
import { emitErrorNotification } from 'utils/notifications'

export function V1DownloadPaymentsModal({
  open,
  onCancel,
}: {
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()
  const [blockNumber, setBlockNumber] = useState<number>()
  const [loading, setLoading] = useState<boolean>()
  const { handle } = useContext(V1ProjectContext)

  useEffect(() => {
    readProvider.getBlockNumber().then(val => {
      setLatestBlockNumber(val)
      setBlockNumber(val)
    })
  }, [])

  const download = useCallback(async () => {
    if (blockNumber === undefined || !projectId || !pv) return

    setLoading(true)

    const rows = [
      [t`Amount paid`, t`Date`, t`Payer`, t`Beneficiary`, t`Note`], // CSV header row
    ]

    try {
      const payments = await querySubgraphExhaustive({
        entity: 'payEvent',
        keys: ['caller', 'beneficiary', 'amount', 'timestamp', 'note'],
        orderBy: 'timestamp',
        orderDirection: 'desc',
        block: {
          number: blockNumber,
        },
        where: [
          {
            key: 'projectId',
            value: projectId,
          },
          {
            key: 'pv',
            value: pv,
          },
        ],
      })

      if (!payments) {
        emitErrorNotification(t`Error loading payments`)
        throw new Error('No data.')
      }

      payments.forEach(p => {
        let date = new Date((p.timestamp ?? 0) * 1000).toUTCString()

        if (date.includes(',')) date = date.split(',')[1]

        rows.push([
          fromWad(p.amount),
          date,
          p.caller,
          p.beneficiary,
          `"${p.note.replace('\n', ' ').trim()}"`,
        ])
      })

      downloadCsvFile(`@${handle}_payments-block${blockNumber}`, rows)

      setLoading(false)
    } catch (e) {
      console.error('Error downloading payments', e)
      emitErrorNotification(
        'Error downloading payments, try again in a few minutes.',
      )
      setLoading(false)
    }
  }, [projectId, pv, setLoading, blockNumber, handle])

  return (
    <Modal
      open={open}
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
          <Trans>Download CSV of payments</Trans>
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
