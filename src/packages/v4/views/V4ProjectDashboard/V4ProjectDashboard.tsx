import { useJBContractContext } from 'juice-sdk-react'
import { ActivityList } from 'packages/v4/components/ActivityList/ActivitiyList'
import { NativeTokenValue } from 'packages/v4/components/NativeTokenValue'
import { useNativeTokenSurplus } from 'packages/v4/hooks/useNativeTokenSurplus'

export function V4ProjectDashboard() {
  const { projectId } = useJBContractContext()
  const { data: nativeTokenSurplus } = useNativeTokenSurplus()

  return (
    <div className="mx-auto max-w-5xl p-6">
      <header>
        <h1>Project #{projectId.toString()}</h1>
      </header>
      <div className="flex justify-between gap-2">
        <div>
          <div>
            Surplus (overflow):{' '}
            {nativeTokenSurplus ? (
              <NativeTokenValue wei={nativeTokenSurplus} />
            ) : null}
          </div>

          <div className="flex max-h-52 overflow-auto">
            <ActivityList />
          </div>
        </div>

        <div>
          Pay me
          <div>Input</div>
        </div>
      </div>
    </div>
  )
}
