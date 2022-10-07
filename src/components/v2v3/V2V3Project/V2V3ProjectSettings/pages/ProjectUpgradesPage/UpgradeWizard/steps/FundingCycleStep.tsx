import { useRef } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'
import { V2V3ReconfigureFundingCycleForm } from '../../../ReconfigureFundingCycleSettingsPage/ReconfigureFundingCycleForm'

export function FundingCycleStep() {
  const localStoreRef = useRef<typeof store>()
  if (!localStoreRef.current) {
    localStoreRef.current = createStore()
  }
  // TODO(@aeolian) populate store with the existing project's funding cycle data.

  return (
    <>
      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <V2V3ReconfigureFundingCycleForm />
        </Provider>
      )}
    </>
  )
}
