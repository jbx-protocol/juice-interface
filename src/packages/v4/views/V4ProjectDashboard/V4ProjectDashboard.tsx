import { CoverPhoto } from 'components/Project/ProjectHeader/CoverPhoto'
import { useJBContractContext } from 'juice-sdk-react'
import { ActivityList } from 'packages/v4/components/ActivityList/ActivitiyList'
import { NativeTokenValue } from 'packages/v4/components/NativeTokenValue'
import { useNativeTokenSurplus } from 'packages/v4/hooks/useNativeTokenSurplus'
import { V4ProjectHeader } from './V4ProjectHeader'

export function V4ProjectDashboard() {
  const { projectId } = useJBContractContext()
  const { data: nativeTokenSurplus } = useNativeTokenSurplus()

  return (
    <>
      <div className="relative w-full">
        <CoverPhoto />
      </div>
      <div className="flex w-full justify-center md:px-6">
        <div className="flex w-full max-w-6xl flex-col">
          <V4ProjectHeader className="mt-12 px-4 md:mt-4 md:px-0" />
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <div>
          <div>
            Surplus (overflow):{' '}
            {nativeTokenSurplus ? (
              <NativeTokenValue wei={nativeTokenSurplus} />
            ) : null}
          </div>
          <div>Project Id: {projectId.toString()}</div>

          <div className="flex max-h-52 overflow-auto">
            <ActivityList />
          </div>
        </div>

        <div>
          Pay me
          <div>Input</div>
        </div>
      </div>
    </>
  )
}
