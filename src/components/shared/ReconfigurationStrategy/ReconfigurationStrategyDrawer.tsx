import { Trans } from '@lingui/macro'
import { Button, Drawer, DrawerProps } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

import { Strategy } from 'constants/ballotStrategies/ballotStrategies'
import ReconfigurationStrategySelector from './ReconfigurationStrategySelector'

export default function ReconfigurationStrategyDrawer({
  visible,
  onClose,
  initialSelectedStrategy,
  style = {},
  onSave,
}: {
  visible: boolean
  onClose: () => void
  initialSelectedStrategy: Strategy
  style?: Partial<DrawerProps>
  onSave: (strategy: Strategy) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [strategy, setStrategy] = useState<Strategy>(initialSelectedStrategy)

  return (
    <Drawer visible={visible} {...style} onClose={onClose}>
      <h1>
        <Trans>Reconfiguration rules</Trans>
      </h1>
      <p style={{ color: colors.text.secondary }}>
        <Trans>
          Rules for how this project's funding cycles can be reconfigured.
        </Trans>
      </p>

      <ReconfigurationStrategySelector
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
