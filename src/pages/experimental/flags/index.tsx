import { Badge } from 'components/Badge'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import { featureFlagEnabled, setFeatureFlag } from 'utils/featureFlags'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function FlagsPage() {
  const [, updateState] = useState({})
  const forceUpdate = useCallback(() => updateState({}), [])

  const flags = [
    ...Object.keys(FEATURE_FLAGS),
  ].sort() as (keyof typeof FEATURE_FLAGS)[]

  const onSwitchChange = (flag: string, v: boolean) => {
    setFeatureFlag(flag, v)
    forceUpdate()
  }

  return (
    <>
      <Head>
        <meta key="robots" name="robots" content="noindex,follow" />
        <meta key="googlebot" name="googlebot" content="noindex,follow" />
      </Head>
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
    </>
  )
}

export const getServerSideProps = globalGetServerSideProps
