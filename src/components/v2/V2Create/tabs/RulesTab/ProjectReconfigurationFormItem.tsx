import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import { CSSProperties, useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import ReconfigurationDrawer from 'components/v2/V2Create/tabs/RulesTab/ReconfigurationDrawer'
import ReconfigurationOption from 'components/v2/V2Create/tabs/RulesTab/ReconfigurationOption'

import {
  DEFAULT_BALLOT_STRATEGY,
  Strategy,
} from 'constants/ballotStrategies/ballotStrategies'
import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'

export default function ProjectReconfigurationFormItem({
  value,
  onChange,
  style = {},
}: {
  value: string
  onChange: (address: string) => void
  style?: CSSProperties
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(
    getBallotStrategyByAddress(value),
  )

  return (
    <Form.Item label={t`Reconfiguration`} style={style}>
      <ReconfigurationOption
        title={selectedStrategy.name}
        index={0}
        content={
          <div>
            <p>{selectedStrategy.description}</p>
            <p style={{ fontSize: '0.7rem', color: colors.text.tertiary }}>
              <Trans>Contract address: {selectedStrategy.address}</Trans>
            </p>
          </div>
        }
        selected={true}
        strategy={selectedStrategy}
        onSelectBallot={() => setDrawerVisible(true)}
      />
      <ReconfigurationDrawer
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        initialSelectedStrategy={selectedStrategy}
        onSave={(strategy: Strategy) => {
          setSelectedStrategy(strategy)
          onChange(strategy.address ?? DEFAULT_BALLOT_STRATEGY.address) // default to 3-day
        }}
      />
      <div style={{ color: colors.text.secondary, marginTop: 10 }}>
        Rules for how this project's funding cycles can be reconfigured.
      </div>
    </Form.Item>
  )
}
