import { Trans } from '@lingui/macro'

import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'

export default function Project404({
  projectId,
  handle,
}: {
  projectId?: number | string | undefined
  handle?: string
}) {
  return (
    <div
      style={{
        padding: padding.app,
        height: '100%',
        ...layouts.centered,
      }}
    >
      <h2>
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
