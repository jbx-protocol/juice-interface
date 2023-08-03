import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { TOP_NAV } from 'constants/fathomEvents'
import { trackFathomGoal } from 'lib/fathom'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { QuickProjectSearchContext } from './QuickProjectSearchContext'

export const QuickProjectSearchButton = ({
  className,
}: {
  className?: string
}) => {
  const { modal } = useContext(QuickProjectSearchContext)

  return (
    <div
      className="flex cursor-pointer items-center gap-4"
      onClick={() => {
        modal.open()
        trackFathomGoal(TOP_NAV.SEARCH_CTA)
      }}
    >
      <MagnifyingGlassIcon
        className={twMerge(
          'h-6 w-6 transition-colors hover:text-bluebs-300',
          className,
        )}
      />

      <span className="font-medium md:hidden">
        <Trans>Search</Trans>
      </span>
    </div>
  )
}
