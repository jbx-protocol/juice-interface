import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useJBChainId, useJBContractContext } from 'juice-sdk-react'

import { Trans } from '@lingui/macro'
import { JB_CHAINS } from 'juice-sdk-core'
import Link from 'next/link'
import { v4ProjectRoute } from 'packages/v4/utils/routes'

export const ProjectSettingsLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()

  return (
    <>
      <header className="sticky top-0 right-0 z-10 mb-8 border-b border-solid border-b-grey-100 bg-white dark:border-b-slate-500 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-5">
          <h1 className="m-0 flex items-center gap-2 font-heading text-xl font-medium">
            <Cog6ToothIcon className="h-6 w-6" />
            {chainId ? (
              <Trans>Manage project on {JB_CHAINS[chainId]?.name}</Trans>
            ) : (
              <Trans>Manage project</Trans>
            )}
          </h1>
          {chainId ? (
            <Link
              href={v4ProjectRoute({ projectId: Number(projectId), chainId })}
              className="text-secondary"
            >
              <XMarkIcon className="h-6 w-6" />
            </Link>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 pb-24 pt-5">{children}</div>
    </>
  )
}
