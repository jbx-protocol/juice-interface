import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { RESERVED_TOKEN_SPLIT_GROUP } from 'constants/splits'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useSetProjectSplits } from 'hooks/v2v3/transactor/SetProjectSplits'
import { Split } from 'models/splits'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { preciseFormatSplitPercent } from 'utils/v2v3/math'
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
        editingReservedTokensSplits={editingReservedTokensSplits}
        setEditingReservedTokensSplits={setEditingReservedTokensSplits}
      />
      <Button
        loading={loading}
        onClick={() => onSaveTokenAllocation()}
        disabled={totalPercentagesInvalid}
        type="primary"
      >
        <span>
          <Trans>Save token allocation</Trans>
        </span>
      </Button>
    </>
  )
}
