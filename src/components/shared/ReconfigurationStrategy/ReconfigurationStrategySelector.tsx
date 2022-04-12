import { t, Trans } from '@lingui/macro'
import { Input, Space } from 'antd'
import * as constants from '@ethersproject/constants'
import { NetworkContext } from 'contexts/networkContext'
import { useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import ReconfigurationStrategyOption from 'components/shared/ReconfigurationStrategy/ReconfigurationStrategyOption'

import {
  ballotStrategies,
  createCustomStrategy,
  Strategy,
} from 'constants/ballotStrategies/ballotStrategies'
import ExternalLink from '../ExternalLink'

const CUSTOM_STRATEGY_INDEX = -1

function CustomStrategyInput({
  value,
  onChange,
}: {
  value?: string
  onChange: (address: string) => void
}) {
  const { signerNetwork } = useContext(NetworkContext)
  return (
    <div>
      <Input
        style={{ width: 400 }}
        value={value}
        placeholder={constants.AddressZero}
        onChange={e => onChange(e.target.value.toLowerCase())}
      />
      <p>
        <Trans>
          The address of any smart contract deployed on {signerNetwork} that
          implements
        </Trans>{' '}
        <ExternalLink href="https://github.com/jbx-protocol/juice-contracts-v1/blob/main/contracts/FundingCycles.sol">
          this interface
        </ExternalLink>
        .
      </p>
    </div>
  )
}

export default function ReconfigurationStrategySelector({
  selectedStrategy,
  onChange,
}: {
  selectedStrategy: Strategy
  onChange: (strategy: Strategy) => void
}) {
  const { colors } = useContext(ThemeContext).theme

  const selectedStrategyIndex = ballotStrategies().findIndex(s => {
    return s.address?.toLowerCase() === selectedStrategy.address?.toLowerCase()
  })
  const selectedIsCustom = selectedStrategyIndex === CUSTOM_STRATEGY_INDEX // selected strategy is the custom strategy

  const [customStrategyAddress, setCustomStrategyAddress] = useState<string>(
    selectedIsCustom ? selectedStrategy.address : '', // only set if selected strategy is custom
  )

  const customStrategy = createCustomStrategy(customStrategyAddress)

  return (
    <Space direction="vertical">
      {ballotStrategies()[selectedStrategyIndex]?.address ===
        ballotStrategies()[0].address && (
        <p style={{ color: colors.text.warn }}>
          <Trans>
            Using a reconfiguration strategy is recommended. Projects with no
            strategy will appear risky to contributors.
          </Trans>
        </p>
      )}
      {ballotStrategies().map((strategy: Strategy, idx) => (
        <ReconfigurationStrategyOption
          title={strategy.name}
          key={idx}
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
          index={idx}
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
        index={CUSTOM_STRATEGY_INDEX}
        strategy={customStrategy}
        selected={selectedIsCustom}
        onSelectBallot={() => onChange(customStrategy)}
      />
    </Space>
  )
}
