import { Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { Callout } from 'components/Callout'
import { CsvUpload } from 'components/inputs/CsvUpload'
import { FormItems } from 'components/formItems'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { Split } from 'models/splits'
import { useCallback, useContext, useEffect } from 'react'
import { parseV2SplitsCsv } from 'utils/csv'
import { toMod, toSplit } from 'utils/splits'
import { formatReservedRate } from 'utils/v2v3/math'

export function V2V3EditReservedTokens({
  editingReservedTokensSplits,
  setEditingReservedTokensSplits,
}: {
  editingReservedTokensSplits: Split[]
  setEditingReservedTokensSplits: (splits: Split[]) => void
}) {
  const { reservedTokensSplits, fundingCycleMetadata } =
    useContext(V2V3ProjectContext)
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
      <Callout.Info className="mb-4">
        <Trans>
          Changes to your reserved token recipients will take effect
          immediately.
        </Trans>
      </Callout.Info>
      <Space className="min-h-0 w-full" direction="vertical" size="middle">
        <div className="flex justify-between">
          <Trans>Reserved token recipients</Trans>
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
                  Set aside a percentage of token issuance for the Ethereum
                  wallets or Juicebox projects of your choice.
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
