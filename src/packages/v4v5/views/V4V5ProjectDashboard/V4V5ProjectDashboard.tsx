import { Footer } from 'components/Footer/Footer'
import { CoverPhoto } from 'components/Project/ProjectHeader/CoverPhoto'
import { SuccessPayView } from 'packages/v4v5/components/ProjectDashboard/components/SuccessPayView/SuccessPayView'
import { useProjectDispatch } from 'packages/v4v5/components/ProjectDashboard/redux/hooks'
import { payRedeemActions } from 'packages/v4v5/components/ProjectDashboard/redux/payRedeemSlice'
import { projectCartActions } from 'packages/v4v5/components/ProjectDashboard/redux/projectCartSlice'
import { V4V5PayRedeemCard } from 'packages/v4v5/components/ProjectDashboard/V4V5PayRedeemCard/V4V5PayRedeemCard'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { useProjectPageQueries } from './hooks/useProjectPageQueries'
import { V4V5ProjectHeader } from './V4V5ProjectHeader'
import { V4V5ProjectTabs } from './V4V5ProjectTabs/V4V5ProjectTabs'
import { V4V5ActivityList } from './V4V5ProjectTabs/V4V5ActivityPanel/V4V5ActivityList'

export default function V4V5ProjectDashboard() {
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
      <div className="flex w-full justify-center md:px-6 pb-48">
        <div className="flex w-full max-w-6xl flex-col">
          <V4V5ProjectHeader className="mt-12 px-4 md:mt-4 md:px-0" />
          <div
            className={twMerge(
              'mx-auto w-full min-w-0 max-w-xl px-4 md:px-0',
              '[@media(min-width:960px)]:flex [@media(min-width:960px)]:max-w-6xl [@media(min-width:960px)]:justify-between [@media(min-width:960px)]:gap-x-8',
            )}
          >
            <div
              className={twMerge(
                'flex flex-col gap-8',
                '[@media(min-width:960px)]:order-last [@media(min-width:960px)]:min-w-[340px] [@media(min-width:960px)]:max-w-md',
              )}
            >
              <V4V5PayRedeemCard className="mt-10" />
              {/* Activity Section */}
              <div className="max-h-[600px] overflow-y-auto rounded-lg border border-grey-200 p-6 dark:border-slate-600">
                <V4V5ActivityList />
              </div>
            </div>
            <V4V5ProjectTabs
              className={twMerge(
                'mt-10 w-full',
                '[@media(min-width:960px)]:order-first [@media(min-width:960px)]:max-w-[596px]',
              )}
            />
          </div>
        </div>
      </div>
      <Footer />
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
