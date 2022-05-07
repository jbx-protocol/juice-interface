import { Switch, Tooltip } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  FEATURE_FLAGS,
  featureFlagEnabled,
  setFeatureFlag,
  featureFlagDefaultEnabled,
} from 'utils/featureFlags'
import { CSSProperties, useContext, useState } from 'react'
import { Trans } from '@lingui/macro'
import { NetworkName } from 'models/network-name'
import { ThemeContext } from 'contexts/themeContext'

import { readNetwork } from 'constants/networks'

export default function V2Switch({
  labelStyle,
}: {
  labelStyle?: CSSProperties
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [checked, setChecked] = useState<boolean>(
    featureFlagEnabled(FEATURE_FLAGS.ENABLE_V2),
  )

  const onChange = (newChecked: boolean) => {
    setChecked(newChecked)
    setFeatureFlag(FEATURE_FLAGS.ENABLE_V2, newChecked)

    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  // don't show the switch on mainnet for now.
  if (readNetwork.name === NetworkName.mainnet) return null

  const isV2DefaultEnabled = featureFlagDefaultEnabled(FEATURE_FLAGS.ENABLE_V2)

  return (
    <Tooltip
      title={
        <>
          <p>
            <Trans>Create and view projects on the V2 Juicebox protocol.</Trans>
          </p>
          {!isV2DefaultEnabled ? (
            <p>
              <Trans>
                The Juicebox V2 frontend is still in development. It is{' '}
                <strong>not recommended</strong> for use on mainnet. Some
                features are missing and there are known bugs.{' '}
                <strong>Use with caution.</strong>
              </Trans>
            </p>
          ) : null}
        </>
      }
    >
      <label
        style={{
          marginBottom: 5,
          color: colors.text.primary,
          display: 'block',
          ...labelStyle,
        }}
      >
        <Trans>Enable Juicebox V2</Trans> <ExclamationCircleOutlined />
      </label>
      <Switch onChange={onChange} checked={checked} />
    </Tooltip>
  )
}
