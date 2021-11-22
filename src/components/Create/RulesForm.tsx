import { CheckCircleFilled } from '@ant-design/icons'
import { Button, Input, Space } from 'antd'
import { ballotStrategies } from 'constants/ballot-strategies'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { constants, utils } from 'ethers'
import { useContext, useLayoutEffect, useState } from 'react'

export default function RulesForm({
  initialBallot,
  onSave,
}: {
  initialBallot: string
  onSave: (ballot: string) => void
}) {
  const { signerNetwork } = useContext(NetworkContext)
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [customStrategyAddress, setCustomStrategyAddress] = useState<string>()

  useLayoutEffect(() => {
    const index = ballotStrategies.findIndex(
      s => s.address.toLowerCase() === initialBallot.toLowerCase(),
    )
    if (index > -1) setSelectedIndex(index)
    else {
      setSelectedIndex(ballotStrategies.length)
      setCustomStrategyAddress(initialBallot)
    }
  }, [initialBallot])

  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const buildOption = (title: string, content: JSX.Element, index: number) => (
    <div
      key={index}
      className="clickable-border"
      style={{
        display: 'flex',
        padding: 10,
        borderRadius: radii.md,
        cursor: 'pointer',
        ...(index === selectedIndex
          ? { border: '1px solid ' + colors.stroke.action.primary }
          : {}),
      }}
      onClick={() => setSelectedIndex(index)}
    >
      <div
        style={{
          marginRight: 10,
          minWidth: 20,
          color: colors.text.action.primary,
        }}
      >
        {index === selectedIndex ? <CheckCircleFilled /> : null}
      </div>
      <div>
        <h3
          style={{
            color:
              index === selectedIndex
                ? colors.text.action.primary
                : colors.text.primary,
          }}
        >
          {title}
        </h3>
        {content}
      </div>
    </div>
  )

  return (
    <Space direction="vertical" size="large">
      <h1>Reconfiguration</h1>

      <p style={{ color: colors.text.secondary }}>
        Rules for how this project's funding cycles can be reconfigured.
      </p>

      <Space direction="vertical">
        {ballotStrategies.map((s, i) =>
          buildOption(
            s.name,
            <div>
              <p>{s.description}</p>
              <p style={{ fontSize: '0.7rem', color: colors.text.tertiary }}>
                Contract address: {s.address}
              </p>
            </div>,
            i,
          ),
        )}
        {buildOption(
          'Custom strategy',
          <div>
            <Input
              style={{ width: 400 }}
              value={customStrategyAddress}
              placeholder={constants.AddressZero}
              onChange={e =>
                setCustomStrategyAddress(e.target.value.toLowerCase())
              }
            />
            <p>
              The address of any smart contract deployed on {signerNetwork} that
              implements{' '}
              <a
                href="https://github.com/jbx-protocol/juice-contracts/blob/main/contracts/v1/interfaces/IFundingCycleBallot.sol"
                target="_blank"
                rel="noopener noreferrer"
              >
                this interface
              </a>
              .
            </p>
          </div>,
          ballotStrategies.length,
        )}
      </Space>

      <Button
        htmlType="submit"
        type="primary"
        disabled={
          selectedIndex === undefined ||
          (selectedIndex === ballotStrategies.length &&
            (!customStrategyAddress || !utils.isAddress(customStrategyAddress)))
        }
        onClick={() => {
          onSave(
            selectedIndex !== undefined &&
              selectedIndex < ballotStrategies.length
              ? ballotStrategies[selectedIndex].address
              : customStrategyAddress ?? constants.AddressZero,
          )
        }}
      >
        Save
      </Button>
    </Space>
  )
}
