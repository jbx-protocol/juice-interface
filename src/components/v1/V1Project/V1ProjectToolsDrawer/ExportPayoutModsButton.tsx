import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { PayoutMod } from 'models/mods'
import { useContext, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { permyriadToPercent } from 'utils/formatNumber'
import { emitErrorNotification } from 'utils/notifications'

const CSV_HEADER: (keyof PayoutMod)[] = [
  'beneficiary',
  'percent',
  'preferUnstaked',
  'lockedUntil',
  'projectId',
  'allocator',
]

const preparePayoutModsCsv = (mods: PayoutMod[]): (string | undefined)[][] => {
  const csvContent = mods.map(mod => {
    return [
      mod.beneficiary,
      `${parseFloat(permyriadToPercent(`${mod.percent}`)) / 100}`,
      `${mod.preferUnstaked}`,
      `${mod.lockedUntil}`,
      mod.projectId?.toString(),
      mod.allocator,
    ]
  })

  return [CSV_HEADER, ...csvContent]
}

export function ExportPayoutModsButton() {
  const { handle, currentFC, currentPayoutMods } = useContext(V1ProjectContext)
  const [loading, setLoading] = useState<boolean>(false)

  const onExportSplitsButtonClick = () => {
    if (!currentFC || !currentPayoutMods) return

    setLoading(true)

    try {
      const csvContent = preparePayoutModsCsv(currentPayoutMods)
      const filename = `@${handle}_payouts_fc-${currentFC.number}`

      downloadCsvFile(filename, csvContent)
    } catch (e) {
      console.error(e)
      emitErrorNotification(t`CSV download failed.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      icon={<DownloadOutlined />}
      size="small"
      onClick={onExportSplitsButtonClick}
      loading={loading}
    >
      <span>
        <Trans>Export payouts CSV</Trans>
      </span>
    </Button>
  )
}
