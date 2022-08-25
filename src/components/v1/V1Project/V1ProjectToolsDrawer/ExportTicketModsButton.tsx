import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { TicketMod } from 'models/mods'
import { useContext, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { permyriadToPercent } from 'utils/formatNumber'
import { emitErrorNotification } from 'utils/notifications'

const CSV_HEADER: (keyof TicketMod)[] = [
  'beneficiary',
  'percent',
  'preferUnstaked',
  'lockedUntil',
]

const prepareTicketModsCsv = (mods: TicketMod[]): (string | undefined)[][] => {
  const csvContent = mods.map(mod => {
    return [
      mod.beneficiary,
      `${parseFloat(permyriadToPercent(`${mod.percent}`)) / 100}`,
      `${mod.preferUnstaked}`,
      `${mod.lockedUntil}`,
    ]
  })

  return [CSV_HEADER, ...csvContent]
}

export function ExportTicketModsButton() {
  const { handle, currentFC, currentTicketMods } = useContext(V1ProjectContext)
  const [loading, setLoading] = useState<boolean>(false)

  const onExportSplitsButtonClick = () => {
    if (!currentFC || !currentTicketMods) return

    setLoading(true)

    try {
      const csvContent = prepareTicketModsCsv(currentTicketMods)
      const filename = `@${handle}_reserved-tokens_fc-${currentFC.number}`

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
        <Trans>Export token allocation CSV</Trans>
      </span>
    </Button>
  )
}
