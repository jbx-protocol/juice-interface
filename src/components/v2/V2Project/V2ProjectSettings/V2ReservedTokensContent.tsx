import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useSetProjectSplits } from 'hooks/v2/transactor/SetProjectSplits'
import { Split } from 'models/v2/splits'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { preciseFormatSplitPercent } from 'utils/v2/math'

import { EditTokenAllocation } from 'components/v2/V2Project/EditTokenAllocation'
import { RESERVED_TOKEN_SPLIT_GROUP } from 'constants/v2/splits'

const EditTokenAllocationContent = () => {
  const { reservedTokensSplits, fundingCycle } = useContext(V2ProjectContext)

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
      <EditTokenAllocation
        editingReservedTokensSplits={editingReservedTokensSplits}
        setEditingReservedTokensSplits={setEditingReservedTokensSplits}
      />
      <Button
        loading={loading}
        onClick={() => onSaveTokenAllocation()}
        disabled={totalPercentagesInvalid}
        type="primary"
      >
        <Trans>Save token allocation</Trans>
      </Button>
    </>
  )
}

export default EditTokenAllocationContent
