import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import Link from 'next/link'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { v2v3ProjectRoute } from 'packages/v2v3/utils/routes'
import { useContext } from 'react'

export const ProjectSettingsLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <>
      <header className="sticky top-0 right-0 z-10 mb-8 border-b border-solid border-b-grey-100 bg-white dark:border-b-slate-500 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-5">
          <h1 className="m-0 flex items-center gap-2 font-heading text-xl font-medium">
            <Cog6ToothIcon className="h-6 w-6" />
            <Trans>Manage project</Trans>
          </h1>

          <Link
            href={v2v3ProjectRoute({ projectId, handle })}
            className="text-secondary"
          >
            <XMarkIcon className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 pb-24 pt-5">{children}</div>
    </>
  )
}
