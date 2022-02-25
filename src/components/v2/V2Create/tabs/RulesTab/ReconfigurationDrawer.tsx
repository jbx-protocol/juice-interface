import { t, Trans } from '@lingui/macro'
import { Button, Drawer, DrawerProps, Input, Space } from 'antd'
import { constants, utils } from 'ethers'
import { NetworkContext } from 'contexts/networkContext'
import { useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import { drawerWidth } from 'utils/drawerWidth'

import ReconfigurationOption from 'components/v2/V2Create/tabs/RulesTab/ReconfigurationOption'

import {
  ballotStrategies,
  createCustomStrategy,
  Strategy,
} from 'constants/ballotStrategies/ballotStrategies'

function CustomStrategyForm({
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
        value={address ?? ''}
        placeholder={constants.AddressZero}
        onChange={e => setAddress(e.target.value.toLowerCase())}
      />
      <p>
        <Trans>
          The address of any smart contract deployed on {signerNetwork} that
          implements
        </Trans>{' '}
        <a
          href="https://github.com/jbx-protocol/juice-contracts-v1/blob/05828d57e3a27580437fc258fe9041b2401fc044/contracts/FundingCycles.sol"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>this interface</Trans>
        </a>
        .
      </p>
    </div>
  )
}

export default function ReconfigurationDrawer({
  visible,
  onClose,
  initialSelectedStrategy,
  onSave,
}: {
  visible: boolean
  onClose: () => void
  initialSelectedStrategy: Strategy
  onSave: Function
}) {
  const { colors } = useContext(ThemeContext).theme

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(
    initialSelectedStrategy,
  )

  const selectedStrategyIndex = ballotStrategies().findIndex(s => {
    return s.address?.toLowerCase() === selectedStrategy.address?.toLowerCase()
  })

  const [customStrategyAddress, setCustomStrategyAddress] = useState<string>(
    selectedStrategyIndex === -1 ? initialSelectedStrategy.address : '', // only set if selected strategy is custom
  )

  const drawerStyle: Partial<DrawerProps> = {
    placement: 'right',
    width: drawerWidth(),
  }

  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onClose}>
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
          <ReconfigurationOption
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
        <ReconfigurationOption
          title={t`Custom strategy`}
          content={
            <CustomStrategyForm
              address={customStrategyAddress}
              setAddress={(address: string) => {
                setCustomStrategyAddress(address)
                // Ensure custom strategy is selected
                if (selectedStrategyIndex === -1) {
                  setSelectedStrategy(createCustomStrategy(address))
                }
              }}
            />
          }
          index={-1}
          strategy={createCustomStrategy(customStrategyAddress)}
          selected={selectedStrategyIndex === -1}
          onSelectBallot={() =>
            setSelectedStrategy(createCustomStrategy(customStrategyAddress))
          }
        />
        <Button
          htmlType="submit"
          type="primary"
          disabled={
            selectedStrategy === undefined ||
            (selectedStrategyIndex === -1 && // custom strategy
              (!customStrategyAddress ||
                !utils.isAddress(customStrategyAddress)))
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
