import { Trans } from '@lingui/macro'
import { PaymentsFeed } from 'components/Activity/PaymentsFeed'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function ActivityPage() {
  return (
    <AppWrapper>
      <div className="mx-auto max-w-xl px-4 pt-10 pb-20">
        <h1 className="m-0 mb-4 font-display text-3xl text-black dark:text-slate-100">
          <Trans>Activity</Trans>
        </h1>
        <p className="mb-10 text-grey-600 dark:text-slate-100">
          <Trans>View the latest payments on Juicebox.</Trans>
        </p>

        <PaymentsFeed />
      </div>
    </AppWrapper>
  )
}

export const getServerSideProps = globalGetServerSideProps
