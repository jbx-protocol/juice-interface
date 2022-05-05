import { Switch, Tooltip } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import {
  FEATURE_FLAGS,
  featureFlagEnabled,
  setFeatureFlag,
} from 'utils/featureFlags'

import { useState } from 'react'
import { Trans } from '@lingui/macro'

import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'

export default function V2Switch() {
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

  return (
    <Tooltip
      title={
        <>
          <p>
            <Trans>
              The Juicebox V2 frontend is still in development. It is{' '}
              <strong>not recommended</strong> for use on mainnet. Some features
              are missing and there are known bugs.{' '}
              <strong>Use with caution.</strong>
            </Trans>
          </p>
        </>
      }
    >
      <label style={{ marginBottom: 5, color: 'white', display: 'block' }}>
        <Trans>Enable Juicebox V2</Trans> <ExclamationCircleOutlined />
      </label>
      <Switch onChange={onChange} checked={checked} />
    </Tooltip>
  )
}
