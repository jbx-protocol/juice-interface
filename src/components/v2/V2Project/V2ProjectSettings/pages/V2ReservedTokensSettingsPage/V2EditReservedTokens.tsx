import { Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import Callout from 'components/Callout'
import { CsvUpload } from 'components/CsvUpload/CsvUpload'
import { FormItems } from 'components/formItems'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { Split } from 'models/splits'
import { useCallback, useContext, useEffect } from 'react'
import { parseV2SplitsCsv } from 'utils/csv'
import { toMod, toSplit } from 'utils/splits'
import { formatReservedRate } from 'utils/v2/math'

export function V2EditReservedTokens({
  editingReservedTokensSplits,
  setEditingReservedTokensSplits,
}: {
  editingReservedTokensSplits: Split[]
  setEditingReservedTokensSplits: (splits: Split[]) => void
}) {
  const { reservedTokensSplits, fundingCycleMetadata } =
    useContext(V2ProjectContext)
  const reservedRate = fundingCycleMetadata?.reservedRate

  useEffect(() => {
    if (!reservedTokensSplits) return
    setEditingReservedTokensSplits(reservedTokensSplits)
  }, [reservedTokensSplits, setEditingReservedTokensSplits])

  const onSplitsChanged = useCallback(
    (newSplits: Split[]) => {
      setEditingReservedTokensSplits(newSplits)
    },
    [setEditingReservedTokensSplits],
  )

  return (
    <>
      <Callout style={{ marginBottom: '1rem' }}>
        <Trans>
          Changes to your reserved token allocation will take effect
          immediately.
        </Trans>
      </Callout>
      <Space
        direction="vertical"
        style={{ width: '100%', minHeight: 0 }}
        size="middle"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Trans>Reserved token allocation</Trans>
          <CsvUpload
            onChange={onSplitsChanged}
            templateUrl={'/assets/csv/v2-splits-template.csv'}
            parser={parseV2SplitsCsv}
          />
        </div>
        <Form layout="vertical">
          <FormItems.ProjectTicketMods
            mods={editingReservedTokensSplits.map(toMod)}
            onModsChanged={mods =>
              setEditingReservedTokensSplits(mods.map(toSplit))
            }
            formItemProps={{
              extra: (
                <Trans>
                  Allocate a portion of your project's reserved tokens to other
                  Ethereum wallets or Juicebox projects.
                </Trans>
              ),
            }}
            reservedRate={parseInt(formatReservedRate(reservedRate))}
          />
        </Form>
      </Space>
    </>
  )
}
