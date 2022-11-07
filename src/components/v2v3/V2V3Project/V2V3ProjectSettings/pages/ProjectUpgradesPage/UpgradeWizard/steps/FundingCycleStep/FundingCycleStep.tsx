import { useRef } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'
import { useInitialEditingData } from '../../../../ReconfigureFundingCycleSettingsPage/hooks/initialEditingData'
import { LaunchFundingCycleForm } from './LaunchFundingCycleForm'

/**
 * Form to relaunch a V2 funding cycle on V3.
 */
function RelaunchV2FundingCycleForm() {
  // load the initial (presumed V2) funding cycle config.
  useInitialEditingData({ visible: true })

  return <LaunchFundingCycleForm />
}

/**
 * Form to relaunch a V1 funding cycle on V3.
 */
// function RelaunchV1FundingCycleForm() {
//   // TODO(@aeolian)
//   return null
// }

export function FundingCycleStep() {
  const localStoreRef = useRef<typeof store>()
  if (!localStoreRef.current) {
    localStoreRef.current = createStore()
  }

  return (
    <>
      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <RelaunchV2FundingCycleForm />
        </Provider>
      )}
    </>
  )
}
