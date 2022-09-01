import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useSetProjectSplits } from 'hooks/v2/transactor/SetProjectSplits'
import { Split } from 'models/v2/splits'
import { useCallback, useContext, useMemo, useState } from 'react'
import { getTotalSplitsPercentage } from 'utils/v2/distributions'

import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/v2/splits'

import { V2EditPayouts } from '../../V2EditPayouts'

export function V2PayoutsSettingsPage() {
  const { fundingCycle } = useContext(V2ProjectContext)
  const [loading, setLoading] = useState(false)
  const [editingSplits, setEditingSplits] = useState<Split[]>([])
  const totalSplitsPercentage = useMemo(
    () => getTotalSplitsPercentage(editingSplits),
    [editingSplits],
  )
  const totalSplitsPercentageInvalid = totalSplitsPercentage > 100
  const setProjectSplits = useSetProjectSplits({
    domain: fundingCycle?.configuration?.toString(),
  })

  const onSplitsConfirmed = useCallback(
    async (splits: Split[]) => {
      if (totalSplitsPercentageInvalid) return
      setLoading(true)
      const tx = await setProjectSplits(
        {
          groupedSplits: {
            group: ETH_PAYOUT_SPLIT_GROUP,
            splits,
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
        setLoading(false)
      }
    },
    [setProjectSplits, totalSplitsPercentageInvalid],
  )

  return (
    <Space direction="vertical" size="middle">
      <V2EditPayouts
        editingSplits={editingSplits}
        setEditingSplits={setEditingSplits}
      />
      <Button
        loading={loading}
        onClick={() => onSplitsConfirmed(editingSplits)}
        disabled={totalSplitsPercentageInvalid}
        type="primary"
      >
        <span>
          <Trans>Save payouts</Trans>
        </span>
      </Button>
    </Space>
  )
}
