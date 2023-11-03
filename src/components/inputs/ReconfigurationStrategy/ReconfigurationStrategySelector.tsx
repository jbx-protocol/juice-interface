import { t, Trans } from '@lingui/macro'
import FormItemWarningText from 'components/FormItemWarningText'
import ReconfigurationStrategyOption from 'components/inputs/ReconfigurationStrategy/ReconfigurationStrategyOption'
import { RECONFIG_RULES_WARN } from 'components/strings'
import { BallotStrategy } from 'models/ballot'
import { useState } from 'react'
import { isEqualAddress } from 'utils/address'
import { createCustomStrategy } from 'utils/ballot'
import { CustomStrategyInput } from './CustomStrategyInput'

const CUSTOM_STRATEGY_INDEX = -1

export default function ReconfigurationStrategySelector({
  selectedStrategy,
  onChange,
  ballotStrategies,
}: {
  ballotStrategies: BallotStrategy[]
  selectedStrategy: BallotStrategy
  onChange: (strategy: BallotStrategy) => void
}) {
  const selectedStrategyIndex = ballotStrategies.findIndex(s => {
    return isEqualAddress(s.address, selectedStrategy.address)
  })
  const selectedIsCustom = selectedStrategyIndex === CUSTOM_STRATEGY_INDEX // selected strategy is the custom strategy

  const [customStrategyAddress, setCustomStrategyAddress] = useState<string>(
    selectedIsCustom ? selectedStrategy.address : '', // only set if selected strategy is custom
  )

  const customStrategy = createCustomStrategy(customStrategyAddress)

  return (
    <div className="flex flex-col gap-2">
      {isEqualAddress(
        ballotStrategies[selectedStrategyIndex]?.address,
        ballotStrategies[0].address,
      ) && <FormItemWarningText>{RECONFIG_RULES_WARN}</FormItemWarningText>}
      {ballotStrategies.map((strategy: BallotStrategy, idx) => (
        <ReconfigurationStrategyOption
          title={strategy.name}
          key={strategy.address}
          content={
            <div>
              <p>{strategy.description}</p>
              <p className="text-xs text-grey-400 dark:text-slate-200">
                <Trans>Contract address: {strategy.address}</Trans>
              </p>
            </div>
          }
          strategy={strategy}
          selected={selectedStrategyIndex === idx}
          onSelectBallot={() => onChange(strategy)}
        />
      ))}
      <ReconfigurationStrategyOption
        title={t`Custom strategy`}
        content={
          <CustomStrategyInput
            value={customStrategyAddress}
            onChange={(address: string) => {
              setCustomStrategyAddress(address)
              onChange(createCustomStrategy(address))
            }}
          />
        }
        strategy={customStrategy}
        selected={selectedIsCustom}
        onSelectBallot={() => onChange(customStrategy)}
      />
    </div>
  )
}
