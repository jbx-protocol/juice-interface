import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { RESERVED_TOKEN_SPLIT_GROUP } from 'constants/splits'
import { Split } from 'models/splits'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useSetProjectSplits } from 'packages/v2v3/hooks/transactor/useSetProjectSplitsTx'
import { preciseFormatSplitPercent } from 'packages/v2v3/utils/math'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { V2V3EditReservedTokens } from './V2V3EditReservedTokens'

export function ReservedTokensSettingsPage() {
  const { reservedTokensSplits, fundingCycle } = useContext(V2V3ProjectContext)

  const setProjectSplits = useSetProjectSplits({
    domain: fundingCycle?.configuration?.toString(),
  })

  const [editingReservedTokensSplits, setEditingReservedTokensSplits] =
    useState<Split[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!reservedTokensSplits) return
    setEditingReservedTokensSplits(reservedTokensSplits)
  }, [reservedTokensSplits])

  const totalPercentage = useMemo(
    () =>
      editingReservedTokensSplits
        ?.map(s => preciseFormatSplitPercent(s.percent))
        .reduce((a, b) => a + b, 0) ?? 0,
    [editingReservedTokensSplits],
  )

  const totalPercentagesInvalid = totalPercentage > 100

  const onSaveTokenAllocation = useCallback(async () => {
    if (totalPercentagesInvalid) return
    setLoading(true)
    const tx = await setProjectSplits(
      {
        groupedSplits: {
          group: RESERVED_TOKEN_SPLIT_GROUP,
          splits: editingReservedTokensSplits ?? [],
        },
      },
      {
        onConfirmed: () => {
          setLoading(false)
        },
        onError: () => setLoading(false),
      },
    )
    if (!tx) {
      emitErrorNotification('Token allocation edit failed')
      setLoading(false)
    }
  }, [editingReservedTokensSplits, setProjectSplits, totalPercentagesInvalid])

  return (
    <>
      <V2V3EditReservedTokens
        showInstantChangesCallout
        editingReservedTokensSplits={editingReservedTokensSplits}
        setEditingReservedTokensSplits={setEditingReservedTokensSplits}
      />
      <Button
        loading={loading}
        onClick={() => onSaveTokenAllocation()}
        disabled={totalPercentagesInvalid}
        type="primary"
        className="mt-4"
      >
        <span>
          <Trans>Save token recipients</Trans>
        </span>
      </Button>
    </>
  )
}
