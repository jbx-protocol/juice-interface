import { t, Trans } from '@lingui/macro'
import { Modal, notification } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fromWad } from 'utils/formatNumber'
import { querySubgraphExhaustive } from 'utils/graph'

import { readProvider } from 'constants/readProvider'

export default function DownloadPaymentsModal({
  visible,
  onCancel,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()
  const [blockNumber, setBlockNumber] = useState<number>()
  const [loading, setLoading] = useState<boolean>()
  const { projectId, handle } = useContext(V1ProjectContext)

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
        where: {
          key: 'project',
          value: projectId.toString(),
        },
      })

      if (!payments) {
        notification.error({
          message: t`Error loading payments`,
        })
        throw new Error('No data.')
      }

      payments.forEach(p => {
        let date = new Date((p.timestamp ?? 0) * 1000).toUTCString()

        if (date.includes(',')) date = date.split(',')[1]

        rows.push([fromWad(p.amount), date, p.caller, p.beneficiary, p.note])
      })

      const csvContent =
        'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `@${handle}_payments-block${blockNumber}.csv`,
      )
      document.body.appendChild(link)

      link.click()

      setLoading(false)
    } catch (e) {
      console.error('Error downloading payments', e)
      setLoading(false)
    }
  }, [projectId, setLoading, blockNumber, handle])

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
