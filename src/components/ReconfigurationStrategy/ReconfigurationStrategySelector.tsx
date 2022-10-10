import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

import ReconfigurationStrategyOption from 'components/ReconfigurationStrategy/ReconfigurationStrategyOption'

import { BallotStrategy } from 'models/ballot'

import { createCustomStrategy } from 'utils/ballot'

import FormItemWarningText from '../FormItemWarningText'
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
  const { colors } = useContext(ThemeContext).theme

  const selectedStrategyIndex = ballotStrategies.findIndex(s => {
    return s.address?.toLowerCase() === selectedStrategy.address?.toLowerCase()
  })
  const selectedIsCustom = selectedStrategyIndex === CUSTOM_STRATEGY_INDEX // selected strategy is the custom strategy

  const [customStrategyAddress, setCustomStrategyAddress] = useState<string>(
    selectedIsCustom ? selectedStrategy.address : '', // only set if selected strategy is custom
  )

  const customStrategy = createCustomStrategy(customStrategyAddress)

  return (
    <Space direction="vertical">
      {ballotStrategies[selectedStrategyIndex]?.address ===
        ballotStrategies[0].address && (
        <FormItemWarningText>
          <Trans>
            Using a reconfiguration strategy is recommended. Projects with no
            strategy will appear risky to contributors.
          </Trans>
        </FormItemWarningText>
      )}
      {ballotStrategies.map((strategy: BallotStrategy, idx) => (
        <ReconfigurationStrategyOption
          title={strategy.name}
          key={strategy.address}
          content={
            <div>
              <p>{strategy.description}</p>
              <p style={{ fontSize: '0.7rem', color: colors.text.tertiary }}>
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
    </Space>
  )
}
