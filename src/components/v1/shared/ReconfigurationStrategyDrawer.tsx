import { Trans } from '@lingui/macro'
import { Button, Drawer, DrawerProps } from 'antd'

import ReconfigurationStrategySelector from 'components/ReconfigurationStrategy/ReconfigurationStrategySelector'
import { ThemeContext } from 'contexts/themeContext'
import { BallotStrategy } from 'models/ballot'
import { useContext, useEffect, useState } from 'react'

import { ballotStrategies } from 'constants/v1/ballotStrategies'

export default function ReconfigurationStrategyDrawer({
  open,
  onClose,
  initialSelectedStrategy,
  style = {},
  onSave,
}: {
  open: boolean
  onClose: () => void
  initialSelectedStrategy: BallotStrategy
  style?: Partial<DrawerProps>
  onSave: (strategy: BallotStrategy) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [strategy, setStrategy] = useState<BallotStrategy>(
    initialSelectedStrategy,
  )

  useEffect(() => {
    setStrategy(initialSelectedStrategy)
  }, [initialSelectedStrategy])

  return (
    <Drawer open={open} {...style} onClose={onClose}>
      <h1>
        <Trans>Reconfiguration rules</Trans>
      </h1>
      <p style={{ color: colors.text.secondary }}>
        <Trans>
          Rules for how this project's funding cycles can be reconfigured.
        </Trans>
      </p>

      <ReconfigurationStrategySelector
        ballotStrategies={ballotStrategies()}
        selectedStrategy={strategy}
        onChange={strategy => setStrategy(strategy)}
      />

      <Button
        type="primary"
        onClick={() => onSave(strategy)}
        style={{ marginTop: '1rem' }}
      >
        <Trans>Save rules</Trans>
      </Button>
    </Drawer>
  )
}
