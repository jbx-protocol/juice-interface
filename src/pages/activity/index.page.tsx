import { Trans } from '@lingui/macro'
import { AppWrapper } from 'components/common'
import Payments from 'pages/home/Payments'

export default function ActivityPage() {
  return (
    <AppWrapper>
      <div className="mx-auto max-w-xl px-4">
        <h1 className="m-0 text-3xl font-normal text-black dark:text-slate-100">
          <Trans>Activity</Trans>
        </h1>
        <p>
          <Trans>
            View all of the latest project activity made on Juicebox.
          </Trans>
        </p>

        <Payments />
      </div>
    </AppWrapper>
  )
}
