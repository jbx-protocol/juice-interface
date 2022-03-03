import { t, Trans } from '@lingui/macro'
import { Button, Drawer, DrawerProps, Input, Space } from 'antd'
import * as constants from '@ethersproject/constants'
import { isAddress } from '@ethersproject/address'
import { NetworkContext } from 'contexts/networkContext'
import { useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import ReconfigurationStrategyOption from 'components/shared/ReconfigurationStrategyOption'

import {
  ballotStrategies,
  createCustomStrategy,
  Strategy,
} from 'constants/ballotStrategies/ballotStrategies'
import ExternalLink from './ExternalLink'

const CUSTOM_STRATEGY_INDEX = -1

function CustomStrategyInput({
  address,
  setAddress,
}: {
  address?: string
  setAddress: (address: string) => void
}) {
  const { signerNetwork } = useContext(NetworkContext)
  return (
    <div>
      <Input
        style={{ width: 400 }}
        value={address}
        placeholder={constants.AddressZero}
        onChange={e => setAddress(e.target.value.toLowerCase())}
      />
      <p>
        <Trans>
          The address of any smart contract deployed on {signerNetwork} that
          implements
        </Trans>{' '}
        <ExternalLink href="https://github.com/jbx-protocol/juice-contracts-v1/blob/05828d57e3a27580437fc258fe9041b2401fc044/contracts/FundingCycles.sol">
          this interface
        </ExternalLink>
        .
      </p>
    </div>
  )
}

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
  const { colors } = useContext(ThemeContext).theme

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(
    initialSelectedStrategy,
  )

  const selectedStrategyIndex = ballotStrategies().findIndex(s => {
    return s.address?.toLowerCase() === selectedStrategy.address?.toLowerCase()
  })

  const selectedIsCustom = selectedStrategyIndex === CUSTOM_STRATEGY_INDEX // selected strategy is the custom strat

  const [customStrategyAddress, setCustomStrategyAddress] = useState<string>(
    selectedIsCustom ? initialSelectedStrategy.address : '', // only set if selected strategy is custom
  )

  const customStrategy = createCustomStrategy(customStrategyAddress)

  return (
    <Drawer visible={visible} {...style} onClose={onClose}>
      <Space direction="vertical">
        <h1>
          <Trans>Reconfiguration</Trans>
        </h1>

        <div>
          <p style={{ color: colors.text.secondary }}>
            <Trans>
              Rules for how this project's funding cycles can be reconfigured.
            </Trans>
          </p>

          {ballotStrategies()[selectedStrategyIndex]?.address ===
            ballotStrategies()[0].address && (
            <p style={{ color: colors.text.warn }}>
              <Trans>
                Using a reconfiguration strategy is recommended. Projects with
                no strategy will appear risky to contributors.
              </Trans>
            </p>
          )}
        </div>
        {ballotStrategies().map((s: Strategy, i) => (
          <ReconfigurationStrategyOption
            title={s.name}
            key={i}
            content={
              <div>
                <p>{s.description}</p>
                <p style={{ fontSize: '0.7rem', color: colors.text.tertiary }}>
                  <Trans>Contract address: {s.address}</Trans>
                </p>
              </div>
            }
            strategy={s}
            selected={selectedStrategyIndex === i}
            onSelectBallot={() => setSelectedStrategy(s)}
            index={i}
          />
        ))}
        <ReconfigurationStrategyOption
          title={t`Custom strategy`}
          content={
            <CustomStrategyInput
              address={customStrategyAddress}
              setAddress={(address: string) => {
                setCustomStrategyAddress(address)
                // Ensure custom strategy is selected
                if (selectedIsCustom) {
                  setSelectedStrategy(createCustomStrategy(address))
                }
              }}
            />
          }
          index={CUSTOM_STRATEGY_INDEX}
          strategy={customStrategy}
          selected={selectedIsCustom}
          onSelectBallot={() => setSelectedStrategy(customStrategy)}
        />
        <Button
          htmlType="submit"
          type="primary"
          disabled={
            selectedStrategy === undefined ||
            (selectedIsCustom &&
              (!customStrategyAddress || !isAddress(customStrategyAddress)))
          }
          onClick={() => {
            onSave(selectedStrategy)
          }}
        >
          <Trans>Save</Trans>
        </Button>
      </Space>
    </Drawer>
  )
}
