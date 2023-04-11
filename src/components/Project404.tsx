import { Trans } from '@lingui/macro'

export default function Project404({
  projectId,
  handle,
}: {
  projectId?: number | string | undefined
  handle?: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-5">
      <h2 className="text-2xl">
        {handle ? (
          <Trans>@{handle} not found</Trans>
        ) : projectId ? (
          <Trans>Project {projectId} not found</Trans>
        ) : (
          <Trans>Project not found</Trans>
        )}
      </h2>
    </div>
  )
}
