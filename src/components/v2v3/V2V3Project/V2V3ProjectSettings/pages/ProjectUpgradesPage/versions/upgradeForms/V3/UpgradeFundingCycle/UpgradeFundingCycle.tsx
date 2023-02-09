import { Space } from 'antd'
import { Callout } from 'components/Callout'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'
import { useInitialEditingData } from '../../../../../ReconfigureFundingCycleSettingsPage/hooks/initialEditingData'
import { LaunchFundingCycleForm } from './LaunchFundingCycleForm'

/**
 * Form to relaunch a V2 funding cycle on V3.
 */
function RelaunchV2FundingCycleForm() {
  // load the initial (presumed V2) funding cycle config.
  useInitialEditingData({ visible: true })

  return <LaunchFundingCycleForm />
}

export function UpgradeFundingCycle() {
  const localStoreRef = useRef<typeof store>()
  if (!localStoreRef.current) {
    localStoreRef.current = createStore()
  }

  return (
    <>
      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <Space direction="vertical">
            <h3 className="text-black dark:text-slate-100">
              Launch V3 funding cycle
            </h3>
            <p>
              You currently have a funding cycle on Juicebox V2. Use the form
              below to relaunch your funding cycle on Juicebox V3.
            </p>

            <Callout.Info className="mb-6">
              Your V2 funding cycle configuration has been prefilled.
            </Callout.Info>

            <RelaunchV2FundingCycleForm />
          </Space>
        </Provider>
      )}
    </>
  )
}
