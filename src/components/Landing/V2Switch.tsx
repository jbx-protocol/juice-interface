import { Switch, Tooltip } from 'antd'

import {
  FEATURE_FLAGS,
  featureFlagEnabled,
  setFeatureFlag,
} from 'utils/featureFlags'

import { useState } from 'react'

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

  return (
    <Tooltip title="Select if you'd like to enable the Juicebox V2 protocol.">
      <label style={{ marginBottom: 5, color: 'white', display: 'block' }}>
        Enable Juicebox V2
      </label>
      <Switch onChange={onChange} checked={checked} />
    </Tooltip>
  )
}
