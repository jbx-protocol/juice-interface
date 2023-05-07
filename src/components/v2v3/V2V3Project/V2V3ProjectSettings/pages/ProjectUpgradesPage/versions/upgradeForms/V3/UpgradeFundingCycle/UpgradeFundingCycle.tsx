import { Callout } from 'components/Callout'
import { CV_V3 } from 'constants/cv'
import { V2V3ContractsProvider } from 'contexts/v2v3/Contracts/V2V3ContractsProvider'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'
import { useInitialEditingData } from '../../../../../ReconfigureFundingCycleSettingsPage/hooks/useInitialEditingData'
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
        <V2V3ContractsProvider initialCv={CV_V3}>
          <Provider store={localStoreRef.current}>
            <div className="flex flex-col gap-2">
              <h3 className="text-black dark:text-slate-100">
                Launch V3 funding cycle
              </h3>
              <p>
                You currently have a cycle on Juicebox V2. Use the form below to
                relaunch your cycle on Juicebox V3.
              </p>

              <Callout.Info className="mb-6">
                Your V2 cycle rules have been prefilled.
              </Callout.Info>

              <RelaunchV2FundingCycleForm />
            </div>
          </Provider>
        </V2V3ContractsProvider>
      )}
    </>
  )
}
