import { CoverPhoto } from 'components/Project/ProjectHeader/CoverPhoto'
import { SuccessPayView } from 'packages/v4/components/ProjectDashboard/components/SuccessPayView/SuccessPayView'
import { useProjectDispatch } from 'packages/v4/components/ProjectDashboard/redux/hooks'
import { payRedeemActions } from 'packages/v4/components/ProjectDashboard/redux/payRedeemSlice'
import { projectCartActions } from 'packages/v4/components/ProjectDashboard/redux/projectCartSlice'
import { V4PayRedeemCard } from 'packages/v4/components/ProjectDashboard/V4PayRedeemCard/V4PayRedeemCard'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { useProjectPageQueries } from './hooks/useProjectPageQueries'
// import { V4ProjectHeader } from './V4ProjectHeader'
// import { V4ProjectTabs } from './V4ProjectTabs/V4ProjectTabs'

export function V4ProjectDashboard() {
  const { projectPayReceipt } = useProjectPageQueries()

  if (projectPayReceipt !== undefined) {
    return (
      <div className="flex w-full flex-col items-center pb-48">
        <SuccessPayView />
      </div>
    )
  }

  return (
    <>
      <ResetStoreOnLoad />
      <div className="relative w-full">
        <CoverPhoto />
      </div>
      <div className="flex w-full justify-center md:px-6">
        <div className="flex w-full max-w-6xl flex-col">
          {/* <V4ProjectHeader className="mt-12 px-4 md:mt-4 md:px-0" /> */}
          <div
            className={twMerge(
              'mx-auto w-full min-w-0 max-w-xl px-4 md:px-0',
              '[@media(min-width:960px)]:flex [@media(min-width:960px)]:max-w-6xl [@media(min-width:960px)]:justify-between [@media(min-width:960px)]:gap-x-8',
            )}
          >
            <V4PayRedeemCard
              className={twMerge(
                'mt-10 flex-1',
                '[@media(min-width:960px)]:order-last [@media(min-width:960px)]:min-w-[340px] [@media(min-width:960px)]:max-w-md',
              )}
            />
            {/* <V4ProjectTabs
              className={twMerge(
                'mt-10 w-full',
                '[@media(min-width:960px)]:order-first [@media(min-width:960px)]:max-w-[596px]',
              )}
            /> */}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Reset the store on load.
 */
const ResetStoreOnLoad: React.FC = () => {
  const dispatch = useProjectDispatch()

  useEffect(() => {
    dispatch(projectCartActions.reset())
    dispatch(payRedeemActions.reset())
  }, [dispatch])

  return null
}
