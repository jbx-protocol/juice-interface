import { Badge } from 'components/Badge'
import { JuiceSwitch } from 'components/JuiceSwitch'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { useCallback, useState } from 'react'
import { featureFlagEnabled, setFeatureFlag } from 'utils/featureFlags'

export default function FlagsPage() {
  const [, updateState] = useState({})
  const forceUpdate = useCallback(() => updateState({}), [])

  const flags = [...Object.keys(FEATURE_FLAGS)].sort()

  const onSwitchChange = (flag: string, v: boolean) => {
    setFeatureFlag(flag, v)
    forceUpdate()
  }

  return (
    <div className="container-lg container mx-auto mt-10">
      <h1 className="flex items-center">
        Feature flags
        <Badge variant="info" className="ml-2 capitalize">
          {readNetwork.name}
        </Badge>
      </h1>

      <div className="flex flex-col gap-y-5">
        {flags.map(key => {
          return (
            <JuiceSwitch
              label={FEATURE_FLAGS[key]}
              key={key}
              value={featureFlagEnabled(FEATURE_FLAGS[key])}
              onChange={v => onSwitchChange(FEATURE_FLAGS[key], v)}
            />
          )
        })}
      </div>
    </div>
  )
}
