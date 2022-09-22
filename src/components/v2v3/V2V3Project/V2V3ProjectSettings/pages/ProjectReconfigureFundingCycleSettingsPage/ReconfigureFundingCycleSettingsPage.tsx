import { V2ReconfigureFundingCycleForm } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ProjectReconfigureFundingCycleSettingsPage/ReconfigureFundingCycleForm'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'

// This component uses a local version of the entire Redux store
// so editing within the Reconfigure Funding modal does not
// conflict with existing Redux state. This is so editing a
// persisted Redux state and the Reconfigure Funding modal
// are independent.
export function ReconfigureFundingCycleSettingsPage() {
  const localStoreRef = useRef<typeof store>()
  if (!localStoreRef.current) {
    localStoreRef.current = createStore()
  }

  return (
    <>
      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <V2ReconfigureFundingCycleForm />
        </Provider>
      )}
    </>
  )
}
