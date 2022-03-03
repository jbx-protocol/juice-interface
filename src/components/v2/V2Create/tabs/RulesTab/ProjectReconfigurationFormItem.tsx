import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { CSSProperties, useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import ReconfigurationStrategyOption from 'components/shared/ReconfigurationStrategyOption'
import ReconfigurationStrategyDrawer from 'components/shared/ReconfigurationStrategyDrawer'

import {
  DEFAULT_BALLOT_STRATEGY,
  Strategy,
} from 'constants/ballotStrategies/ballotStrategies'
import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'
import { drawerStyle } from 'constants/styles/drawerStyle'
import FormItemLabel from '../../FormItemLabel'

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
    <Form.Item
      label={
        <FormItemLabel>
          <Trans>Reconfiguration</Trans>
        </FormItemLabel>
      }
      style={style}
    >
      <ReconfigurationStrategyOption
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
      <ReconfigurationStrategyDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        initialSelectedStrategy={selectedStrategy}
        onSave={(strategy: Strategy) => {
          setSelectedStrategy(strategy)
          setDrawerVisible(false)
          onChange(strategy.address ?? DEFAULT_BALLOT_STRATEGY.address) // default to 3-day
        }}
        style={drawerStyle}
      />
      <div style={{ color: colors.text.secondary, marginTop: 10 }}>
        <Trans>
          Rules for how this project's funding cycles can be reconfigured.
        </Trans>
      </div>
    </Form.Item>
  )
}
