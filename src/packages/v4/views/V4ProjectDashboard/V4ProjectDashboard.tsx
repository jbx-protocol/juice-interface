import { CoverPhoto } from 'components/Project/ProjectHeader/CoverPhoto'
import { useJBContractContext } from 'juice-sdk-react'
import { ActivityList } from 'packages/v4/components/ActivityList/ActivitiyList'
import { NativeTokenValue } from 'packages/v4/components/NativeTokenValue'
import { useNativeTokenSurplus } from 'packages/v4/hooks/useNativeTokenSurplus'
import { twMerge } from 'tailwind-merge'
import { V4ProjectHeader } from './V4ProjectHeader'
import { V4ProjectTabs } from './V4ProjectTabs/V4ProjectTabs'

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
          <div
            className={twMerge(
              'mx-auto w-full min-w-0 max-w-xl px-4 md:px-0',
              '[@media(min-width:960px)]:flex [@media(min-width:960px)]:max-w-6xl [@media(min-width:960px)]:justify-between [@media(min-width:960px)]:gap-x-8',
            )}
          >
            {/* <PayRedeemCard
              className={twMerge(
                'mt-10 flex-1',
                '[@media(min-width:960px)]:order-last [@media(min-width:960px)]:min-w-[340px] [@media(min-width:960px)]:max-w-md',
              )}
            /> */}
            <V4ProjectTabs
              className={twMerge(
                'mt-10 w-full',
                '[@media(min-width:960px)]:order-first [@media(min-width:960px)]:max-w-[596px]',
              )}
            />
          </div>
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
