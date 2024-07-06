import { useJBContractContext } from 'juice-sdk-react'
import { NativeTokenValue } from 'packages/v4/components/NativeTokenValue'
import { useNativeTokenSurplus } from 'packages/v4/hooks/useNativeTokenSurplus'

export function V4ProjectDashboard() {
  const { projectId } = useJBContractContext()
  const { data: nativeTokenSurplus } = useNativeTokenSurplus()

  return (
    <div>
      <h1>Project #{projectId.toString()}</h1>
      <div>
        Surplus (overflow):{' '}
        {nativeTokenSurplus ? (
          <NativeTokenValue wei={nativeTokenSurplus} />
        ) : null}
      </div>
    </div>
  )
}
