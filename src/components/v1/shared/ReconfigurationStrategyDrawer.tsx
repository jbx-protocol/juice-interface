import { Trans } from '@lingui/macro'
import { Button, Drawer, DrawerProps } from 'antd'

import ReconfigurationStrategySelector from 'components/inputs/ReconfigurationStrategy/ReconfigurationStrategySelector'
import { BallotStrategy } from 'models/ballot'
import { useEffect, useState } from 'react'

import { RECONFIG_RULES_EXPLANATION } from 'components/strings'
import { ballotStrategies } from 'constants/v1/ballotStrategies'

export default function ReconfigurationStrategyDrawer({
  className,
  open,
  onClose,
  initialSelectedStrategy,
  placement,
  width,
  onSave,
}: {
  className?: string
  placement?: DrawerProps['placement']
  width?: DrawerProps['width']
  open: boolean
  onClose: () => void
  initialSelectedStrategy: BallotStrategy
  onSave: (strategy: BallotStrategy) => void
}) {
  const [strategy, setStrategy] = useState<BallotStrategy>(
    initialSelectedStrategy,
  )

  useEffect(() => {
    setStrategy(initialSelectedStrategy)
  }, [initialSelectedStrategy])

  return (
    <Drawer
      className={className}
      open={open}
      placement={placement}
      width={width}
      onClose={onClose}
    >
      <h1 className="text-2xl">
        <Trans>Edit deadline</Trans>
      </h1>
      <p className="text-grey-500 dark:text-grey-300">
        {RECONFIG_RULES_EXPLANATION}
      </p>

      <ReconfigurationStrategySelector
        ballotStrategies={ballotStrategies()}
        selectedStrategy={strategy}
        onChange={strategy => setStrategy(strategy)}
      />

      <Button className="mt-4" type="primary" onClick={() => onSave(strategy)}>
        <Trans>Save deadline</Trans>
      </Button>
    </Drawer>
  )
}
